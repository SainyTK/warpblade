import type { StudioSettings } from '@shared/api';
import { createContext } from 'react';

export const SettingsContext = createContext<StudioSettings | null>(null);
