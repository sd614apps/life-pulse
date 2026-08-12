import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMoney } from '@/lib/useMoney';

const DEFAULT_COLORS = {
  housing: '#0ea5e9',
  groceries: '#10b981',
  utilities: '#f59e0b',
  entertainment: '#8b5cf6',
  healthcare: '#ef4444',
};

export default function BudgetTracker() {
  const { money } = useMoney();
  const [cats, setCats] = useState([]);

  useEffect(() => {
    base44.entities.BudgetCategory.list().then((list) => setCats(list || [])).catch(() => setCats([]));
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Budget Tracker</h3>
      <p className="text-xs text-muted-foreground">Monthly progress by category</p>
      <div className="mt-4 space-y-4">
        {cats.map((c) => {
          const pct = c.limit > 0 ? Math.min(100, Math.round((c.spent / c.limit) * 100)) : 0;
          const over = c.spent > c.limit;
          const color = c.color || DEFAULT_COLORS[c.category] || '#64748b';
          return (
            <div key={c.id}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{c.label}</span>
                <span className="text-muted-foreground">{money(c.spent)} / {money(c.limit)}</span>
              </div>
              <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
              </div>
              <div className="mt-1 text-[11px]" style={{ color: over ? '#ef4444' : 'hsl(var(--muted-foreground))' }}>
                {pct}% used{over ? ' · over budget' : ''}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}