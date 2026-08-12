import { createClientFromRequest } from '@base44/sdk';

const TRANSACTIONS = [
  { description: 'Monthly Salary', amount: 4200, category: 'income', type: 'income', family_member: 'Eleanor Hayes', date: '2026-08-01' },
  { description: 'Mortgage Payment', amount: -1800, category: 'housing', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-08-02' },
  { description: 'Whole Foods', amount: -186.4, category: 'groceries', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-08-03' },
  { description: 'Electricity Bill', amount: -140, category: 'utilities', type: 'expense', family_member: 'Marcus Hayes', date: '2026-08-04' },
  { description: 'Netflix Subscription', amount: -15.99, category: 'entertainment', type: 'expense', family_member: 'Mia Hayes', date: '2026-08-04' },
  { description: 'Pharmacy Refill', amount: -42.5, category: 'healthcare', type: 'expense', family_member: 'Arthur Hayes', date: '2026-08-05' },
  { description: 'Gas Station', amount: -68, category: 'other', type: 'expense', family_member: 'Marcus Hayes', date: '2026-08-05' },
  { description: 'Doctor Copay', amount: -30, category: 'healthcare', type: 'expense', family_member: 'Arthur Hayes', date: '2026-07-28' },
  { description: 'Farmers Market', amount: -52.3, category: 'groceries', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-07-27' },
  { description: 'Water Bill', amount: -38, category: 'utilities', type: 'expense', family_member: 'Marcus Hayes', date: '2026-07-20' },
  { description: 'Movie Tickets', amount: -45, category: 'entertainment', type: 'expense', family_member: 'Marcus Hayes', date: '2026-07-19' },
  { description: 'Freelance Project', amount: 850, category: 'income', type: 'income', family_member: 'Eleanor Hayes', date: '2026-07-15' },
  { description: 'Internet Bill', amount: -60, category: 'utilities', type: 'expense', family_member: 'Marcus Hayes', date: '2026-07-15' },
  { description: 'Restaurant Dinner', amount: -78.5, category: 'entertainment', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-07-12' },
  { description: 'Grocery Run', amount: -112.35, category: 'groceries', type: 'expense', family_member: 'Marcus Hayes', date: '2026-08-06' },
  { description: 'Dental Cleaning', amount: -95, category: 'healthcare', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-07-30' },
  { description: 'Gym Membership', amount: -39.99, category: 'other', type: 'expense', family_member: 'Mia Hayes', date: '2026-08-03' },
  { description: 'Birthday Gift', amount: -25, category: 'other', type: 'expense', family_member: 'Eleanor Hayes', date: '2026-07-22' },
  { description: 'Phone Bill', amount: -55, category: 'utilities', type: 'expense', family_member: 'Marcus Hayes', date: '2026-07-18' },
  { description: 'Stock Dividend', amount: 124.5, category: 'income', type: 'income', family_member: 'Marcus Hayes', date: '2026-07-10' },
];

const HOLDINGS = [
  { asset_name: 'S&P 500 ETF (VOO)', asset_class: 'stocks_etfs', balance: 62000, daily_change_amount: 840, daily_change_pct: 1.37, risk_level: 'medium' },
  { asset_name: 'Apple Inc. (AAPL)', asset_class: 'stocks_etfs', balance: 18500, daily_change_amount: -120, daily_change_pct: -0.65, risk_level: 'high' },
  { asset_name: 'Family Home', asset_class: 'real_estate', balance: 245000, daily_change_amount: 0, daily_change_pct: 0, risk_level: 'low' },
  { asset_name: 'Bitcoin (BTC)', asset_class: 'crypto', balance: 12500, daily_change_amount: 360, daily_change_pct: 2.96, risk_level: 'high' },
  { asset_name: '401(k) Retirement Fund', asset_class: 'retirement', balance: 88000, daily_change_amount: 210, daily_change_pct: 0.24, risk_level: 'medium' },
  { asset_name: 'High-Yield Savings', asset_class: 'cash', balance: 24580, daily_change_amount: 2.1, daily_change_pct: 0.01, risk_level: 'low' },
  { asset_name: 'Vanguard Bond Fund (BND)', asset_class: 'stocks_etfs', balance: 14200, daily_change_amount: 18, daily_change_pct: 0.13, risk_level: 'low' },
  { asset_name: 'Ethereum (ETH)', asset_class: 'crypto', balance: 6300, daily_change_amount: -180, daily_change_pct: -2.78, risk_level: 'high' },
];

const HEALTH_LOGS = [
  { member_name: 'Eleanor Hayes', metric_type: 'heart_rate', value: 72, secondary_value: 0, unit: 'bpm', logged_at: '2026-08-07T08:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Eleanor Hayes', metric_type: 'blood_pressure', value: 118, secondary_value: 76, unit: 'mmHg', logged_at: '2026-08-07T08:05:00Z', status: 'logged', notes: '' },
  { member_name: 'Eleanor Hayes', metric_type: 'steps', value: 8420, secondary_value: 0, unit: 'steps', logged_at: '2026-08-06T21:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Marcus Hayes', metric_type: 'heart_rate', value: 68, secondary_value: 0, unit: 'bpm', logged_at: '2026-08-07T07:30:00Z', status: 'logged', notes: '' },
  { member_name: 'Marcus Hayes', metric_type: 'blood_pressure', value: 124, secondary_value: 82, unit: 'mmHg', logged_at: '2026-08-06T07:40:00Z', status: 'logged', notes: '' },
  { member_name: 'Marcus Hayes', metric_type: 'steps', value: 11250, secondary_value: 0, unit: 'steps', logged_at: '2026-08-06T21:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Arthur Hayes', metric_type: 'heart_rate', value: 65, secondary_value: 0, unit: 'bpm', logged_at: '2026-08-07T09:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Arthur Hayes', metric_type: 'blood_pressure', value: 134, secondary_value: 86, unit: 'mmHg', logged_at: '2026-08-07T09:05:00Z', status: 'logged', notes: '' },
  { member_name: 'Arthur Hayes', metric_type: 'blood_sugar', value: 110, secondary_value: 0, unit: 'mg/dL', logged_at: '2026-08-07T07:00:00Z', status: 'logged', notes: 'fasting' },
  { member_name: 'Mia Hayes', metric_type: 'steps', value: 15300, secondary_value: 0, unit: 'steps', logged_at: '2026-08-06T21:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Mia Hayes', metric_type: 'heart_rate', value: 78, secondary_value: 0, unit: 'bpm', logged_at: '2026-08-06T18:00:00Z', status: 'logged', notes: '' },
  { member_name: 'Eleanor Hayes', metric_type: 'blood_sugar', value: 95, secondary_value: 0, unit: 'mg/dL', logged_at: '2026-08-05T07:30:00Z', status: 'logged', notes: 'fasting' },
];

const MEDICATIONS = [
  { member_name: 'Arthur Hayes', medication_name: 'Metformin', dose: '500mg', timing: 'morning', schedule_time: '08:00', instructions: 'With breakfast', pill_color: '#ffffff', taken: false },
  { member_name: 'Arthur Hayes', medication_name: 'Lisinopril', dose: '10mg', timing: 'morning', schedule_time: '08:00', instructions: '', pill_color: '#facc15', taken: false },
  { member_name: 'Eleanor Hayes', medication_name: 'Atorvastatin', dose: '20mg', timing: 'night', schedule_time: '22:00', instructions: 'Before bed', pill_color: '#3b82f6', taken: false },
  { member_name: 'Marcus Hayes', medication_name: 'Vitamin D3', dose: '1000 IU', timing: 'morning', schedule_time: '09:00', instructions: '', pill_color: '#f59e0b', taken: true },
  { member_name: 'Mia Hayes', medication_name: 'Multivitamin', dose: '1 tablet', timing: 'morning', schedule_time: '08:30', instructions: '', pill_color: '#ec4899', taken: false },
];

const NOTIFICATIONS = [
  { title: 'Mortgage due in 3 days', description: 'Housing payment of $1,800 due soon.', severity: 'pending', category: 'finance', due_date: '2026-08-10T09:00:00Z', status: 'active', target_path: '/finance', amount: '1800' },
  { title: 'Arthur passport expiring', description: 'Passport expires 20 Sep 2026.', severity: 'critical', category: 'travel', due_date: '2026-09-20T00:00:00Z', status: 'active', target_path: '/travel', amount: '' },
  { title: 'Metformin refill due', description: 'Arthur Hayes · 500mg · morning.', severity: 'pending', category: 'health', due_date: '2026-08-07T08:00:00Z', status: 'active', target_path: '/health', amount: '' },
  { title: 'Housing budget 90% used', description: '1,800 / 2,000 spent this month.', severity: 'pending', category: 'finance', due_date: '2026-08-31T23:59:00Z', status: 'active', target_path: '/finance', amount: '1800' },
  { title: 'Dental appointment upcoming', description: 'Eleanor Hayes · cleaning on 12 Aug.', severity: 'upcoming', category: 'health', due_date: '2026-08-12T10:00:00Z', status: 'active', target_path: '/health', amount: '' },
  { title: 'Vault: Passport scan expiring', description: 'Arthur passport scan expires 12 Sep.', severity: 'pending', category: 'vault', due_date: '2026-09-12T00:00:00Z', status: 'active', target_path: '/vault', amount: '' },
];

export default async function(req: Request) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
    if (user.role !== 'admin') return Response.json({ error: 'Forbidden' }, { status: 403 });

    const counts: Record<string, number> = {};
    const entities: Array<[string, Record<string, unknown>[]]> = [
      ['Transaction', TRANSACTIONS],
      ['Holding', HOLDINGS],
      ['HealthLog', HEALTH_LOGS],
      ['Medication', MEDICATIONS],
      ['Notification', NOTIFICATIONS],
    ];

    for (const [name, data] of entities) {
      try {
        await base44.entities[name].deleteMany({});
        await base44.entities[name].bulkCreate(data);
        counts[name] = data.length;
      } catch (e) {
        counts[name] = -1;
      }
    }

    const recreated = Object.values(counts).reduce((s, n) => s + (n > 0 ? n : 0), 0);

    try {
      await base44.entities.AuditLog.create({
        event_type: 'reset',
        message: 'Seed data reset to baseline by Admin',
        actor: user.email,
        severity: 'warning',
        metadata: JSON.stringify(counts),
      });
    } catch (e) {}

    return Response.json({ ok: true, counts, recreated });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return Response.json({ error: message }, { status: 500 });
  }
}