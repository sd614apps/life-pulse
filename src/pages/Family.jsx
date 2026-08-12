import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import CalendarTab from '@/components/family/CalendarTab';
import MembersTab from '@/components/family/MembersTab';
import TasksTab from '@/components/family/TasksTab';
import EmergencyTab from '@/components/family/EmergencyTab';
import { Home } from 'lucide-react';

export default function Family() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Home} title="Family Hub" description="Shared calendar, roles, tasks & emergency contacts" cover="https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/f643c4574_generated_image.png" />
      <main className="mx-auto max-w-7xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <Tabs defaultValue="calendar">
          <TabsList className="flex-wrap">
            <TabsTrigger value="calendar">Shared Calendar</TabsTrigger>
            <TabsTrigger value="members">Members & Roles</TabsTrigger>
            <TabsTrigger value="tasks">Shared Tasks</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contacts</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-4"><CalendarTab /></TabsContent>
          <TabsContent value="members" className="mt-4"><MembersTab /></TabsContent>
          <TabsContent value="tasks" className="mt-4"><TasksTab /></TabsContent>
          <TabsContent value="emergency" className="mt-4"><EmergencyTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}