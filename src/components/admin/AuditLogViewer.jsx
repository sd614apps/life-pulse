import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ShieldAlert } from 'lucide-react';

const SEV = {
  info: 'bg-muted text-muted-foreground',
  warning: 'bg-amber-500/10 text-amber-600',
  critical: 'bg-red-500/10 text-red-600',
};

export default function AuditLogViewer() {
  const [logs, setLogs] = useState([]);
  useEffect(() => {
    base44.entities.AuditLog.list('-created_date', 100).then((l) => setLogs(l || [])).catch(() => setLogs([]));
  }, []);

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><ShieldAlert className="h-4 w-4" /> Security Audit Log</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/70 text-left text-xs text-muted-foreground">
              <th className="py-2 pr-3 font-medium">Event</th>
              <th className="py-2 pr-3 font-medium">Message</th>
              <th className="py-2 pr-3 font-medium">Actor</th>
              <th className="py-2 pr-3 font-medium">When</th>
              <th className="py-2 pr-3 font-medium">Severity</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && <tr><td colSpan={5} className="py-6 text-center text-muted-foreground">No audit events.</td></tr>}
            {logs.map((l) => (
              <tr key={l.id} className="border-b border-border/40">
                <td className="py-2.5 pr-3 font-medium capitalize text-foreground">{l.event_type}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{l.message}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{l.actor || '—'}</td>
                <td className="py-2.5 pr-3 text-muted-foreground">{formatDistanceToNow(parseISO(l.created_date), { addSuffix: true })}</td>
                <td className="py-2.5 pr-3"><span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${SEV[l.severity] || SEV.info}`}>{l.severity}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}