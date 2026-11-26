import { type StudioHero, studioHero } from '@/constants/heroMotion';
import { useOpenMotion } from './useOpenMotion';

/** The hero whose clip is open on the stage. */
export const useOpenHero = (): StudioHero => studioHero(useOpenMotion().hero);
