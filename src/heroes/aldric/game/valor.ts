import { createFloorRing } from "../../../game/effects/floorRing";
import { feat } from "../../../game/feat";
import { skillValues, withCharms } from "../../../game/skills/query";
import { game, hero, lights } from "../../../game/state";
import { sfx } from "../../../services/audio";
import { STAT } from "../constants/achievements";
import { RADIANCE, VALOR } from "../constants/kit";
import { DAWN_RAMP } from "../constants/light";
import { RESOLVE_BARRIER, UNBROKEN_LEVEL } from "../constants/skillNumbers";
import { raiseBarrier } from "./barrier";
import { aldric } from "./state";
import { castSanctuary } from "./ultimate/sanctuary";

/** Radiance runs: his blows add light and throw waves */
export const radiant = (): boolean => aldric.radiance > 0;

/** how long Radiance runs, with Resolve */
const radianceTime = (): number => withCharms("duration", RADIANCE.time + (skillValues("al_resolve").radiance ?? 0));

/** Valor at full empties into Radiance: a ring of light, a flare and the sword lit */
function kindle(): void {
  aldric.valor = 0;
  aldric.radiance = radianceTime();
  game.fx.push(createFloorRing(hero.x, hero.y, 34, DAWN_RAMP, 0.45));
  lights.add(hero.x, hero.y - 20, 48, DAWN_RAMP[5], 0.7, 0.35);
  sfx.chime(3);
  feat({ kind: "heroCount", stat: STAT.radiance, add: 1 });
  const v = skillValues("al_resolve");
  if (v.barrier) raiseBarrier(RESOLVE_BARRIER, 1);
  if (v.dome) castSanctuary(UNBROKEN_LEVEL);
}

/** a deed adds Valor (more with Resolve); at full it kindles Radiance. While Radiance runs, Valor waits */
export function gainValor(amount: number): void {
  if (radiant()) return;
  const more = 1 + (skillValues("al_resolve").valor ?? 0);
  aldric.valor = Math.min(VALOR.most, aldric.valor + amount * more);
  if (aldric.valor >= VALOR.most) kindle();
}

/** Radiance runs down */
export function tickValor(dt: number): void {
  aldric.radiance = Math.max(0, aldric.radiance - dt);
}

/** the share of the Valor bar to show: Valor, or what is left of Radiance while it runs */
export const valorShare = (): number =>
  radiant() ? aldric.radiance / Math.max(0.01, radianceTime()) : aldric.valor / VALOR.most;
