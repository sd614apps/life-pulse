import React from 'react';
import { Activity, Lock } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-foreground">
                <Activity className="h-4 w-4" />
              </div>
              <span className="font-heading text-lg font-semibold text-foreground">LifePulse</span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              A unified, privacy-first life management hub for every member of your family.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-brand" />
            Protected by Zero-Knowledge Encryption
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 text-sm text-muted-foreground">
          © {new Date().getFullYear()} LifePulse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}