import React from 'react';
import { Image } from '@/components/ui/image';

export default function TileShell({ icon: Icon, title, accent, children, action, onClick, cover }) {
  const headerInner = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${cover ? 'bg-white/20 text-white' : accent}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className={`font-heading text-sm font-semibold ${cover ? 'text-white' : 'text-foreground'}`}>{title}</h3>
      </div>
      {action}
    </div>
  );

  if (cover) {
    return (
      <div
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
        className={`flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card ${onClick ? 'cursor-pointer hover:border-brand/40' : ''}`}
      >
        <div className="relative h-20">
          <Image src={cover} alt={title} fittingType="fill" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
          <div className="relative flex h-full items-center px-4">{headerInner}</div>
        </div>
        <div className="flex-1 p-5 pt-4">{children}</div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(e); } } : undefined}
      className={`flex flex-col rounded-2xl border border-border/70 bg-card p-5 ${onClick ? 'cursor-pointer hover:border-brand/40' : ''}`}
    >
      {headerInner}
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}