import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO } from 'date-fns';
import { CalendarDays, MapPin, Users } from 'lucide-react';

const CATEGORY_COLOR = {
  family: 'bg-violet-500',
  health: 'bg-rose-500',
  school: 'bg-sky-500',
  work: 'bg-amber-500',
  travel: 'bg-emerald-500',
};

export default function CalendarTab() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.CalendarEvent.list('event_at', 100)
      .then((list) => setEvents(list || []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-card">
      {loading ? (
        <div className="p-6 text-sm text-muted-foreground">Loading events…</div>
      ) : events.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">No events scheduled.</div>
      ) : (
        <ul className="divide-y divide-border/60">
          {events.map((e) => (
            <li key={e.id} className="flex items-start gap-3 p-4">
              <span className={`mt-1.5 h-3 w-3 flex-shrink-0 rounded-full ${CATEGORY_COLOR[e.category] || 'bg-muted'}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">{e.title}</span>
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  {format(parseISO(e.event_at), 'EEEE, d MMM yyyy · h:mm a')} · {e.duration_minutes} min
                </div>
                {e.location && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" /> {e.location}
                  </div>
                )}
                {e.attendees && (
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" /> {e.attendees}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}