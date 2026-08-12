import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Smartphone, Monitor, Tablet, Ban } from 'lucide-react';
import { Button } from '@/components/ui/button';

const deviceIcon = (t) =>
  /phone|iphone|android|pixel/i.test(t || '') ? Smartphone : /tablet|ipad/i.test(t || '') ? Tablet : Monitor;

export default function SessionTable() {
  const { toast } = useToast();
  const [rows, setRows] = useState([]);

  const load = async () => {
    try {
      setRows((await base44.entities.SessionLog.list('-last_active_at', 50)) || []);
    } catch {
      setRows([]);
    }
  };
  useEffect(() => { load(); }, []);

  const revoke = async (row) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status: 'revoked' } : r)));
    try {
      await base44.entities.SessionLog.update(row.id, { status: 'revoked' });
      toast({ title: 'Session revoked' });
    } catch {
      toast({ title: 'Revoke failed', variant: 'destructive' });
      load();
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Active Sessions & Access Logs</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Device</th>
              <th className="py-2 pr-3 font-medium">Location</th>
              <th className="py-2 pr-3 font-medium">Last active</th>
              <th className="py-2 pr-3 font-medium">Status</th>
              <th className="py-2 pr-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No sessions recorded.</td></tr>
            )}
            {rows.map((r) => {
              const Icon = deviceIcon(r.device_type);
              return (
                <tr key={r.id} className="border-b border-border/40">
                  <td className="py-2.5 pr-3">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{r.device_type}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{r.location}</td>
                  <td className="py-2.5 pr-3 text-muted-foreground">{formatDistanceToNow(parseISO(r.last_active_at), { addSuffix: true })}</td>
                  <td className="py-2.5 pr-3">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${r.status === 'active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-muted text-muted-foreground'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-2.5 pr-3 text-right">
                    {r.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => revoke(r)} className="gap-1.5">
                        <Ban className="h-3.5 w-3.5" /> Revoke
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}