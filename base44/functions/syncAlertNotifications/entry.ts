import { createClientFromRequest } from '@base44/sdk';

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const now = new Date();
    const DAY = 86400000;
    const alerts: Array<{
      title: string;
      description: string;
      severity: string;
      category: string;
      status: string;
      due_date: string;
      target_path: string;
    }> = [];

    // Travel documents expiring within 6 months
    try {
      const docs = await base44.entities.TravelDocument.list();
      for (const d of (docs || [])) {
        if (!d.expiry_date) continue;
        const expiryTime = new Date(d.expiry_date).getTime();
        const days = Math.floor((expiryTime - now.getTime()) / DAY);
        if (days >= 0 && days <= 180) {
          alerts.push({
            title: `${d.doc_type} expiring — ${d.member_name}`,
            description: `${d.country ? d.country + ' ' : ''}${d.doc_type} expires ${new Date(d.expiry_date).toLocaleDateString()}`,
            severity: days <= 60 ? 'critical' : 'pending',
            category: 'travel',
            status: 'active',
            due_date: new Date(d.expiry_date).toISOString(),
            target_path: '/travel',
          });
        }
      }
    } catch (e) {}

    // Finance budget alerts (>= 80% used)
    try {
      const cats = await base44.entities.BudgetCategory.list();
      for (const c of (cats || [])) {
        if (!c.limit || c.limit <= 0) continue;
        const ratio = c.spent / c.limit;
        if (ratio >= 0.8) {
          alerts.push({
            title: `Budget alert — ${c.label}`,
            description: `${Math.round(ratio * 100)}% of ${c.label} budget used (${c.spent} / ${c.limit})`,
            severity: ratio >= 1 ? 'critical' : 'pending',
            category: 'finance',
            status: 'active',
            due_date: new Date().toISOString(),
            target_path: '/finance',
          });
        }
      }
    } catch (e) {}

    // Vault documents expiring within 60 days
    try {
      const items = await base44.entities.VaultItem.list();
      for (const v of (items || [])) {
        if (!v.expires_at) continue;
        const expiresAtTime = new Date(v.expires_at).getTime();
        const days = Math.floor((expiresAtTime - now.getTime()) / DAY);
        if (days >= 0 && days <= 60) {
          alerts.push({
            title: `Vault document expiring — ${v.title}`,
            description: `${v.title} expires ${new Date(v.expires_at).toLocaleDateString()}`,
            severity: days <= 14 ? 'critical' : 'pending',
            category: 'vault',
            status: 'active',
            due_date: new Date(v.expires_at).toISOString(),
            target_path: '/vault',
          });
        }
      }
    } catch (e) {}

    // Health: medication refills (not yet taken today)
    try {
      const meds = await base44.entities.Medication.list();
      for (const m of (meds || [])) {
        if (m.taken) continue;
        alerts.push({
          title: `Refill due — ${m.medication_name}`,
          description: `${m.member_name} · ${m.dose} · ${m.timing}`,
          severity: 'pending',
          category: 'health',
          status: 'active',
          due_date: new Date().toISOString(),
          target_path: '/health',
        });
      }
    } catch (e) {}

    // Health: upcoming appointments within 7 days
    try {
      const appts = await base44.entities.Appointment.list();
      for (const a of (appts || [])) {
        if (a.status !== 'upcoming' || !a.appointment_at) continue;
        const apptTime = new Date(a.appointment_at).getTime();
        const days = Math.floor((apptTime - now.getTime()) / DAY);
        if (days >= 0 && days <= 7) {
          alerts.push({
            title: `Upcoming appointment — ${a.doctor_name}`,
            description: `${a.member_name}${a.specialty ? ' · ' + a.specialty : ''} on ${new Date(a.appointment_at).toLocaleDateString()}`,
            severity: 'upcoming',
            category: 'health',
            status: 'active',
            due_date: a.appointment_at,
            target_path: '/health',
          });
        }
      }
    } catch (e) {}

    // Dedup by title so user actions (snooze/complete) are preserved
    let created = 0;
    try {
      const existing = await base44.entities.Notification.list();
      const titles = new Set((existing || []).map((n: Record<string, any>) => n.title));
      const toCreate = alerts.filter((a) => !titles.has(a.title));
      if (toCreate.length) {
        await base44.entities.Notification.bulkCreate(toCreate);
        created = toCreate.length;
      }
    } catch (e) {}

    return Response.json({ ok: true, alerts: alerts.length, created });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}