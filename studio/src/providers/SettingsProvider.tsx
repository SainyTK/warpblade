import type { ReactNode } from 'react';
import { useSettingsLoader } from '@/hooks/useSettingsLoader';
import { SettingsContext } from './settingsContext';

/** Reads the agent proxy's models once for every part of the page that picks one. */
export function SettingsProvider({ children }: { children: ReactNode }) {
  return (
    <SettingsContext.Provider value={useSettingsLoader()}>{children}</SettingsContext.Provider>
  );
}
