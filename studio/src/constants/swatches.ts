import { FIRE_RAMP, HERO_COLORS, PAL, SMOKE_RAMP, SPARKS } from '@game/constants/palette';
import type { Color } from '@game/types/color';
import { WHITE } from '@game/utils/color';

/** The game's own color ramps, so a drawn effect uses colors the code already has names for. */
export const SWATCH_GROUPS: readonly { id: string; label: string; colors: readonly Color[] }[] = [
  { id: 'crystal', label: 'PAL.crystal', colors: PAL.crystal },
  { id: 'ice', label: 'PAL.ice', colors: PAL.ice },
  { id: 'volt', label: 'PAL.volt', colors: PAL.volt },
  { id: 'shadow', label: 'PAL.shadow', colors: PAL.shadow },
  { id: 'heal', label: 'PAL.heal', colors: PAL.heal },
  { id: 'fire', label: 'FIRE_RAMP', colors: FIRE_RAMP },
  { id: 'smoke', label: 'SMOKE_RAMP', colors: SMOKE_RAMP },
  { id: 'hot', label: 'SPARKS.hot', colors: SPARKS.hot },
  { id: 'blood', label: 'SPARKS.blood', colors: SPARKS.blood },
  {
    id: 'kael',
    label: 'HERO_COLORS',
    colors: [
      WHITE,
      HERO_COLORS.bladeEdge,
      HERO_COLORS.blade,
      HERO_COLORS.scarfLight,
      HERO_COLORS.scarf,
      HERO_COLORS.trim,
    ],
  },
];

export const DEFAULT_COLOR: Color = PAL.crystal[4] ?? WHITE;
