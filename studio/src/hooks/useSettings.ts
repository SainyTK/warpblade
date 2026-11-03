import type { StudioSettings } from '@shared/api';
import { useContext } from 'react';
import { SettingsContext } from '@/providers/settingsContext';

/** The agent proxy's models, or null while they load. */
export function useSettings(): StudioSettings | null {
  return useContext(SettingsContext);
}
