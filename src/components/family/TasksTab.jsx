import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { Plus, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const PRIORITY = {
  high: 'bg-red-500/10 text-red-600 dark:text-red-400',
  medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
};

export default function TasksTab() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const { toast } = useToast();

  const load = async () => {
    try {
      setTasks(await base44.entities.SharedTask.filter({}) || []);
    } catch {
      setTasks([]);
    }
  };
  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      await base44.entities.SharedTask.create({
        title,
        assignee: 'Eleanor Hayes',
        due_date: new Date().toISOString().slice(0, 10),
        status: 'active',
        priority: 'medium',
        created_by: 'Eleanor Hayes',
      });
      setTitle('');
      toast({ title: 'Task added' });
      load();
    } catch {
      toast({ title: 'Could not add task', variant: 'destructive' });
    }
  };

  const toggle = async (t) => {
    await base44.entities.SharedTask.update(t.id, {
      status: t.status === 'completed' ? 'active' : 'completed',
    });
    load();
  };

  const sorted = [...tasks].sort((a, b) => (a.status === 'completed') - (b.status === 'completed'));

  return (
    <div className="space-y-4">
      <form onSubmit={add} className="flex gap-2">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a shared task…"
          className="min-h-[48px]"
        />
        <Button type="submit" className="min-h-[48px] gap-2 bg-brand text-brand-foreground hover:bg-brand/90">
          <Plus className="h-4 w-4" /> Add
        </Button>
      </form>
      <ul className="space-y-2">
        {sorted.map((t) => (
          <li key={t.id} className="flex items-center gap-3 rounded-xl border border-border/70 bg-card p-4">
            <button
              onClick={() => toggle(t)}
              className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border ${
                t.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-border text-transparent'
              }`}
              aria-label="Toggle complete"
            >
              <Check className="h-4 w-4" />
            </button>
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-medium ${t.status === 'completed' ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                {t.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {t.assignee} · due {format(parseISO(t.due_date), 'd MMM yyyy')}
              </div>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium capitalize ${PRIORITY[t.priority] || PRIORITY.medium}`}>
              {t.priority}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}