import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { entities } from '@/lib/entities';
import { Home, CalendarDays, CheckSquare, Plus } from 'lucide-react';
import { useLocale } from '@/lib/LocaleContext';
import TileShell from './TileShell';

const COVER = '/images/family-tile-cover.png';

export default function FamilyTile() {
  const navigate = useNavigate();
  const { formatDate, formatTime } = useLocale();
  const [events, setEvents] = useState(null);
  const [tasks, setTasks] = useState(null);

  useEffect(() => {
    entities.CalendarEvent.list({
      orderBy: 'event_at:desc',
      limit: 20,
    })
      .then((list) => {
        const now = new Date();
        setEvents((list || []).filter((e) => new Date(e.event_at) >= now).slice(0, 2));
      })
      .catch((err) => {
        console.error('[FamilyTile.CalendarEvent]', err);
        setEvents([]);
      });

    entities.SharedTask.list({
      filter: { status: 'active' },
      limit: 2,
    })
      .then((list) => setTasks(list || []))
      .catch((err) => {
        console.error('[FamilyTile.SharedTask]', err);
        setTasks([]);
      });
  }, []);

  const empty = events !== null && tasks !== null && events.length === 0 && tasks.length === 0;

  return (
    <TileShell icon={Home} title="Family Hub" accent="bg-violet-500/10 text-violet-500" cover={COVER} onClick={() => navigate('/family')}>
      {events === null || tasks === null ? (
        <div className="h-16 animate-pulse rounded bg-muted" />
      ) : empty ? (
        <button onClick={(e) => { e.stopPropagation(); navigate('/family'); }} className="flex w-full items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-3 text-xs text-muted-foreground hover:text-foreground">
          <Plus className="h-4 w-4" /> Add a family event or task
        </button>
      ) : (
        <>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <CalendarDays className="h-3.5 w-3.5" /> Shared calendar
            </div>
            {events.length === 0 ? (
              <p className="mt-2 text-xs text-muted-foreground">No upcoming events.</p>
            ) : (
              <ul className="mt-2 space-y-1.5">
                {events.map((e) => (
                  <li key={e.id} className="flex items-center gap-2 text-sm">
                    <span className="h-2 w-2 flex-shrink-0 rounded-full bg-violet-500" />
                    <span className="text-foreground">{e.title}</span>
                    <span className="ml-auto text-xs text-muted-foreground">{formatDate(e.event_at)} · {formatTime(e.event_at)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          {tasks.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CheckSquare className="h-3.5 w-3.5" /> Active shared tasks
              </div>
              <ul className="mt-2 space-y-1.5">
                {tasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 text-sm">
                    <span className="text-foreground">{t.title}</span>
                    <span className="ml-auto rounded-full bg-violet-500/10 px-2 py-0.5 text-[11px] font-medium text-violet-600 dark:text-violet-400">{t.assignee}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </TileShell>
  );
}