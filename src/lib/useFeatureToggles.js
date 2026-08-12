import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useFeatureToggles() {
  const [toggles, setToggles] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const list = await base44.entities.FeatureToggle.list();
        const m = {};
        (list || []).forEach((t) => { m[t.feature_key] = t.is_enabled; });
        setToggles(m);
      } catch {
        setToggles({});
      }
      setLoaded(true);
    };
    load();
    const unsub = base44.entities.FeatureToggle.subscribe?.(() => load());
    return () => unsub && unsub();
  }, []);

  const isEnabled = (key) => (loaded ? toggles[key] !== false : true);
  return { toggles, isEnabled, loaded };
}