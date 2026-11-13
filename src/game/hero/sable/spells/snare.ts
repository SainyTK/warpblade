import { SNARE } from "../../../../constants/sable/snare";
import { W } from "../../../../constants/stage";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { dealDamage } from "../../../damage";
import { createSnareTrap } from "../../../effects/snareTrap";
import { enemyCenter, walks } from "../../../enemies/enemy";
import { addStacks, consumeStacks } from "../../../enemies/skillStatus";
import { emitSkillEvent } from "../../../skills/events";
import { skillValues } from "../../../skills/query";
import { game, hero, progress } from "../../../state";
import { shake, surfaceBelow } from "../../../world";
import { skin } from "../../skin";
import { looseBolt } from "../loose";
import { sable } from "../memory";
import { createBramble } from "./bramble";
import type { SableSpell } from "./spell";

/** seconds between a bleed's ticks */
const BLEED_TICK = 0.5;

/** Barbed Jaws: a bite lays a bleed */
export function bleed(e: Enemy): void {
  const v = skillValues("s_barbed");
  if (!v.rate) return;
  addStacks(e, "s_barbed", {
    stacks: 1,
    max: v.max,
    damage: progress.stats.ap * v.rate * BLEED_TICK,
    every: BLEED_TICK,
    duration: v.time,
  });
}

/** Barbed Jaws: the sprung snare looses a bolt at every foe near it, each laying a bleed */
function volley(x: number, y: number, reach: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - x) > reach) continue;
    looseBolt({
      x,
      y: y - 6,
      angle: Math.atan2(cy - (y - 6), cx - x),
      share: 1,
      power: SNARE.volleyPower,
      prime: null,
      plain: true,
      source: "abilities",
    });
    bleed(e);
  }
}

/** Bloodtrap: every bleeding foe in the bramble net takes all its bleed at once */
export function drainBleeds(foes: readonly Enemy[]): void {
  const v = skillValues("s_barbed");
  for (const e of foes) {
    const n = consumeStacks(e, "s_barbed");
    if (n) dealDamage(e, progress.stats.ap * v.rate * v.time * n, { dot: true, source: "s_barbed" });
  }
}

/** the jaws bite: ability power damage, and the foe is held where it stands */
export function snareBite(e: Enemy, x: number, y: number): void {
  dealDamage(e, progress.stats.ap * SNARE.power, {
    fromX: x,
    kx: 0,
    ky: 0,
    stun: SNARE.hold,
    heavy: true,
    source: "abilities",
  });
  e.vx = 0;
  shake(0.12, 1.5);
  sfx.block();
  bleed(e);
  const v = skillValues("s_barbed");
  if (v.volley) volley(x, y, v.volley);
  if (v.net) createBramble(x, y, v.net);
  emitSkillEvent({ type: "snareBite", foe: e });
}

/** an armed snare on the floor at x */
export function setSnare(x: number, y: number, counted: boolean): void {
  if (counted) sable.snares++;
  game.fx.push(
    createSnareTrap({
      x,
      y,
      reach: SNARE.reach,
      life: SNARE.life,
      ramp: skin.ramp,
      rearm: skillValues("s_barbed").rearm ?? 0,
      spring: (e) => snareBite(e, x, y),
      gone: () => {
        if (counted) sable.snares = Math.max(0, sable.snares - 1);
      },
    }),
  );
  sfx.tone(180, 90, 0.08, "square", 0.05);
}

/** a foe this far ahead of her is in the tossed snare's reach */
const inToss = (ahead: number): boolean => ahead > 0 && ahead <= SNARE.toss;

/** I held: the snare is tossed under the nearest foe ahead on the floor, or as far as it flies with none */
function tossSnare(): void {
  const ahead = game.enemies.filter((e) => e.hp > 0 && walks(e) && inToss((e.x - hero.x) * hero.face));
  const foe = ahead.sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x))[0];
  const x = foe ? foe.x : hero.x + hero.face * SNARE.toss;
  setSnare(clamp(x, 8, W - 8), surfaceBelow(x, hero.y - 1), true);
  sfx.swing(1.3);
}

/** the snare: in her base kit, Barbed Jaws makes more of them, cheaper and quicker */
export const SNARE_SPELL: SableSpell = {
  label: "SNARE",
  tint: "#e88a4c",
  mp: () => skillValues("s_barbed").mp ?? SNARE.mp,
  cooldown: () => skillValues("s_barbed").cooldown ?? SNARE.cooldown,
  left: () => sable.snareCd,
  spend: (s) => {
    sable.snareCd = s;
  },
  room: () => sable.snares < (skillValues("s_barbed").snares ?? SNARE.max),
  release: () => setSnare(hero.x + hero.face * 8, hero.y, true),
  wide: tossSnare,
};
