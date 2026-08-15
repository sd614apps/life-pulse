import React, { useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import AssistantChat from './AssistantChat';

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          role="dialog"
          aria-label="LifePulse Assistant Dialog"
          aria-modal="false"
          className="fixed bottom-36 right-4 z-50 h-[64vh] w-[92vw] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl sm:right-6"
        >
          <AssistantChat />
        </div>
      )}
      <div className="fixed bottom-20 right-4 z-50 sm:right-6">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label={open ? 'Close LifePulse Assistant' : 'Open LifePulse Assistant'}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6" />}
        </button>
      </div>
    </>
  );
}