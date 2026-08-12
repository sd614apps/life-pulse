import React from 'react';
import { Activity, Type, Contrast, EyeOff, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAccessibility } from '@/lib/AccessibilityContext';

function ToggleChip({ active, onClick, icon: Icon, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={label}
      className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
        active
          ? 'border-brand bg-brand/10 text-brand'
          : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
      }`}
    >
      <Icon className="h-4 w-4" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

export default function SiteHeader({ onSignIn, authLabel = 'Sign In' }) {
  const {
    largeText,
    toggleLargeText,
    highContrast,
    toggleHighContrast,
    privacyMode,
    togglePrivacyMode,
  } = useAccessibility();

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-6 py-3 lg:px-8">
        <a href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand text-brand-foreground">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-semibold text-foreground">LifePulse</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#security" className="transition-colors hover:text-foreground">Security</a>
          <a href="#stories" className="transition-colors hover:text-foreground">Stories</a>
        </nav>

        <div className="flex items-center gap-2">
          <ToggleChip active={largeText} onClick={toggleLargeText} icon={Type} label="Large Text" />
          <ToggleChip active={highContrast} onClick={toggleHighContrast} icon={Contrast} label="High Contrast" />
          <Button
            onClick={onSignIn}
            className="ml-1 hidden min-h-[48px] gap-2 rounded-full bg-brand px-5 text-brand-foreground hover:bg-brand/90 sm:inline-flex"
          >
            <LogIn className="h-4 w-4" />
            {authLabel}
          </Button>
        </div>
      </div>
    </header>
  );
}