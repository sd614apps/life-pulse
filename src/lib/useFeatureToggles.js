import { useEffect, useState } from 'react';
import { entities } from '@/lib/entities';

export function useFeatureToggles() {
  const [toggles, setToggles] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const list = await entities.FeatureToggle.list();
        const m = {};
        (list || []).forEach((t) => {
          m[t.feature_key] = t.is_enabled;
        });
        if (mounted) {
          setToggles(m);
        }
      } catch (err) {
        console.error('[useFeatureToggles.load]', err);
        if (mounted) {
          setToggles({});
        }
      } finally {
        if (mounted) {
          setLoaded(true);
        }
      }
    };

    load();

    const unsub = entities.FeatureToggle.subscribe?.(() => load());
    return () => {
      mounted = false;
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, []);

  const isEnabled = (key) => (loaded ? toggles[key] !== false : true);

  return { toggles, isEnabled, loaded };
}