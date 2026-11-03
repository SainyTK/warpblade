import type { StudioSettings } from '@shared/api';
import { useEffect, useState } from 'react';
import { getSettings } from '@/services/jobApi';

/** The models the agent proxy serves, read once when the page opens. */
export function useSettingsLoader(): StudioSettings | null {
  const [settings, setSettings] = useState<StudioSettings | null>(null);
  useEffect(() => {
    getSettings()
      .then(setSettings)
      .catch((problem: unknown) =>
        setSettings({
          models: [],
          defaultModel: null,
          proxyError:
            problem instanceof Error ? problem.message : 'The studio server is not running.',
        }),
      );
  }, []);
  return settings;
}
