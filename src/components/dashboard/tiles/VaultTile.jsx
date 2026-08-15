import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities } from '@/lib/entities';
import { ShieldCheck, Lock, FileText, Plus } from 'lucide-react';
import { differenceInCalendarDays, parseISO } from 'date-fns';
import TileShell from './TileShell';

const COVER = '/images/vault-tile-cover.png';

const STATUS = (days) => {
  if (days === null) return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Secure' };
  if (days < 0) return { dot: 'bg-rose-500', text: 'text-rose-600 dark:text-rose-400', label: 'Expired' };
  if (days <= 60) return { dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', label: 'Attention' };
  return { dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', label: 'Secure' };
};

export default function VaultTile() {
  const navigate = useNavigate();
  const [items, setItems] = useState(null);

  useEffect(() => {
    entities.VaultItem.list()
      .then((list) => setItems(list || []))
      .catch((err) => {
        console.error('[VaultTile.VaultItem]', err);
        setItems([]);
      });
  }, []);

  const docs = (items || []).slice(0, 4).map((d) => {
    const days = d.expires_at ? differenceInCalendarDays(parseISO(d.expires_at), new Date()) : null;
    return { name: d.title, status: STATUS(days), note: d.category };
  });

  const expiring = (items || []).filter((d) => {
    if (!d.expires_at) return false;
    const days = differenceInCalendarDays(parseISO(d.expires_at), new Date());
    return days <= 60;
  }).length;

  return (
    <TileShell
      icon={ShieldCheck}
      title="Secure Vault"
      accent="bg-brand/10 text-brand"
      cover={COVER}
      onClick={() => navigate('/vault')}
      action={<Lock className="h-4 w-4 text-white/80" />}
    >
      {items === null ? (
        <div className="h-16 animate-pulse rounded bg-muted" />
      ) : items.length === 0 ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigate('/vault');
          }}
          className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground hover:text-foreground"
        >
          <Plus className="h-4 w-4" /> Add a document to your vault
        </button>
      ) : (
        <>
          <div className="flex items-center gap-2 rounded-xl bg-brand-soft px-3 py-2 text-xs text-brand">
            <FileText className="h-4 w-4" />
            {items.length} secure{expiring > 0 ? ` · ${expiring} need attention` : ''}
          </div>
          <ul className="mt-3 space-y-2">
            {docs.map((d) => (
              <li key={d.name} className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${d.status.dot}`} />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-foreground">{d.name}</div>
                  <div className="truncate text-xs capitalize text-muted-foreground">{d.note}</div>
                </div>
                <span className={`ml-auto text-xs font-medium ${d.status.text}`}>{d.status.label}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </TileShell>
  );
}