import type { SpriteCanvas } from "../../../../engine/sprite";
import { evolvedStar } from "../../../../ui/skills/icons/parts";
import { blast, ICON, tracer } from "./parts";
import { CALDER_SKILL_BASE_ICONS as BASE } from "./skills";

/** each evolved form: the skill's own icon with its mark grown, in hot gold, and the gold star */
const GROWN: Record<string, (s: SpriteCanvas) => void> = {
  /** Dead Center: a breaching tracer through the blast */
  ca_trigger: (s) => tracer(s, 1, 6, 15, 6),
  /** Faultline: a crack along the whole floor */
  ca_breech: (s) => tracer(s, 1, 14, 15, 14),
  /** Furnace Vent: a blast in front as well */
  ca_vent: (s) => blast(s, 13, 9, 2.5, ICON.hot),
  /** Deadeye: a hot round in the chamber */
  ca_pointblank: (s) => blast(s, 5, 9, 2, ICON.hot),
  /** Spin Cycle: a hot heart in the ring */
  ca_speedload: (s) => blast(s, 8, 8, 2, ICON.hot),
  /** Pinball: a fourth bounce */
  ca_ricochet: (s) => tracer(s, 13, 12, 8, 14),
  /** Backfire Rush: blasts all along the path */
  ca_recoil: (s) => blast(s, 13, 10, 2.5, ICON.hot),
  /** Green Line: the line left burning */
  ca_tracer: (s) => tracer(s, 1, 14, 15, 9),
  /** Skyshot: a round fired down from above */
  ca_blastjump: (s) => tracer(s, 13, 2, 13, 12),
  /** Greenfire Barrage: more shells */
  ca_flare: (s) => blast(s, 13, 4, 2, ICON.hot),
  /** Reaper Chain: it comes back */
  ca_chainshot: (s) => tracer(s, 14, 14, 2, 14),
  /** Demolition: a row of blasts */
  ca_charge: (s) => blast(s, 3, 8, 2.5, ICON.hot),
  /** Shrapnel Storm: the shards detonate */
  ca_shrapnel: (s) => blast(s, 12, 9, 2.5, ICON.hot),
  /** Phosphor Heart: the fire bursts */
  ca_scorch: (s) => blast(s, 8, 6, 3, ICON.hot),
  /** Brass Rain: casings over everything */
  ca_brass: (s) => blast(s, 8, 12, 2, ICON.hot),
  /** Gun Nest: a second barrel's tracer */
  ca_turret: (s) => tracer(s, 1, 4, 14, 4),
  /** Gunsmoke Gallery: a second double firing */
  ca_double: (s) => blast(s, 3, 5, 2, ICON.hot),
  /** Scrap Pack: the pack's eyes */
  ca_hound: (s) => blast(s, 3, 3, 1.8, ICON.hot),
  /** Bottomless Drum: a hot heart */
  ca_drum: (s) => blast(s, 8, 8, 2, ICON.hot),
  /** Last Cylinder: a second ring of cuts */
  ca_break: (s) => tracer(s, 1, 14, 15, 2),
};

/** every evolved icon: the skill's own, its grown mark, and the gold star drawn last */
export const CALDER_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = Object.fromEntries(
  Object.entries(GROWN).map(([id, grow]) => [
    `${id}_evo`,
    (s: SpriteCanvas) => {
      BASE[id](s);
      grow(s);
      evolvedStar(s);
    },
  ]),
);
