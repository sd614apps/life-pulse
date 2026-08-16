import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { useMoney } from '@/lib/useMoney';
import { parseISO, isSameMonth } from 'date-fns';
import { Wallet, ArrowUpRight, ArrowDownRight, PiggyBank } from 'lucide-react';

const STARTING_CASH = 20000;

export default function OverviewBar() {
  const { money } = useMoney();
  const [txns, setTxns] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    entities.Transaction.list({
      orderBy: 'date:desc',
      limit: 300,
    })
      .then((list) => setTxns(list || []))
      .catch((err) => {
        console.error('[OverviewBar.Transaction]', err);
        setTxns([]);
      })
      .finally(() => setLoaded(true));
  }, []);

  const now = new Date();
  const incomeAll = txns
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const expenseAll = txns
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
  const totalCash = STARTING_CASH + incomeAll - expenseAll;

  const mIncome = txns
    .filter((t) => t.type === 'income' && t.date && isSameMonth(parseISO(t.date), now))
    .reduce((s, t) => s + Number(t.amount || 0), 0);
  const mExpense = txns
    .filter((t) => t.type === 'expense' && t.date && isSameMonth(parseISO(t.date), now))
    .reduce((s, t) => s + Math.abs(Number(t.amount || 0)), 0);
  const netSavings = mIncome - mExpense;

  const cards = [
    { label: 'Total Cash', value: totalCash, icon: Wallet, accent: 'text-muted-foreground' },
    { label: 'Monthly Income', value: mIncome, icon: ArrowUpRight, accent: 'text-emerald-600' },
    { label: 'Monthly Expenses', value: mExpense, icon: ArrowDownRight, accent: 'text-rose-600' },
    { label: 'Net Savings', value: netSavings, icon: PiggyBank, accent: netSavings >= 0 ? 'text-emerald-600' : 'text-rose-600' },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {cards.map((c) => (
        <div key={c.label} className="rounded-2xl border border-border/70 bg-card p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{c.label}</span>
            <c.icon className={`h-4 w-4 ${c.accent}`} />
          </div>
          <div className="mt-2 font-heading text-xl font-semibold text-foreground">
            {!loaded ? '—' : money(c.value)}
          </div>
        </div>
      ))}
    </div>
  );
}