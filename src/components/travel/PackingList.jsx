import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Check } from 'lucide-react';

export default function PackingList({ tripId }) {
  const { toast } = useToast();
  const [items, setItems] = useState([]);

  const load = () => {
    base44.entities.PackingItem.filter({ trip_id: tripId })
      .then((list) => setItems(list || []))
      .catch(() => setItems([]));
  };
  useEffect(() => { load(); }, [tripId]);

  const toggle = async (item) => {
    setItems((prev) => prev.map((p) => (p.id === item.id ? { ...p, packed: !p.packed } : p)));
    try {
      await base44.entities.PackingItem.update(item.id, { packed: !item.packed });
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
      load();
    }
  };

  const packed = items.filter((i) => i.packed).length;
  const pct = items.length ? Math.round((packed / items.length) * 100) : 0;

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Packing List</h3>
        <span className="text-xs font-medium text-muted-foreground">{packed}/{items.length} packed</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-[11px] text-muted-foreground">{pct}% complete</p>
      {items.length === 0 ? (
        <p className="mt-4 py-4 text-center text-sm text-muted-foreground">No packing items for this trip yet.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {items.map((i) => (
            <li key={i.id}>
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-center gap-3 rounded-xl border border-border/70 p-3 text-left hover:border-brand/40"
              >
                <span className={`flex h-6 w-6 items-center justify-center rounded-md border ${i.packed ? 'border-brand bg-brand text-brand-foreground' : 'border-border/70'}`}>
                  {i.packed && <Check className="h-4 w-4" />}
                </span>
                <span className={`text-sm ${i.packed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>{i.item}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}