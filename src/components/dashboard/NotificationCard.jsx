import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { addDays, addHours, subHours } from 'date-fns';
import { Clock, ChevronRight, Bell, X, Trash2, AlarmClock } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useLocale } from '@/lib/LocaleContext';

const CTA_LABEL = {
  finance: 'Pay Bill',
  health: 'Open',
  travel: 'Open Trip',
  investment: 'Open',
  family: 'Open',
  vault: 'Open',
};

export default function NotificationCard({ n, sev, CatIcon, onComplete, onSnooze, onReactivate }) {
  const navigate = useNavigate();
  const { formatDue } = useLocale();
  const SevIcon = sev.icon;
  const due = n.due_date ? new Date(n.due_date) : null;
  const overdue = due && due < new Date() && n.status === 'active';
  const snoozed = n.status === 'snoozed';

  const snoozeTo = (opt) => {
    let d;
    if (opt === 'tomorrow') d = addDays(new Date(), 1);
    else if (opt === 'nextweek') d = addDays(new Date(), 7);
    else d = due ? subHours(due, 1) : addHours(new Date(), 1);
    onSnooze(n.id, d.toISOString());
  };

  return (
    <div className="relative overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-4">
        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-600"><AlarmClock className="h-4 w-4" /> Snooze</span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600">Dismiss <Trash2 className="h-4 w-4" /></span>
      </div>

      <motion.div
        drag="x"
        dragDirectionLock
        dragSnapToOrigin
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={(e, info) => {
          if (info.offset.x < -110) onComplete(n.id);
          else if (info.offset.x > 110) snoozeTo('tomorrow');
        }}
        className="relative rounded-xl border border-border/70 bg-background pl-4 pr-3 py-3"
      >
        <span className={`absolute inset-y-0 left-0 w-1.5 ${sev.bar}`} />
        <div className="flex items-start gap-3 pl-1">
          <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${sev.chip}`}>
            <CatIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-foreground">{n.title}</p>
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${sev.chip}`}>
                <SevIcon className="h-3 w-3" /> {sev.label}
              </span>
            </div>
            {n.description && <p className="mt-0.5 text-xs text-muted-foreground">{n.description}</p>}
            {due && (
              <p className={`mt-1 text-xs ${overdue ? 'font-medium text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                {formatDue(n.due_date)}
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-2">
              {!snoozed && n.target_path && (
                <Button size="sm" onClick={() => navigate(n.target_path)} className="min-h-[48px] gap-1 rounded-full px-4 text-xs">
                  {CTA_LABEL[n.category] || 'Open'} <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              )}
              {!snoozed && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-xs font-medium text-foreground hover:border-amber-500/50 hover:text-amber-600">
                      <Clock className="h-3.5 w-3.5" /> Snooze
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onSelect={() => snoozeTo('tomorrow')}>Tomorrow</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => snoozeTo('nextweek')}>Next Week</DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => snoozeTo('1hr')}>Remind 1 Hour Before</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              {!snoozed ? (
                <button onClick={() => onComplete(n.id)} className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-xs font-medium text-foreground hover:border-red-500/50 hover:text-red-600">
                  <X className="h-3.5 w-3.5" /> Dismiss
                </button>
              ) : (
                <button onClick={() => onReactivate(n.id)} className="inline-flex min-h-[48px] items-center gap-1.5 rounded-full border border-border/70 bg-card px-3 text-xs font-medium text-foreground hover:border-brand/50 hover:text-brand">
                  <Bell className="h-3.5 w-3.5" /> Reactivate
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}