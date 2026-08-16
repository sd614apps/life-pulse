import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { useToast } from '@/components/ui/use-toast';
import { Check, Clock } from 'lucide-react';

const TIMING = { morning: 'Morning', noon: 'Noon', night: 'Night' };
const TIMING_COLOR = {
  morning: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  noon: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  night: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
};
const ORDER = ['morning', 'noon', 'night'];

export default function MedicationsTab() {
  const [meds, setMeds] = useState([]);
  const { toast } = useToast();

  const load = async () => {
    try {
      const list = await entities.Medication.list();
      setMeds(list || []);
    } catch (err) {
      console.error('[MedicationsTab.load]', err);
      setMeds([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markTaken = async (m) => {
    try {
      await entities.Medication.update(m.id, { taken: !m.taken });
      toast({ title: m.taken ? 'Marked as not taken' : 'Marked as taken' });
      load();
    } catch (err) {
      console.error('[MedicationsTab.markTaken]', err);
      toast({ title: 'Could not update status', variant: 'destructive' });
    }
  };

  const sorted = [...meds].sort((a, b) => ORDER.indexOf(a.timing) - ORDER.indexOf(b.timing));

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {sorted.map((m) => (
        <div key={m.id} className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <div
                className="h-5 w-12 rounded-full border-2 border-background shadow-sm"
                style={{ backgroundColor: m.pill_color || '#888' }}
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-foreground">{m.medication_name}</div>
              <div className="text-xs text-muted-foreground">{m.member_name} · {m.dose}</div>
              {m.instructions && (
                <div className="mt-1 text-xs text-muted-foreground">{m.instructions}</div>
              )}
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${TIMING_COLOR[m.timing] || 'bg-muted'}`}>
              <Clock className="mr-1 inline h-3 w-3" />
              {TIMING[m.timing] || m.timing} · {m.schedule_time}
            </span>
          </div>
          <button
            onClick={() => markTaken(m)}
            className={`mt-4 flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl text-base font-semibold transition-colors ${
              m.taken
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'bg-brand text-brand-foreground hover:bg-brand/90'
            }`}
          >
            <Check className="h-5 w-5" /> {m.taken ? 'Taken' : 'Mark Taken'}
          </button>
        </div>
      ))}
    </div>
  );
}