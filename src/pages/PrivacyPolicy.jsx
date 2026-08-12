import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock } from 'lucide-react';
import { PrivacyContent } from '@/components/legal/LegalContent';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex h-9 w-9 items-center justify-center rounded-lg border border-border/70 hover:bg-accent" aria-label="Back">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-brand" />
            <h1 className="font-heading text-lg font-semibold">Privacy Policy</h1>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-8 pb-28 sm:px-6">
        <p className="text-sm text-muted-foreground">Last updated: August 9, 2026</p>
        <div className="mt-6"><PrivacyContent /></div>
      </main>
    </div>
  );
}