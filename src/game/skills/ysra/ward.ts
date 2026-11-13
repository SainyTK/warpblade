import { GLAIVE_FEEL } from "../../../constants/ysra/glaive";
import { FLARE } from "../../../constants/ysra/rites";
import { WARD } from "../../../constants/ysra/stance";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { SkillBehavior } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { createSlash } from "../../effects/slash";
import { ignite } from "../../enemies/burn";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { staggerFoe } from "../../enemies/stagger";
import { skin } from "../../hero/skin";
import { G_THRUST } from "../../hero/ysra/glaive/slashes";
import { castFlare } from "../../spells/rites/flare";
import { game, hero, particles, progress, rng } from "../../state";
import { boxAhead, boxHit, hitStop } from "../../world";
import { skillValues } from "../query";
import { attackerAt, memoryAs } from "./memory";

const ID = "y_ward";
/** the lash of fire off the haft, shorter and quicker than a thrust */
const LASH = { ...G_THRUST, cx: 10, R: 22, W: 4, trail: 0.12 } as const;

interface WardMemory {
  /** seconds to the next burn of the held guard, and to the next ring Temple Gate may burst */
  wall: number;
  ring: number;
}

/** a tongue of fire from the haft to the foe it struck */
function flames(e: Enemy): void {
  const [x, y] = enemyCenter(e);
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.FIRE,
      x - hero.face * rng.range(0, 8),
      y + rng.range(-4, 4),
      hero.face * rng.range(20, 60),
      -rng.range(10, 40),
      rng.range(0.2, 0.4),
      { col: 0, size: rng.range(1.2, 2.2) },
    );
}

/** a block lashes fire at the attacker, shoves it back and staggers a small one; Temple Gate bursts a ring around her */
function lash(m: WardMemory, fromX: number): void {
  const v = skillValues(ID);
  const foe = attackerAt(fromX);
  game.fx.push(createSlash(hero.x, hero.y, hero.face, LASH));
  if (v.ring && m.ring <= 0) {
    m.ring = WARD.ringEvery;
    game.fx.push(castFlare(hero.x, hero.y, { ...FLARE, power: v.ring }, ID));
  }
  if (!foe) return;
  const dir = Math.sign(foe.x - hero.x) || hero.face;
  dealDamage(foe, progress.stats.ad * v.lash, { fromX: hero.x, kx: dir * (v.push ?? 0), heavy: true, source: ID });
  ignite(foe, 1);
  if (v.stagger) staggerFoe(foe, v.stagger);
  game.fx.push(createImpact(...enemyCenter(foe), dir, true, skin.ramp));
  flames(foe);
  hitStop(GLAIVE_FEEL.thrust.stop * 0.5);
  sfx.hit(true, GLAIVE_FEEL.thrust.pitch);
}

/** the held guard burns every foe pressed against its front */
function burnFront(): void {
  const power = skillValues(ID).wall ?? 0;
  const front = boxAhead(0, -WARD.height, WARD.reach, 0);
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(front, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ad * power, { fromX: hero.x, kx: 0, dot: true, source: ID });
    flames(e);
  }
}

/** Haft Ward: every blow her guard blocks is answered with fire, and a held guard burns what presses on it */
export const haftWard: SkillBehavior = {
  create: () => ({ wall: 0, ring: 0 }),
  update(memory, _state, dt) {
    const m = memoryAs<WardMemory>(memory);
    m.ring = Math.max(0, m.ring - dt);
    m.wall -= dt;
    if (hero.state !== "guard" || !skillValues(ID).wall || m.wall > 0) return;
    m.wall = WARD.every;
    burnFront();
  },
  on: {
    block(memory, { fromX }) {
      lash(memoryAs(memory), fromX);
    },
  },
};
