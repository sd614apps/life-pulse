import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Image } from '@/components/ui/image';

export default function ModuleHeader({ icon: Icon, title, description, backTo = '/dashboard', cover }) {
  const navigate = useNavigate();
  const bar = (
    <div className="flex items-center gap-3">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => navigate(backTo)}
        className={cover ? 'h-10 w-10 text-white hover:bg-white/10' : 'h-10 w-10'}
        aria-label="Back to dashboard"
      >
        <ArrowLeft className="h-5 w-5" />
      </Button>
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cover ? 'bg-white/15 text-white' : 'bg-brand/10 text-brand'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h1 className={`font-heading text-lg font-semibold leading-tight ${cover ? 'text-white' : 'text-foreground'}`}>{title}</h1>
        {description && <p className={`text-xs ${cover ? 'text-white/80' : 'text-muted-foreground'}`}>{description}</p>}
      </div>
    </div>
  );

  if (cover) {
    return (
      <header className="relative overflow-hidden">
        <Image src={cover} alt={title} fittingType="fill" className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />
        <div className="relative mx-auto flex min-h-[92px] max-w-7xl items-center px-4 py-5 sm:px-6 lg:px-8">{bar}</div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">{bar}</div>
    </header>
  );
}