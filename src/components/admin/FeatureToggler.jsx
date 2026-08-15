import React, { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Switch } from '@/components/ui/switch';
import { ToggleLeft } from 'lucide-react';

export default function FeatureToggler() {
  const { toast } = useToast();
  const [toggles, setToggles] = useState([]);

  const load = async () => {
    try {
      const data = await entities.FeatureToggle.list({ orderBy: 'display_name:asc' });
      setToggles(data || []);
    } catch (error) {
      console.error('[FeatureToggler.load]', error);
      setToggles([]);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (t) => {
    const next = !t.is_enabled;

    // Optimistic UI state update
    setToggles((prev) =>
      prev.map((x) => (x.id === t.id ? { ...x, is_enabled: next } : x))
    );

    try {
      // 1. Update feature toggle state in Supabase
      await entities.FeatureToggle.update(t.id, { is_enabled: next });

      // 2. Fetch current actor for audit logging
      const { data: authData } = await supabase.auth.getUser();
      const actorEmail = authData?.user?.email || 'admin';

      // 3. Write event to AuditLog
      await entities.AuditLog.create({
        event_type: 'toggle',
        message: `Feature '${t.display_name}' ${next ? 'enabled' : 'disabled'} by Admin`,
        actor: actorEmail,
        severity: 'info',
        metadata: t.feature_key,
      });

      toast({ title: next ? 'Module enabled' : 'Module disabled' });
    } catch (error) {
      console.error('[FeatureToggler.toggle]', error);
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      });
      // Rollback to server state
      load();
    }
  };

  return (
    <div className="rounded-2xl border border-border/70 bg-card p-5">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <ToggleLeft className="h-4 w-4" /> Live Feature Toggles
      </h3>
      <p className="text-xs text-muted-foreground">
        Hide or show modules for end users in real time.
      </p>
      <div className="mt-4 space-y-2">
        {toggles.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No feature toggles configured.
          </p>
        )}
        {toggles.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-4"
          >
            <div>
              <p className="text-sm font-medium text-foreground">{t.display_name}</p>
              <p className="text-xs text-muted-foreground">
                {t.description || t.feature_key}
              </p>
            </div>
            <Switch
              checked={!!t.is_enabled}
              onCheckedChange={() => toggle(t)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}