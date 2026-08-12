import React, { useEffect, useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { AnimatePresence, motion } from 'framer-motion';
import {
  HeartPulse, Wallet, TrendingUp, Plane, Home, ShieldCheck,
  Check, Clock, Bell, ChevronDown, ChevronUp, AlertTriangle, CalendarClock, CheckCheck,
} from 'lucide-react';
import NotificationCard from './NotificationCard';

export const CATEGORY_ICON = {
  health: HeartPulse,
  finance: Wallet,
  investment: TrendingUp,
  travel: Plane,
  family: Home,
  vault: ShieldCheck,
};

export const SEVERITY = {
  critical: { label: 'Urgent', bar: 'bg-red-500', chip: 'bg-red-500/10 text-red-600 dark:text-red-400', icon: AlertTriangle },
  pending: { label: 'Pending', bar: 'bg-amber-500', chip: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', icon: Clock },
  upcoming: { label: 'Upcoming', bar: 'bg-emerald-500', chip: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', icon: CalendarClock },
};

const PRIORITY = { critical: 0, pending: 1, upcoming: 2 };

const PILLS = [
  { v: 'all', label: 'All' },
  { v: 'critical', label: '🔴 Critical' },
  { v: 'reminders', label: '🟢 Reminders' },
  { v: 'health', label: 'Health' },
  { v: 'finance', label: 'Finances' },
  { v: 'travel', label: 'Travel' },
];

export default function ActionCenter() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSnoozed, setShowSnoozed] = useState(false);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await base44.entities.Notification.filter({
        status: showSnoozed ? 'snoozed' : 'active',
      });
      const sorted = (list || []).sort((a, b) => {
        const sp = (PRIORITY[a.severity] ?? 9) - (PRIORITY[b.severity] ?? 9);
        if (sp !== 0) return sp;
        const ad = a.due_date ? new Date(a.due_date).getTime() : Infinity;
        const bd = b.due_date ? new Date(b.due_date).getTime() : Infinity;
        return ad - bd;
      });
      setItems(sorted);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [showSnoozed]);

  useEffect(() => {
    load();
    const unsub = base44.entities.Notification.subscribe?.(() => load());
    return () => unsub && unsub();
  }, [load]);

  const complete = async (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await base44.entities.Notification.update(id, { status: 'completed' });
      toast({ title: 'Dismissed' });
    } catch {
      load();
    }
  };

  const snooze = async (id, dueDate) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await base44.entities.Notification.update(id, { status: 'snoozed', due_date: dueDate });
      toast({ title: 'Snoozed' });
    } catch {
      load();
    }
  };

  const reactivate = async (id) => {
    setItems((prev) => prev.filter((n) => n.id !== id));
    try {
      await base44.entities.Notification.update(id, { status: 'active' });
      toast({ title: 'Reactivated' });
    } catch {
      load();
    }
  };

  const markNonCriticalRead = async () => {
    const targets = items.filter((n) => n.severity !== 'critical');
    if (!targets.length) return;
    try {
      await base44.entities.Notification.updateMany(
        { status: 'active', severity: { $in: ['pending', 'upcoming'] } },
        { $set: { status: 'completed' } }
      );
      toast({ title: `${targets.length} reminders marked as read` });
      load();
    } catch {
      toast({ title: 'Could not update', variant: 'destructive' });
    }
  };

  const filtered = items.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'critical') return n.severity === 'critical';
    if (filter === 'reminders') return n.severity !== 'critical';
    return n.category === filter;
  });

  const hasNonCritical = items.some((n) => n.severity !== 'critical');
  const showToggle = filtered.length > 3;
  const top = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  const renderCard = (n) => {
    const sev = SEVERITY[n.severity] || SEVERITY.pending;
    const CatIcon = CATEGORY_ICON[n.category] || Bell;
    return (
      <NotificationCard
        key={n.id}
        n={n}
        sev={sev}
        CatIcon={CatIcon}
        onComplete={complete}
        onSnooze={snooze}
        onReactivate={reactivate}
      />
    );
  };

  return (
    <section aria-label="Action Center" className="rounded-2xl border border-border/70 bg-card">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-border/70 px-5 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Bell className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">Action Center</h2>
            <p className="text-xs text-muted-foreground">
              {showSnoozed
                ? 'Snoozed alerts'
                : `${items.length} active ${items.length === 1 ? 'alert' : 'alerts'} need your attention`}
            </p>
          </div>
        </div>
        <button
          onClick={() => { setShowSnoozed((v) => !v); setFilter('all'); setExpanded(false); }}
          className="text-xs font-medium text-brand hover:underline"
        >
          {showSnoozed ? 'Show active' : 'Show snoozed'}
        </button>
      </div>

      <div className="p-3 sm:p-4">
        {/* Filter + bulk row (active view only) */}
        {!showSnoozed && (
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <button
              onClick={markNonCriticalRead}
              disabled={!hasNonCritical}
              className="inline-flex min-h-[40px] items-center gap-1.5 rounded-full px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground disabled:opacity-40"
            >
              <CheckCheck className="h-3.5 w-3.5" /> Mark all non-critical as read
            </button>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {PILLS.map((p) => (
                <button
                  key={p.v}
                  onClick={() => { setFilter(p.v); setExpanded(false); }}
                  className={`inline-flex min-h-[44px] items-center rounded-full border px-3 text-xs font-medium transition-colors ${
                    filter === p.v
                      ? 'border-brand bg-brand/10 text-brand'
                      : 'border-border/70 bg-card text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            <Clock className="mr-2 h-4 w-4 animate-pulse" /> Loading alerts…
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Check className="h-8 w-8 text-emerald-500" />
            <p className="mt-2 text-sm font-medium text-foreground">You're all caught up</p>
            <p className="text-xs text-muted-foreground">
              {showSnoozed ? 'No snoozed alerts.' : 'No alerts match this filter right now.'}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2.5">
              {top.map(renderCard)}
              <AnimatePresence initial={false}>
                {expanded && rest.length > 0 && (
                  <motion.div
                    key="more"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                    className="overflow-hidden space-y-2.5"
                  >
                    {rest.map(renderCard)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {showToggle && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="mt-3 flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-secondary/40 px-4 text-sm font-medium text-foreground hover:bg-secondary"
              >
                {expanded ? (
                  <>Collapse List <ChevronUp className="h-4 w-4" /></>
                ) : (
                  <>View All Pending Actions ({filtered.length}) <ChevronDown className="h-4 w-4" /></>
                )}
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
}