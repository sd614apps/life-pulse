import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { FileText, FlaskConical, Image, Syringe, AlertTriangle, HeartPulse } from 'lucide-react';

const TYPE = {
  lab_report: { label: 'Lab Report', icon: FlaskConical, color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400' },
  imaging: { label: 'Imaging', icon: Image, color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400' },
  prescription: { label: 'Prescription', icon: FileText, color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  immunization: { label: 'Immunization', icon: Syringe, color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
  allergy: { label: 'Allergy', icon: AlertTriangle, color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400' },
  condition: { label: 'Condition', icon: HeartPulse, color: 'bg-brand/10 text-brand' },
};

export default function MedicalRecordsTab() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.MedicalRecord.list('-date', 100)
      .then((list) => setRecords(list || []))
      .catch(() => setRecords([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-10 text-center text-sm text-muted-foreground">Loading records…</div>;

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {records.map((r) => {
        const t = TYPE[r.record_type] || TYPE.prescription;
        return (
          <div key={r.id} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${t.color}`}>
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{t.label}</span>
                <div className="text-sm font-semibold text-foreground">{r.title}</div>
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{r.summary}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              {r.member_name} · {format(parseISO(r.date), 'd MMM yyyy')} · {r.provider}
            </div>
          </div>
        );
      })}
    </div>
  );
}