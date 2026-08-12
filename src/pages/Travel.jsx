import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import ExpirationTracker from '@/components/travel/ExpirationTracker';
import TripDashboard from '@/components/travel/TripDashboard';
import { Plane } from 'lucide-react';

export default function Travel() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Plane} title="Travel Hub" description="Trips, itineraries & travel documents" cover="https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/0b82fa3a2_generated_image.png" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <ExpirationTracker />
        <TripDashboard />
      </main>
    </div>
  );
}