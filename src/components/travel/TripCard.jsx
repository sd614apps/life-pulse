import React from 'react';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { MapPin, Calendar, Plane } from 'lucide-react';

export default function TripCard({ trip, onClick }) {
  const start = parseISO(trip.start_date);
  const days = differenceInCalendarDays(start, new Date());
  return (
    <button
      onClick={onClick}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card text-left transition hover:border-brand/40 hover:shadow-sm"
    >
      <div className="relative flex h-28 items-center justify-center bg-gradient-to-br from-brand/15 to-primary/10">
        <Plane className="h-8 w-8 text-brand" />
        {trip.status === 'upcoming' && days >= 0 && (
          <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-semibold text-foreground">
            {days === 0 ? 'Today' : `${days}d`}
          </span>
        )}
      </div>
      <div className="flex-1 p-4">
        <p className="font-heading text-base font-semibold text-foreground">{trip.title}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" />{trip.destination}</p>
        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="h-3.5 w-3.5" />{format(start, 'd MMM yyyy')}</p>
      </div>
    </button>
  );
}