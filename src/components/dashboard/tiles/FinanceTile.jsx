import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { Wallet, ArrowUpRight, ArrowDownRight, Plus } from 'lucide-react';
import { useMoney } from '@/lib/useMoney';
import TileShell from './TileShell';

const COVER = 'https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/7251f2013_generated_image.png';

export default function FinanceTile() {
  const navigate = useNavigate();
  const { money } = useMoney();
  const [balance, setBalance] = useState(null);
  const [txns, setTxns] = useState([]);
  const [budget, setBudget] = useState({ used: 0, limit: 0 });

  useEffect(() => {
    base44.entities.Transaction.list('-date', 50).then((list) => {
      const items = list || [];
      setBalance(items.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0));
      setTxns(items.slice(0, 3));
    }).catch(() => { setBalance(0); setTxns([]); });
    base44.entities.BudgetCategory.list().then((list) => {
      const items = list || [];
      setBudget({
        used: items.reduce((s, c) => s + (c.spent || 0), 0),
        limit: items.reduce((s, c) => s + (c.limit || 0), 0),
      });
    }).catch(() => {});
  }, []);

  const pct = budget.limit > 0 ? Math.min(100, Math.round((budget.used / budget.limit) * 100)) : 0;

  return (
    <TileShell icon={Wallet} title="Finances & Net Worth" accent="bg-emerald-500/10 text-emerald-500" cover={COVER} onClick={() => navigate('/finances')}>
      <div>
        <p className="text-xs text-muted-foreground">Total cash balance</p>
        {balance === null ? (
          <div className="mt-1 h-7 w-32 animate-pulse rounded bg-muted" />
        ) : (
          <p className="mt-0.5 font-heading text-2xl font-semibold text-foreground">{money(balance)}</p>
        )}
      </div>

      {budget.limit > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Monthly budget</span>
            <span className="font-medium text-foreground">{money(budget.used)} / {money(budget.limit)}</span>
          </div>
          <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">{pct}% of budget used</p>
        </div>
      )}

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">Recent transactions</p>
        {txns.length === 0 ? (
          <button onClick={(e) => { e.stopPropagation(); navigate('/finances'); }} className="mt-2 flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground">
            <Plus className="h-4 w-4" /> Add your first transaction
          </button>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {txns.map((t) => (
              <li key={t.id} className="flex items-center gap-2 text-sm">
                <span className={`flex h-7 w-7 items-center justify-center rounded-full ${t.type === 'income' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                  {t.type === 'income' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                </span>
                <span className="text-foreground">{t.description}</span>
                <span className={`ml-auto font-medium ${t.type === 'income' ? 'text-emerald-600' : 'text-foreground'}`}>
                  {t.type === 'income' ? '+' : '−'}{money(t.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </TileShell>
  );
}