import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import TripCard from './TripCard';

export default function TripDashboard() {
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  useEffect(() => {
    base44.entities.Trip.list('start_date').then((list) => setTrips(list || [])).catch(() => setTrips([]));
  }, []);

  const upcoming = trips.filter((t) => t.status === 'upcoming');
  const past = trips.filter((t) => t.status === 'past');
  const bucket = trips.filter((t) => t.status === 'bucket_list');

  const Grid = ({ trips: list, empty }) =>
    list.length === 0 ? (
      <p className="py-10 text-center text-sm text-muted-foreground">{empty}</p>
    ) : (
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => (
          <TripCard key={t.id} trip={t} onClick={() => navigate(`/travel/${t.id}`)} />
        ))}
      </div>
    );

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Trips</h3>
      <Tabs defaultValue="upcoming" className="mt-3 w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="upcoming" className="min-h-[44px]">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past" className="min-h-[44px]">Past ({past.length})</TabsTrigger>
          <TabsTrigger value="bucket_list" className="min-h-[44px]">Bucket ({bucket.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming"><Grid trips={upcoming} empty="No upcoming trips planned." /></TabsContent>
        <TabsContent value="past"><Grid trips={past} empty="No past trips yet." /></TabsContent>
        <TabsContent value="bucket_list"><Grid trips={bucket} empty="Your bucket list is empty." /></TabsContent>
      </Tabs>
    </div>
  );
}