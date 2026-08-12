import React, { useEffect, useMemo, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { FileText, ShieldCheck, Lock, AlertTriangle } from 'lucide-react';
import SecureViewer from './SecureViewer';

const CATS = [
  { key: 'insurance', label: 'Insurance Policies', icon: ShieldCheck, color: 'bg-sky-500/10 text-sky-600' },
  { key: 'medical', label: 'Medical Records', icon: FileText, color: 'bg-rose-500/10 text-rose-600' },
  { key: 'property', label: 'Property Deeds', icon: FileText, color: 'bg-emerald-500/10 text-emerald-600' },
  { key: 'id', label: 'ID Cards', icon: FileText, color: 'bg-amber-500/10 text-amber-600' },
  { key: 'legal', label: 'Legal / Estate Documents', icon: FileText, color: 'bg-violet-500/10 text-violet-600' },
];

export default function VaultGrid() {
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    base44.entities.VaultItem.list().then((list) => setItems(list || [])).catch(() => setItems([]));
  }, []);

  const grouped = useMemo(() => {
    const m = {};
    CATS.forEach((c) => (m[c.key] = []));
    items.forEach((i) => { (m[i.category] || (m[i.category] = [])).push(i); });
    return m;
  }, [items]);

  return (
    <div className="space-y-6">
      {CATS.map((cat) => {
        const list = grouped[cat.key] || [];
        const Icon = cat.icon;
        return (
          <section key={cat.key}>
            <div className="mb-2 flex items-center gap-2">
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${cat.color}`}><Icon className="h-4 w-4" /></div>
              <h3 className="text-sm font-semibold text-foreground">{cat.label}</h3>
              <span className="text-xs text-muted-foreground">· {list.length} item{list.length === 1 ? '' : 's'}</span>
            </div>
            {list.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border/70 p-4 text-center text-xs text-muted-foreground">No documents in this category.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((v) => {
                  const days = v.expires_at ? differenceInCalendarDays(parseISO(v.expires_at), new Date()) : null;
                  const expiring = days !== null && days <= 60;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setSelected(v)}
                      className="flex flex-col rounded-2xl border border-border/70 bg-card p-4 text-left hover:border-brand/40"
                    >
                      <div className="flex items-center justify-between">
                        <Lock className="h-4 w-4 text-brand" />
                        {expiring && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
                            <AlertTriangle className="h-3 w-3" /> Expiring
                          </span>
                        )}
                      </div>
                      <p className="mt-3 text-sm font-semibold text-foreground">{v.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">Uploaded {format(parseISO(v.uploaded_at), 'd MMM yyyy')}</p>
                      <p className="mt-2 text-[11px] font-medium text-emerald-600">256-Bit Encrypted</p>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
      <SecureViewer item={selected} onClose={() => setSelected(null)} />
    </div>
  );
}