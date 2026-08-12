import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Plane, CloudSun, Ticket, MapPin, Plus } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import { useLocale } from '@/lib/LocaleContext';
import TileShell from './TileShell';

const COVER = 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/0b82fa3a2_generated_image.png';

export default function TravelTile() {
  const navigate = useNavigate();
  const { formatDate } = useLocale();
  const [trip, setTrip] = useState(null);

  useEffect(() => {
    base44.entities.Trip.filter({ status: 'upcoming' }).then((list) => {
      const items = (list || []).sort((a, b) => new Date(a.start_date) - new Date(b.start_date));
      setTrip(items[0] || null);
    }).catch(() => setTrip(null));
  }, []);

  const days = trip ? differenceInCalendarDays(parseISO(trip.start_date), new Date()) : 0;

  return (
    <TileShell
      icon={Plane}
      title="Travel & Trips"
      accent="bg-sky-500/10 text-sky-500"
      cover={COVER}
      onClick={() => navigate('/travel')}
      action={trip ? <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white"><Ticket className="h-3.5 w-3.5" /> Trip</span> : null}
    >
      {trip === null ? (
        <div className="h-16 animate-pulse rounded bg-muted" />
      ) : !trip ? (
        <button onClick={(e) => { e.stopPropagation(); navigate('/travel'); }} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" /> Plan your first trip
        </button>
      ) : (
        <>
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3.5 w-3.5" /> Next trip</div>
              <p className="mt-1 font-heading text-xl font-semibold text-foreground">{trip.destination}</p>
              <p className="text-xs text-muted-foreground">{formatDate(trip.start_date)}</p>
            </div>
            <div className="flex flex-col items-center rounded-xl bg-sky-500/10 px-4 py-2 text-sky-600 dark:text-sky-400">
              <span className="text-2xl font-semibold leading-none">{days}</span>
              <span className="text-[10px] font-medium uppercase">days</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-secondary/60 px-3 py-2.5">
            <CloudSun className="h-5 w-5 text-amber-500" />
            <div className="text-sm"><span className="font-medium text-foreground">{trip.title}</span></div>
          </div>
        </>
      )}
    </TileShell>
  );
}