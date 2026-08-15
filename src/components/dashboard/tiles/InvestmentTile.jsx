import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities } from '@/lib/entities';
import { TrendingUp, Plus } from 'lucide-react';
import { useMoney } from '@/lib/useMoney';
import TileShell from './TileShell';

const COVER = '/images/investment-tile-cover.png';

const CLASS_COLOR = {
  stocks_etfs: 'bg-brand',
  real_estate: 'bg-sky-500',
  crypto: 'bg-violet-500',
  retirement: 'bg-amber-500',
  cash: 'bg-emerald-500',
};

export default function InvestmentTile() {
  const navigate = useNavigate();
  const { money } = useMoney();
  const [holdings, setHoldings] = useState(null);

  useEffect(() => {
    entities.Holding.list()
      .then((list) => setHoldings(list || []))
      .catch((err) => {
        console.error('[InvestmentTile.Holding]', err);
        setHoldings([]);
      });
  }, []);

  const value = (holdings || []).reduce((s, h) => s + Number(h.balance || 0), 0);
  const allocMap = {};
  (holdings || []).forEach((h) => {
    const k = h.asset_class || 'cash';
    allocMap[k] = (allocMap[k] || 0) + Number(h.balance || 0);
  });
  const alloc = Object.entries(allocMap)
    .filter(([, v]) => v > 0)
    .map(([k, v]) => ({
      name: k.replace(/_/g, ' '),
      pct: value > 0 ? Math.round((v / value) * 100) : 0,
      color: CLASS_COLOR[k] || 'bg-muted-foreground',
    }));

  return (
    <TileShell
      icon={TrendingUp}
      title="Investments"
      accent="bg-brand/10 text-brand"
      cover={COVER}
      onClick={() => navigate('/investments')}
    >
      {holdings === null ? (
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
      ) : holdings.length === 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/investments');
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Add your first holding
        </button>
      ) : (
        <>
          <div>
            <p className="text-xs text-muted-foreground">Portfolio value</p>
            <p className="mt-0.5 font-heading text-2xl font-semibold text-foreground">
              {money(value)}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-muted">
              {alloc.map((a) => (
                <div key={a.name} className={a.color} style={{ width: `${a.pct}%` }} />
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {alloc.map((a) => (
                <li key={a.name} className="flex items-center gap-2 text-sm">
                  <span className={`h-2.5 w-2.5 rounded-full ${a.color}`} />
                  <span className="capitalize text-foreground">{a.name}</span>
                  <span className="ml-auto text-muted-foreground">{a.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </TileShell>
  );
}