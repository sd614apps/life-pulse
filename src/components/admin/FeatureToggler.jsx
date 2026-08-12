import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { ToggleLeft } from 'lucide-react';

export default function FeatureToggler() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState([]);

  const load = async () => {
    try {
      setToggles((await base44.entities.FeatureToggle.list()) || []);
    } catch {
      setToggles([]);
    }
  };
  useEffect(() => { load(); }, []);

  const toggle = async (t) => {
    const next = !t.is_enabled;
    setToggles((prev) => prev.map((x) => (x.id === t.id ? { ...x, is_enabled: next } : x)));
    try {
      await base44.entities.FeatureToggle.update(t.id, { is_enabled: next });
      const me = await base44.auth.me();
      await base44.entities.AuditLog.create({
        event_type: 'toggle',
        message: `Feature '${t.display_name}' ${next ? 'enabled' : 'disabled'} by Admin`,
        actor: me?.email || 'admin',
        severity: 'info',
        metadata: t.feature_key,
      });
      toast({ title: next ? 'Module enabled' : 'Module disabled' });
    } catch {
      toast({ title: 'Update failed', variant: 'destructive' });
      load();
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground"><ToggleLeft className="h-4 w-4" /> Live Feature Toggles</h3>
      <p className="text-xs text-muted-foreground">Hide or show modules for end users in real time.</p>
      <div className="mt-4 space-y-2">
        {toggles.length === 0 && <p className="py-4 text-center text-sm text-muted-foreground">No feature toggles configured.</p>}
        {toggles.map((t) => (
          <div key={t.id} className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-4">
            <div>
              <p className="text-sm font-medium text-foreground">{t.display_name}</p>
              <p className="text-xs text-muted-foreground">{t.description || t.feature_key}</p>
            </div>
            <Switch checked={!!t.is_enabled} onCheckedChange={() => toggle(t)} />
          </div>
        ))}
      </div>
    </div>
  );
}