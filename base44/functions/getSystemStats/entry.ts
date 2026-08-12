import { createClientFromRequest } from '@base44/sdk';

// Anonymized platform statistics for the app-level system admin.
// Returns ONLY record counts — no personal content, no rows, no PII.
export default async function (req: Request): Promise<Response> {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const tables = [
      'User', 'Families', 'Profile', 'HealthLog', 'Medication', 'Transaction',
      'Holding', 'Trip', 'TravelDocument', 'VaultItem', 'MedicalRecord',
      'Appointment', 'CalendarEvent', 'SharedTask', 'EmergencyContact',
      'Notification', 'FeatureToggle', 'AuditLog',
    ];

    const counts: Record<string, number> = {};
    const entities = base44.asServiceRole.entities as Record<string, any>;

    for (const t of tables) {
      try {
        if (entities[t] && typeof entities[t].list === 'function') {
          const list = await entities[t].list('-updated_date', 1000);
          counts[t] = Array.isArray(list) ? list.length : 0;
        } else {
          counts[t] = 0;
        }
      } catch {
        counts[t] = -1;
      }
    }
    return Response.json({ counts });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}