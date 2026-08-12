import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Shield } from 'lucide-react';

const PERMISSIONS = {
  admin: {
    label: 'Admin',
    desc: 'Full control — manage members, data, and settings.',
    color: 'bg-brand/10 text-brand',
  },
  contributor: {
    label: 'Contributor',
    desc: 'Can add and edit data across modules.',
    color: 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
  },
  viewer: {
    label: 'Viewer',
    desc: 'Read-only simplified view of shared data.',
    color: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  },
};

export default function MembersTab() {
  const [members, setMembers] = useState([]);
  const { toast } = useToast();

  const load = async () => {
    try {
      setMembers(await base44.entities.Profile.list() || []);
    } catch {
      setMembers([]);
    }
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (id, level) => {
    try {
      await base44.entities.Profile.update(id, { permission_level: level });
      toast({ title: 'Permission updated', description: `${PERMISSIONS[level].label} access applied.` });
      load();
    } catch {
      toast({ title: 'Could not update', variant: 'destructive' });
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {members.map((m) => {
        const p = PERMISSIONS[m.permission_level] || PERMISSIONS.viewer;
        return (
          <div key={m.id} className="rounded-2xl border border-border/70 bg-card p-5">
            <div className="flex items-center gap-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white"
                style={{ backgroundColor: m.avatar_color || 'hsl(174 58% 39%)' }}
              >
                {m.display_name?.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-foreground">{m.display_name}</div>
                <div className="text-xs text-muted-foreground">
                  {m.relationship || m.tier_label} · Age {m.age ?? '—'}
                </div>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${p.color}`}>{p.label}</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-muted-foreground" />
              <Select value={m.permission_level || 'viewer'} onValueChange={(v) => changeRole(m.id, v)}>
                <SelectTrigger className="min-h-[44px] w-[190px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PERMISSIONS).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      })}
    </div>
  );
}