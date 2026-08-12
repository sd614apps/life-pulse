import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMoney } from '@/lib/useMoney';
import { format, parseISO } from 'date-fns';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from 'recharts';

export default function NetWorthChart() {
  const { money, privacyMode } = useMoney();
  const [points, setPoints] = useState([]);

  useEffect(() => {
    base44.entities.NetWorthPoint.list('month', 50).then((list) => setPoints(list || [])).catch(() => setPoints([]));
  }, []);

  const data = points.map((p) => ({
    label: format(parseISO(`${p.month}-01`), "MMM ''yy"),
    assets: p.assets,
    liabilities: p.liabilities,
    net: p.assets - p.liabilities,
  }));

  const yFmt = (v) => (privacyMode ? '••••' : `$${(v / 1000).toFixed(0)}k`);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Net Worth Summary</h3>
      <p className="text-xs text-muted-foreground">Total assets vs. liabilities over the past 12 months</p>
      <div className="mt-4 h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 12, bottom: 0, left: -6 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="label" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} width={64} tickFormatter={yFmt} />
            <Tooltip formatter={(v) => money(v)} />
            <Legend />
            <Line type="monotone" dataKey="assets" name="Assets" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="liabilities" name="Liabilities" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
            <Line type="monotone" dataKey="net" name="Net Worth" stroke="#0ea5e9" strokeWidth={2} strokeDasharray="5 3" dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}