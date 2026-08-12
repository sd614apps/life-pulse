import React from 'react';
import ModuleHeader from '@/components/ModuleHeader';
import AssistantChat from '@/components/assistant/AssistantChat';
import { Sparkles } from 'lucide-react';

export default function Assistant() {
  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={Sparkles} title="LifePulse Assistant" description="Your private, accessibility-first helper" />
      <main className="mx-auto max-w-3xl px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <div className="h-[72vh] overflow-hidden rounded-2xl border border-border/70 shadow-sm">
          <AssistantChat />
        </div>
      </main>
    </div>
  );
}