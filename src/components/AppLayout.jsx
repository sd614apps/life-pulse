import React from 'react';
import { Outlet } from 'react-router-dom';
import CopyrightFooter from '@/components/CopyrightFooter';
import AssistantWidget from '@/components/assistant/AssistantWidget';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Outlet />
      <CopyrightFooter />
      <AssistantWidget />
    </div>
  );
}