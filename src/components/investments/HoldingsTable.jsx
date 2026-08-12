import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useMoney } from '@/lib/useMoney';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const CLASS_LABEL = {
  stocks_etfs: 'Stocks & ETFs',
  real_estate: 'Real Estate',
  crypto: 'Crypto',
  retirement: 'Retirement / 401k',
  cash: 'Cash Savings',
};
const RISK = {
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
};

export default function HoldingsTable() {
  const { money, privacyMode } = useMoney();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    base44.entities.Holding.list().then((list) => setRows(list || [])).catch(() => setRows([]));
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Holding Details</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Asset</th>
              <th className="py-2 pr-3 font-medium">Class</th>
              <th className="py-2 pr-3 text-right font-medium">Balance</th>
              <th className="py-2 pr-3 text-right font-medium">Daily Change</th>
              <th className="py-2 pr-3 text-center font-medium">Risk</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const up = (r.daily_change_amount || 0) >= 0;
              return (
                <tr key={r.id} className="border-b border-border/40">
                  <td className="py-2.5 pr-3 font-medium text-foreground">{r.asset_name}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{CLASS_LABEL[r.asset_class] || r.asset_class}</td>
                  <td className="py-2.5 pr-3 text-right font-semibold text-foreground">{money(r.balance)}</td>
                  <td className={`py-2.5 pr-3 text-right ${up ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {privacyMode ? (
                      <span>••••</span>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                        {up ? '+' : ''}{money(Math.abs(r.daily_change_amount || 0))}
                        <span className="text-xs">({up ? '+' : ''}{(r.daily_change_pct || 0).toFixed(2)}%)</span>
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 pr-3 text-center">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${RISK[r.risk_level] || RISK.medium}`}>
                      {r.risk_level}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}