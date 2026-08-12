import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import VitalsTab from '@/components/health/VitalsTab';
import MedicationsTab from '@/components/health/MedicationsTab';
import AppointmentsTab from '@/components/health/AppointmentsTab';
import MedicalRecordsTab from '@/components/health/MedicalRecordsTab';
import { HeartPulse } from 'lucide-react';

export default function Health() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={HeartPulse} title="Health & Wellness" description="Vitals, medications, appointments & records" cover="https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/3374a2875_generated_image.png" />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <Tabs defaultValue="vitals">
          <TabsList className="flex-wrap">
            <TabsTrigger value="vitals">Vitals & Daily Logs</TabsTrigger>
            <TabsTrigger value="meds">Medications</TabsTrigger>
            <TabsTrigger value="appts">Appointments</TabsTrigger>
            <TabsTrigger value="records">Medical Records</TabsTrigger>
          </TabsList>
          <TabsContent value="vitals" className="mt-4"><VitalsTab /></TabsContent>
          <TabsContent value="meds" className="mt-4"><MedicationsTab /></TabsContent>
          <TabsContent value="appts" className="mt-4"><AppointmentsTab /></TabsContent>
          <TabsContent value="records" className="mt-4"><MedicalRecordsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}