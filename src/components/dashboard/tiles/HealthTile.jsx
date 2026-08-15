import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities } from '@/lib/entities';
import { HeartPulse, Check, CalendarDays, Plus } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import TileShell from './TileShell';

const COVER = '/images/health-tile-cover.png';

export default function HealthTile() {
  const navigate = useNavigate();
  const { formatDate } = useLocale();
  const [meds, setMeds] = useState(null);
  const [taken, setTaken] = useState([]);
  const [nextAppt, setNextAppt] = useState(null);

  useEffect(() => {
    entities.Medication.list()
      .then((list) => {
        const items = list || [];
        setMeds(items);
        setTaken(items.map(() => false));
      })
      .catch((err) => {
        console.error('[HealthTile.Medication]', err);
        setMeds([]);
        setTaken([]);
      });

    entities.Appointment.list({
      filter: { status: 'upcoming' },
    })
      .then((list) => {
        const items = (list || []).sort(
          (a, b) => new Date(a.appointment_at) - new Date(b.appointment_at)
        );
        setNextAppt(items[0] || null);
      })
      .catch((err) => {
        console.error('[HealthTile.Appointment]', err);
        setNextAppt(null);
      });
  }, []);

  const empty = meds !== null && meds.length === 0 && !nextAppt;

  return (
    <TileShell
      icon={HeartPulse}
      title="Health & Wellness"
      accent="bg-rose-500/10 text-rose-500"
      cover={COVER}
      onClick={() => navigate('/health')}
    >
      {meds === null ? (
        <div className="h-16 animate-pulse rounded bg-muted" />
      ) : empty ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/health');
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Log your first vital or medication
        </button>
      ) : (
        <>
          {nextAppt && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-500/5 px-3 py-2 text-xs text-foreground">
              <CalendarDays className="h-4 w-4 text-rose-500" />
              Next visit: {nextAppt.doctor_name} · {formatDate(nextAppt.appointment_at)}
            </div>
          )}
          <div className="mt-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-xs font-medium text-muted-foreground">Today's medications</p>
            {meds.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">No medications added.</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {meds.map((m, i) => (
                  <li key={m.id} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setTaken((prev) => prev.map((t, idx) => (idx === i ? !t : t)))
                      }
                      className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                        taken[i]
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : 'border-border text-transparent'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <span
                      className={`text-sm ${
                        taken[i] ? 'text-muted-foreground line-through' : 'text-foreground'
                      }`}
                    >
                      {m.medication_name}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      {m.schedule_time || m.timing}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </TileShell>
  );
}