import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { CalendarClock, MapPin, Bell, Check } from 'lucide-react';

export default function AppointmentsTab() {
  const [appts, setAppts] = useState([]);
  const { toast } = useToast();

  const load = async () => {
    try {
      const list = await entities.Appointment.list({
        orderBy: 'appointment_at:desc',
        limit: 100,
      });
      setAppts(list || []);
    } catch (err) {
      console.error('[AppointmentsTab.load]', err);
      setAppts([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const sendReminder = async (a) => {
    try {
      await entities.Appointment.update(a.id, { reminder_sent: true });
      toast({
        title: 'Reminder scheduled',
        description: `SMS reminder queued for ${a.member_name} (simulated).`,
      });
      load();
    } catch (err) {
      console.error('[AppointmentsTab.sendReminder]', err);
      toast({ title: 'Could not schedule reminder', variant: 'destructive' });
    }
  };

  const sorted = [...appts].sort(
    (a, b) => new Date(b.appointment_at) - new Date(a.appointment_at)
  );
  const upcoming = sorted.filter((a) => a.status === 'upcoming');
  const past = sorted.filter((a) => a.status === 'past');

  const renderList = (list, isPast) => (
    <div>
      <h3 className="mb-2 text-sm font-medium text-muted-foreground">
        {isPast ? 'Past visits' : 'Upcoming'}
      </h3>
      <ul className="space-y-3">
        {list.map((a) => (
          <li key={a.id} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">
                  {a.doctor_name} <span className="font-normal text-muted-foreground">· {a.specialty}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {a.member_name} · {a.appointment_at ? format(parseISO(a.appointment_at), 'EEEE, d MMM yyyy · h:mm a') : '—'}
                </div>
                {a.clinic_address && (
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {a.clinic_address}
                  </div>
                )}
                {a.notes && <div className="mt-1 text-xs text-muted-foreground">{a.notes}</div>}
              </div>
            </div>
            {!isPast && (
              <button
                onClick={() => sendReminder(a)}
                disabled={a.reminder_sent}
                className={`mt-4 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold ${
                  a.reminder_sent
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-brand text-brand-foreground hover:bg-brand/90'
                }`}
              >
                {a.reminder_sent ? (
                  <><Check className="h-4 w-4" /> Reminder sent</>
                ) : (
                  <><Bell className="h-4 w-4" /> Send SMS reminder</>
                )}
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div className="space-y-6">
      {upcoming.length > 0 ? (
        renderList(upcoming, false)
      ) : (
        <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
      )}
      {past.length > 0 && renderList(past, true)}
    </div>
  );
}