import React, { useEffect, useMemo, useState } from 'react';
import { entities } from '@/lib/entities';
import { useMoney } from '@/lib/useMoney';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const CLASS = {
  stocks_etfs: { label: 'Stocks & ETFs', color: '#0ea5e9' },
  real_estate: { label: 'Real Estate', color: '#10b981' },
  crypto: { label: 'Crypto', color: '#8b5cf6' },
  retirement: { label: 'Retirement / 401k', color: '#f59e0b' },
  cash: { label: 'Cash Savings', color: '#64748b' },
};

export default function AssetAllocation() {
  const { money } = useMoney();
  const [holdings, setHoldings] = useState([]);

  useEffect(() => {
    entities.Holding.list()
      .then((list) => setHoldings(list || []))
      .catch((err) => {
        console.error('[AssetAllocation.Holding]', err);
        setHoldings([]);
      });
  }, []);

  const data = useMemo(() => {
    const map = {};
    holdings.forEach((h) => {
      const key = h.asset_class || 'cash';
      map[key] = (map[key] || 0) + Number(h.balance || 0);
    });
    return Object.entries(map).map(([k, v]) => ({
      name: CLASS[k]?.label || k.replace(/_/g, ' '),
      value: v,
      color: CLASS[k]?.color || '#888',
    }));
  }, [holdings]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Asset Allocation</h3>
      <p className="text-xs text-muted-foreground">Breakdown by asset class</p>
      <div className="relative mt-2 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={64}
              outerRadius={96}
              paddingAngle={2}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => money(v)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[11px] text-muted-foreground">Total</span>
          <span className="font-heading text-lg font-semibold text-foreground">{money(total)}</span>
        </div>
      </div>
    </div>
  );
}