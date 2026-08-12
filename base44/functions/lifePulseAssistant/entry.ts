import { createClientFromRequest } from '@base44/sdk';

const SYSTEM = `You are LifePulse Assistant, a private, accessibility-first helper inside the LifePulse personal management app. Rules:
- Operate ephemerally: never store conversation history, never use user content for model training or external storage.
- PII in the user's message has already been redacted client-side; never attempt to recover or infer real identifiers.
- Respect the user's family role. A dependent/child account must NOT receive financial summaries or restricted health records.
- Be concise, warm, and clear (1-3 sentences). Use plain language suitable for all ages.
- When data is provided to you, summarize it helpfully without exposing raw identifiers.`;

interface AppUser {
  data?: {
    family_role?: string;
    role?: string;
    view_mode?: string;
  };
  role?: string;
}

export default async function(req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = (await base44.auth.me()) as AppUser | null;
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const message = String(body.message || '').slice(0, 1000);
    const capability = String(body.capability || 'chat');
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

    const userData = user.data || {};
    const familyRole = userData.family_role || userData.role || user.role || 'member';
    const isDependent = familyRole === 'dependent' || userData.view_mode === 'dependent';

    let card: unknown = null;
    let action: unknown = null;
    let contextData = '';

    if (capability === 'query_finance_spending') {
      if (isDependent) return Response.json({ reply: 'Dependent accounts cannot access financial data.', card: null, action: null });
      const txns = await base44.entities.Transaction.list('-date', 100);
      const cats = await base44.entities.BudgetCategory.list();
      const monthKey = new Date().toISOString().slice(0, 7);
      const monthTxns = (txns || []).filter((t: { date?: string }) => (t.date || '').slice(0, 7) === monthKey);
      const totalSpent = monthTxns.filter((t: { type?: string }) => t.type === 'expense').reduce((s: number, t: { amount?: number }) => s + (t.amount || 0), 0);
      
      const byCat: Record<string, number> = {};
      monthTxns.filter((t: { type?: string }) => t.type === 'expense').forEach((t: { category?: string; amount?: number }) => { 
        const c = t.category || 'other'; 
        byCat[c] = (byCat[c] || 0) + (t.amount || 0); 
      });
      
      const limit = (cats || []).reduce((s: number, c: { limit?: number }) => s + (c.limit || 0), 0);
      const byCategory = Object.entries(byCat).map(([category, spent]) => ({ category, spent, limit: 0 }));
      card = { type: 'budget', totalSpent, limit, byCategory };
      contextData = JSON.stringify({ totalSpent, limit, byCategory });

    } else if (capability === 'query_health_meds') {
      const meds = await base44.entities.Medication.list();
      const appts = await base44.entities.Appointment.filter({ status: 'upcoming' });
      const nextAppt = (appts || []).sort((a: Record<string, any>, b: Record<string, any>) => {
        const dateA = a.appointment_at ? new Date(a.appointment_at).getTime() : 0;
        const dateB = b.appointment_at ? new Date(b.appointment_at).getTime() : 0;
        return dateA - dateB;
        })[0] || null;
      
      const items = (meds || []).map((m: { medication_name?: string; dose?: string; schedule_time?: string; timing?: string }) => ({ 
        name: m.medication_name, 
        dose: m.dose, 
        timing: m.schedule_time || m.timing 
      }));
      
      card = { type: 'meds', items, nextAppt: nextAppt ? { doctor: nextAppt.doctor_name, at: nextAppt.appointment_at } : null };
      contextData = JSON.stringify({ meds: items, nextAppt: (card as { nextAppt: unknown }).nextAppt });

    } else if (capability === 'query_travel_next') {
      const trips = await base44.entities.Trip.filter({ status: 'upcoming' });
      const docs = await base44.entities.TravelDocument.list();
      const trip = (trips || []).sort((a: Record<string, any>, b: Record<string, any>) => {
        const dateA = a.start_date ? new Date(a.start_date).getTime() : 0;
        const dateB = b.start_date ? new Date(b.start_date).getTime() : 0;
        return dateA - dateB;
        })[0] || null;
      
      const docCards = (docs || []).map((d: Record<string, any>) => {
        const expiryTime = d.expiry_date ? new Date(d.expiry_date).getTime() : new Date().getTime();
        const days = Math.floor((expiryTime - new Date().getTime()) / 86400000);
        return { 
            type: d.doc_type, 
            member: d.member_name, 
            expiry: d.expiry_date || '', 
            daysLeft: days 
        };
        });
      
      card = { type: 'trip', trip: trip ? { title: trip.title, destination: trip.destination, start_date: trip.start_date } : null, docs: docCards };
      contextData = JSON.stringify({ trip: (card as { trip: unknown }).trip, docs: docCards });

    } else if (capability === 'query_family_events') {
      const events = await base44.entities.CalendarEvent.list('-event_at', 20);
      const upcoming = (events || [])
        .filter((e: Record<string, any>) => e.event_at && new Date(e.event_at).getTime() >= new Date().getTime())
        .slice(0, 6);
      card = { type: 'events', items: upcoming.map((e: { title?: string; event_at?: string; category?: string }) => ({ title: e.title, event_at: e.event_at, category: e.category })) };
      contextData = JSON.stringify({ events: (card as { items: unknown }).items });

    } else if (capability === 'action') {
      const extracted = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `${SYSTEM}\nExtract a single structured action from this user request. Supported types and fields:\n- create_appointment: { member_name?, doctor_name, specialty?, clinic_address?, appointment_at (ISO 8601) }\n- create_transaction: { description, amount (number), category?, date (YYYY-MM-DD) }\n- snooze_notification: { title }\nIf the request is not actionable, return { action: null }. Return JSON { action: { type, fields } }.\nRequest: "${message}"`,
        response_json_schema: {
          type: 'object',
          properties: {
            action: {
              type: 'object',
              properties: { type: { type: 'string' }, fields: { type: 'object' } },
            },
          },
          required: ['action'],
        },
      }) as { action?: unknown };
      
      action = (extracted && extracted.action) || null;
    }

    const prompt = `${SYSTEM}\nFamily role: ${familyRole}.${isDependent ? ' Dependent: do not provide financial or restricted health data.' : ''}\n${contextData ? `Relevant data (summarize for the user; do not expose raw identifiers): ${contextData}` : ''}\n${action ? `A confirmation card will be shown for this action: ${JSON.stringify(action)}. Acknowledge it briefly.` : ''}\nConversation so far: ${JSON.stringify(history)}\nUser: ${message}\nReply concisely (1-3 sentences):`;

    const llmResp = await base44.asServiceRole.integrations.Core.InvokeLLM({ prompt }) as string | { reply?: string };
    const reply = typeof llmResp === 'string' ? llmResp : (llmResp && llmResp.reply) || 'Here you go.';

    return Response.json({ reply, card, action });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}