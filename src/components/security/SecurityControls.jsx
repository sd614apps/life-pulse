import React from 'react';
import { entities } from '@/lib/entities';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Fingerprint, KeyRound, Lock, Clock } from 'lucide-react';

export default function SecurityControls({ settings, reload }) {
  const { toast } = useToast();
  const bool = (k) => settings?.[k]?.config_value === 'true';

  const update = async (key, value) => {
    const rec = settings?.[key];
    if (!rec) return;
    try {
      await entities.AppConfiguration.update(rec.id, { config_value: String(value) });
      toast({ title: 'Security setting updated' });
      reload?.();
    } catch (err) {
      console.error('[SecurityControls.update]', err);
      toast({ title: 'Update failed', variant: 'destructive' });
      reload?.();
    }
  };

  const rows = [
    {
      key: 'two_factor',
      label: 'Two-Factor Authentication',
      desc: 'Require a second factor at login',
      icon: KeyRound,
      control: <Switch checked={bool('two_factor')} onCheckedChange={(v) => update('two_factor', v)} />,
    },
    {
      key: 'biometric_login',
      label: 'Biometric Login',
      desc: 'Face / fingerprint unlock',
      icon: Fingerprint,
      control: <Switch checked={bool('biometric_login')} onCheckedChange={(v) => update('biometric_login', v)} />,
    },
    {
      key: 'session_timeout',
      label: 'Session Timeout',
      desc: 'Auto sign-out idle sessions',
      icon: Clock,
      control: <Switch checked={bool('session_timeout')} onCheckedChange={(v) => update('session_timeout', v)} />,
    },
    {
      key: 'auto_lock_timer',
      label: 'Auto-Lock Timer',
      desc: 'Lock the app after inactivity',
      icon: Lock,
      control: (
        <Select
          value={settings?.auto_lock_timer?.config_value || '5'}
          onValueChange={(v) => update('auto_lock_timer', v)}
        >
          <SelectTrigger className="h-9 w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 min</SelectItem>
            <SelectItem value="5">5 min</SelectItem>
            <SelectItem value="15">15 min</SelectItem>
          </SelectContent>
        </Select>
      ),
    },
  ];

  return (
    <div className="h-full rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="text-sm font-semibold text-foreground">Multi-Tier Controls</h3>
      <div className="mt-4 space-y-3">
        {rows.map((r) => (
          <div key={r.key} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10 text-brand">
                <r.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{r.label}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
              </div>
            </div>
            {r.control}
          </div>
        ))}
      </div>
    </div>
  );
}