import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { parseISO, differenceInCalendarDays } from 'date-fns';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';

export default function ExpirationTracker() {
  const { formatDate } = useLocale();
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    entities.TravelDocument.list()
      .then((list) => setDocs(list || []))
      .catch((err) => {
        console.error('[ExpirationTracker.TravelDocument]', err);
        setDocs([]);
      });
  }, []);

  const sorted = [...docs].sort(
    (a, b) => new Date(a.expiry_date) - new Date(b.expiry_date)
  );

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Document Expiration Tracker</h3>
      <p className="text-xs text-muted-foreground">Passports & visas expiring within 6 months are flagged</p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.length === 0 && (
          <p className="col-span-full py-4 text-center text-sm text-muted-foreground">
            No travel documents tracked.
          </p>
        )}
        {sorted.map((d) => {
          const days = d.expiry_date
            ? differenceInCalendarDays(parseISO(d.expiry_date), new Date())
            : 0;
          const soon = days <= 180;
          const critical = days <= 60;
          return (
            <div
              key={d.id}
              className={`flex items-center gap-3 rounded-xl border p-3 ${
                critical
                  ? 'border-red-500/40 bg-red-500/5'
                  : soon
                  ? 'border-amber-500/40 bg-amber-500/5'
                  : 'border-border/70'
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                  critical
                    ? 'bg-red-500/10 text-red-600'
                    : soon
                    ? 'bg-amber-500/10 text-amber-600'
                    : 'bg-emerald-500/10 text-emerald-600'
                }`}
              >
                {soon ? <AlertTriangle className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium capitalize text-foreground">
                  {d.doc_type} · {d.member_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {d.country} · {days < 0 ? 'expired' : 'expires'} {d.expiry_date ? formatDate(d.expiry_date) : '—'}
                </p>
              </div>
              <span
                className={`text-xs font-semibold ${
                  critical ? 'text-red-600' : soon ? 'text-amber-600' : 'text-emerald-600'
                }`}
              >
                {days < 0 ? 'Expired' : `In ${days}d`}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}