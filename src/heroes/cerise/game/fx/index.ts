import { enemyCenter } from "../../../../game/enemies/enemy";
import { skillFx } from "../../../../game/skillFx";
import { skillLevel } from "../../../../game/skills/query";
import { hero } from "../../../../game/state";
import { surfaceBelow } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import type { FxAt, FxCast, FxShape, SkillFxOptions } from "../../../../types/skillFx";
import { ceriseSignature, type Sigil } from "./sigil";

export type { Sigil } from "./sigil";

export interface CeriseFxOptions extends SkillFxOptions {
  sigil?: Sigil;
  lift?: number;
}

export function ceriseFx(id: string, shape: FxShape, at: FxAt, options: CeriseFxOptions = {}): FxCast | null {
  if (skillLevel(id) <= 0) return null;
  const { sigil, lift = 0, ...rest } = options;
  const signature = sigil && !rest.quiet ? ceriseSignature(sigil, 0, -lift) : undefined;
  return skillFx(id, shape, at, { ...rest, signature });
}

export function atFoe(foe: Enemy, reach: number, face = Math.sign(foe.x - hero.x) || hero.face): FxAt {
  const [x, y] = enemyCenter(foe);
  return { x, y, face, reach };
}

export function atFloor(x: number, y: number, reach: number, face = hero.face): FxAt {
  return { x, y: surfaceBelow(x, y - 4), face, reach };
}

export function atHero(reach: number, lift = 16, ahead = 0): FxAt {
  return { x: hero.x + hero.face * ahead, y: hero.y - lift, face: hero.face, reach };
}
