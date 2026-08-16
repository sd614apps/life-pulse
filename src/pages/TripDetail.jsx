import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { entities } from '@/lib/entities';
import ModuleHeader from '@/components/ModuleHeader';
import ItineraryTimeline from '@/components/travel/ItineraryTimeline';
import PackingList from '@/components/travel/PackingList';
import { Plane, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO } from 'date-fns';

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    entities.Trip.get(id)
      .then(setTrip)
      .catch((err) => {
        console.error('[TripDetail.entities.Trip.get]', err);
        setTrip(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background">
        <ModuleHeader icon={Plane} title="Trip" description="" />
        <main className="mx-auto max-w-3xl px-4 py-10 text-center">
          <p className="text-sm text-muted-foreground">This trip could not be found.</p>
          <Button onClick={() => navigate('/travel')} className="mt-4">Back to Travel Hub</Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader
        icon={Plane}
        title={trip.title}
        description={`${trip.destination || ''} · ${
          trip.start_date ? format(parseISO(trip.start_date), 'd MMM yyyy') : ''
        }`}
      />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <Button variant="outline" onClick={() => navigate('/travel')} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> All trips
        </Button>
        <ItineraryTimeline tripId={id} />
        <PackingList tripId={id} />
      </main>
    </div>
  );
}