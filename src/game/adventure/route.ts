import { W } from "../../constants/stage";
import type { Platform, Point } from "../../types/world";
import { eraOf } from "../../utils/eras";
import { approaches } from "./layout";

const EXIT_CORRIDOR = 150;
const RUN_PACE = 48;
export const GATE_ENTRY = 20;
export const STAGE_XP = 1.65;
export const SPAWN_LEAD = 84;

const offset = (p: Platform, start: number): Platform => ({ x0: p.x0 + start, x1: p.x1 + start, y: p.y });

function buildRoute() {
  let start = 0;
  return approaches.map(({ tier, threat, boss, par, length, slabs, walls, arena, patrol, mentorSites, spikes }) => {
    const entrance = start + length;
    const exit = entrance + W;
    const era = eraOf(tier);
    const absoluteMentors: readonly Point[] = mentorSites.map(({ x, y }) => ({ x: start + x, y }));
    const area = {
      tier,
      threat,
      boss,
      par,
      start,
      entrance,
      exit,
      slabs: [...slabs.map((slab) => offset(slab, start)), ...arena.map((slab) => offset(slab, entrance))],
      walls: walls.map((wall) => offset(wall, start)),
      spikes: spikes.map((strip) => offset(strip, start)),
      foes: patrol.map(({ x, y, kind, type, elite }) => ({ x: start + x, y, type: type ?? era[kind], elite })),
      mentorSites: absoluteMentors,
    };
    start = exit;
    return area;
  });
}

export const ROUTE = buildRoute();
export const EXIT_X = ROUTE[ROUTE.length - 1].exit + EXIT_CORRIDOR;
export const STAGE_WIDTH = EXIT_X + 36;
export const STAGE_PLATFORMS = ROUTE.flatMap((area) => area.slabs);
export const STAGE_WALLS = ROUTE.flatMap((area) => area.walls);
export const STAGE_SPIKES: readonly Platform[] = ROUTE.flatMap((area) => area.spikes);
export const FOES_TOTAL = ROUTE.reduce((count, area) => count + area.foes.length + 1, 0);
export const PAR_SECONDS = Math.ceil(EXIT_X / RUN_PACE) + ROUTE.reduce((time, area) => time + area.par, 0);
