import React, { useCallback, useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import ModuleHeader from '@/components/ModuleHeader';
import SecurityScore from '@/components/security/SecurityScore';
import SecurityControls from '@/components/security/SecurityControls';
import SessionTable from '@/components/security/SessionTable';
import { ShieldCheck } from 'lucide-react';

export default function Security() {
  const [settings, setSettings] = useState({});

  const load = useCallback(async () => {
    try {
      const list = (await base44.entities.AppConfiguration.filter({ category: 'security' })) || [];
      const map = {};
      list.forEach((s) => { if (!map[s.config_key]) map[s.config_key] = s; });
      setSettings(map);
    } catch {
      setSettings({});
    }
  }, []);
  useEffect(() => { load(); }, [load]);

  const score = (() => {
    const v = (k) => settings[k]?.config_value;
    let s = 0;
    if (v('two_factor') === 'true') s += 30;
    if (v('biometric_login') === 'true') s += 20;
    const al = v('auto_lock_timer');
    if (al === '1') s += 25;
    else if (al === '5') s += 20;
    else if (al === '15') s += 10;
    if (v('session_timeout') === 'true') s += 25;
    return Math.min(100, s);
  })();

  return (
    <div className="min-h-screen bg-background">
      <ModuleHeader icon={ShieldCheck} title="Security & Privacy Audit Center" description="Account protection & access logs" cover="https://media.base44.com/images/public/6a737f97d9e3ddd06cf02735/ae67d6e12_generated_image.png" />
      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 pb-28 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SecurityScore score={score} />
          <div className="lg:col-span-2"><SecurityControls settings={settings} reload={load} /></div>
        </div>
        <SessionTable />
      </main>
    </div>
  );
}