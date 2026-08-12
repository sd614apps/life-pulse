import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMoney } from '@/lib/useMoney';
import { useLocale } from '@/lib/LocaleContext';
import { Button } from '@/components/ui/button';
import { Check, X, Pill, Plane, CalendarDays, Wallet } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export default function AssistantCards({ card, action }) {
  if (card) return <CardRenderer card={card} />;
  if (action) return <ActionConfirm action={action} />;
  return null;
}

function CardRenderer({ card }) {
  const { money } = useMoney();
  const { formatDate } = useLocale();

  if (card.type === 'budget') {
    const pct = card.limit > 0 ? Math.min(100, Math.round((card.totalSpent / card.limit) * 100)) : 0;
    return (
      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Wallet className="h-4 w-4 text-emerald-500" /> Monthly spending</div>
        <p className="mt-1 text-2xl font-semibold text-foreground">{money(card.totalSpent)} <span className="text-sm font-normal text-muted-foreground">/ {money(card.limit)}</span></p>
        <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-muted"><div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} /></div>
        {card.byCategory?.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {card.byCategory.map((c) => (
              <li key={c.category} className="flex justify-between"><span className="capitalize text-foreground">{c.category}</span><span>{money(c.spent)}</span></li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (card.type === 'meds') {
    return (
      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Pill className="h-4 w-4 text-rose-500" /> Medications</div>
        {card.nextAppt && <p className="mt-1 text-xs text-muted-foreground">Next visit: {card.nextAppt.doctor} · {formatDate(card.nextAppt.at)}</p>}
        {card.items?.length ? (
          <ul className="mt-2 space-y-1.5">
            {card.items.map((m, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                {m.name} <span className="text-muted-foreground">{m.dose}</span>
                <span className="ml-auto text-xs text-muted-foreground">{m.timing}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-sm text-muted-foreground">No medications added.</p>}
      </div>
    );
  }

  if (card.type === 'trip') {
    const days = card.trip ? differenceInCalendarDays(parseISO(card.trip.start_date), new Date()) : 0;
    return (
      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><Plane className="h-4 w-4 text-sky-500" /> Travel</div>
        {card.trip ? (
          <div className="mt-1"><p className="text-lg font-semibold text-foreground">{card.trip.destination}</p><p className="text-xs text-muted-foreground">{formatDate(card.trip.start_date)} · {days} days away</p></div>
        ) : <p className="mt-1 text-sm text-muted-foreground">No upcoming trips.</p>}
        {card.docs?.length > 0 && (
          <ul className="mt-3 space-y-1 text-xs">
            {card.docs.map((d, i) => (
              <li key={i} className="flex justify-between text-foreground">
                <span className="capitalize">{d.type} · {d.member}</span>
                <span className={d.daysLeft < 0 ? 'text-red-600' : d.daysLeft <= 60 ? 'text-amber-600' : 'text-emerald-600'}>
                  {d.daysLeft < 0 ? 'Expired' : `In ${d.daysLeft}d`}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  if (card.type === 'events') {
    return (
      <div className="rounded-xl border border-border/70 bg-card p-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground"><CalendarDays className="h-4 w-4 text-violet-500" /> Family calendar</div>
        {card.items?.length ? (
          <ul className="mt-2 space-y-1.5">
            {card.items.map((e, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                <span className="h-2 w-2 rounded-full bg-violet-500" />
                {e.title}
                <span className="ml-auto text-xs text-muted-foreground">{formatDate(e.event_at)}</span>
              </li>
            ))}
          </ul>
        ) : <p className="mt-1 text-sm text-muted-foreground">No upcoming events.</p>}
      </div>
    );
  }

  return null;
}

function ActionConfirm({ action }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const confirm = async () => {
    setBusy(true);
    setError('');
    try {
      if (action.type === 'create_appointment') {
        await base44.entities.Appointment.create({
          member_name: action.fields.member_name || 'Me',
          doctor_name: action.fields.doctor_name || 'Doctor',
          appointment_at: action.fields.appointment_at,
          status: 'upcoming',
          specialty: action.fields.specialty || '',
          clinic_address: action.fields.clinic_address || '',
        });
      } else if (action.type === 'create_transaction') {
        await base44.entities.Transaction.create({
          description: action.fields.description || 'Expense',
          amount: Number(action.fields.amount) || 0,
          category: action.fields.category || 'other',
          type: 'expense',
          date: action.fields.date || new Date().toISOString().slice(0, 10),
        });
      } else if (action.type === 'snooze_notification') {
        const list = await base44.entities.Notification.filter({ status: 'active' });
        const words = (action.fields.title || '').toLowerCase().split(/\s+/).filter((w) => w.length > 3);
        const match = (list || []).find((n) => words.some((w) => n.title.toLowerCase().includes(w)));
        if (match) await base44.entities.Notification.update(match.id, { status: 'snoozed' });
        else throw new Error('No matching reminder found to snooze.');
      }
      setDone(true);
    } catch (e) {
      setError(e.message || 'Could not complete the action.');
    } finally {
      setBusy(false);
    }
  };

  if (done) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-3 text-sm text-emerald-700 dark:text-emerald-400">
        <Check className="h-4 w-4" /> Done.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border/70 bg-card p-4">
      <p className="text-sm font-semibold text-foreground">Confirm action</p>
      <p className="mt-1 text-xs text-muted-foreground capitalize">{action.type.replace('_', ' ')}</p>
      <pre className="mt-2 max-h-32 overflow-auto rounded-lg bg-muted/60 p-2 text-xs text-foreground">{JSON.stringify(action.fields, null, 2)}</pre>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={confirm} disabled={busy}>{busy ? 'Working…' : 'Confirm'}</Button>
        <span className="inline-flex items-center text-xs text-muted-foreground"><X className="mr-1 h-3.5 w-3.5" /> Dismiss to cancel</span>
      </div>
    </div>
  );
}