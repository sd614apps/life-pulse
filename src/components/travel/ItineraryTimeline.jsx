import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { Plane, Hotel, MapPin, Bus, Ticket } from 'lucide-react';

const TYPE_META = {
  flight: { icon: Plane, color: 'bg-sky-500/10 text-sky-600', label: 'Flight' },
  hotel: { icon: Hotel, color: 'bg-violet-500/10 text-violet-600', label: 'Hotel' },
  activity: { icon: MapPin, color: 'bg-emerald-500/10 text-emerald-600', label: 'Activity' },
  transport: { icon: Bus, color: 'bg-amber-500/10 text-amber-600', label: 'Transport' },
  other: { icon: Ticket, color: 'bg-muted text-muted-foreground', label: 'Other' },
};

export default function ItineraryTimeline({ tripId }) {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    base44.entities.TripEvent.filter({ trip_id: tripId })
      .then((list) => {
        setEvents(
          (list || []).sort(
            (a, b) =>
              new Date(`${a.event_date}T${a.event_time || '00:00'}`) -
              new Date(`${b.event_date}T${b.event_time || '00:00'}`)
          )
        );
      })
      .catch(() => setEvents([]));
  }, [tripId]);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Itinerary & Bookings</h3>
      {events.length === 0 ? (
        <p className="mt-4 py-6 text-center text-sm text-muted-foreground">No itinerary items for this trip yet.</p>
      ) : (
        <ol className="mt-5 space-y-1">
          {events.map((e, i) => {
            const meta = TYPE_META[e.type] || TYPE_META.other;
            const Icon = meta.icon;
            return (
              <li key={e.id} className="relative flex gap-3 pl-1">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-full ${meta.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  {i < events.length - 1 && <div className="my-1 w-px flex-1 bg-border/70" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">{e.title}</p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${meta.color}`}>{meta.label}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {format(parseISO(e.event_date), 'EEE d MMM')}
                    {e.event_time ? ` · ${e.event_time}` : ''}
                    {e.location ? ` · ${e.location}` : ''}
                  </p>
                  {e.details && <p className="mt-1 text-sm text-muted-foreground">{e.details}</p>}
                  {e.confirmation_code && (
                    <p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground">
                      <Ticket className="h-3.5 w-3.5" /> Conf: {e.confirmation_code}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}