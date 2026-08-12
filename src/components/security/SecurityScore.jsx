import React from 'react';

export default function SecurityScore({ score }) {
  const label = score >= 90 ? 'Very Secure' : score >= 70 ? 'Secure' : score >= 50 ? 'Fair' : 'At Risk';
  const color = score >= 90 ? '#10b981' : score >= 70 ? '#0ea5e9' : score >= 50 ? '#f59e0b' : '#ef4444';
  const r = 52;
  const c = 2 * Math.PI * r;
  const offset = c - (score / 100) * c;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Security Score</h3>
      <div className="mt-4 flex items-center gap-5">
        <div className="relative h-32 w-32">
          <svg className="h-32 w-32 -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r={r} fill="none" stroke="hsl(var(--muted))" strokeWidth="10" />
            <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-heading text-2xl font-bold text-foreground">
              {score}<span className="text-sm text-muted-foreground">/100</span>
            </span>
          </div>
        </div>
        <div>
          <p className="font-heading text-lg font-semibold" style={{ color }}>{label}</p>
          <p className="mt-1 text-xs text-muted-foreground">Based on your enabled security controls.</p>
        </div>
      </div>
    </div>
  );
}