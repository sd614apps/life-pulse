import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Activity, Users, Database, BarChart3 } from 'lucide-react';

const LABELS = {
  User: 'Platform Users',
  Families: 'Families',
  Profile: 'Family Profiles',
  HealthLog: 'Health Logs',
  Medication: 'Medications',
  Transaction: 'Transactions',
  Holding: 'Investments',
  Trip: 'Trips',
  TravelDocument: 'Travel Documents',
  VaultItem: 'Vault Documents',
  MedicalRecord: 'Medical Records',
  Appointment: 'Appointments',
  CalendarEvent: 'Calendar Events',
  SharedTask: 'Shared Tasks',
  EmergencyContact: 'Emergency Contacts',
  Notification: 'Notifications',
  FeatureToggle: 'Feature Toggles',
  AuditLog: 'Audit Events',
};

export default function SystemStats() {
  const [counts, setCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.functions
      .invoke('getSystemStats', { body: {} })
      .then(({ data, error }) => {
        if (error) throw error;
        setCounts(data?.counts || {});
      })
      .catch((err) => {
        console.error('[SystemStats.getSystemStats]', err);
        setCounts({});
      })
      .finally(() => setLoading(false));
  }, []);

  const entries = counts ? Object.entries(counts) : [];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-card p-5">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <BarChart3 className="h-4 w-4" /> Anonymized platform statistics
        </h3>
        <p className="text-xs text-muted-foreground">
          Aggregate record counts only — no personal content is exposed to the system admin.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {entries.map(([key, val]) => (
            <div key={key} className="rounded-2xl border border-border/70 bg-card p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                {key === 'User' || key === 'Families' ? (
                  <Users className="h-4 w-4" />
                ) : (
                  <Database className="h-4 w-4" />
                )}
                <span className="text-[11px] font-medium uppercase tracking-wide">
                  {LABELS[key] || key}
                </span>
              </div>
              <p className="mt-2 font-heading text-2xl font-semibold text-foreground">
                {val < 0 ? '—' : val}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
        <Activity className="h-4 w-4 text-emerald-600" />
        <p className="text-xs text-emerald-700">
          Zero-knowledge enforced: the system admin cannot read rows from private user tables (health, finance, vault, trips).
        </p>
      </div>
    </div>
  );
}