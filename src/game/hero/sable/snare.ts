import { SNARE } from "../../../constants/sable/snare";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { dealDamage } from "../../damage";
import { createSnareTrap } from "../../effects/snareTrap";
import { enemyCenter } from "../../enemies/enemy";
import { hasPerk } from "../../progress";
import { game, hero, progress } from "../../state";
import { shake } from "../../world";
import { isFree, setState, settle } from "../actions";
import { deny } from "../deny";
import { skin } from "../skin";
import { looseBolt } from "./loose";
import { sable } from "./memory";
import { rankOf } from "./rank";

const maxSnares = (): number => (hasPerk("twinSnare") ? SNARE.twinMax : SNARE.max);

/** I: kneel and set a snare at her feet, paid with MP; on the floor only */
export function pressSnare(): boolean {
  const h = hero;
  if (!rankOf("t_snare") || !isFree() || !h.ground) return false;
  if (sable.snareCd > 0 || sable.snares >= maxSnares()) {
    deny("cast");
    return true;
  }
  if (h.mp < SNARE.mp) {
    deny("mp");
    return true;
  }
  h.mp -= SNARE.mp;
  sable.snareCd = hasPerk("twinSnare") ? SNARE.twinCooldown : SNARE.cooldown;
  setState("snare");
  return true;
}

/** Tripwire Volley: the sprung snare looses a bolt at every foe near it */
function volley(x: number, y: number): void {
  for (const e of game.enemies) {
    if (e.hp <= 0) continue;
    const [cx, cy] = enemyCenter(e);
    if (Math.abs(cx - x) > SNARE.volleyRange) continue;
    looseBolt({
      x,
      y: y - 6,
      angle: Math.atan2(cy - (y - 6), cx - x),
      share: SNARE.volleyPower,
      primed: false,
      source: "abilities",
    });
  }
}

/** the jaws bite: ability power damage, and the foe is held where it stands */
function spring(e: Enemy, x: number, y: number): void {
  const barbed = hasPerk("barbedSnare");
  dealDamage(e, progress.stats.ap * (barbed ? SNARE.barbedPower : SNARE.power), {
    fromX: x,
    kx: 0,
    ky: 0,
    stun: barbed ? SNARE.barbedHold : SNARE.hold,
    heavy: true,
    source: "abilities",
  });
  e.vx = 0;
  shake(0.12, 1.5);
  sfx.block();
  if (hasPerk("snareVolley")) volley(x, y);
}

/** the snare goes down on its frame */
export function runSnare(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SNARE.set) {
    h.hitDone = true;
    const x = h.x + h.face * 8;
    const y = h.y;
    sable.snares++;
    game.fx.push(
      createSnareTrap({
        x,
        y,
        reach: SNARE.reach,
        life: SNARE.life,
        ramp: skin.ramp,
        spring: (e) => spring(e, x, y),
        gone: () => {
          sable.snares = Math.max(0, sable.snares - 1);
        },
      }),
    );
    sfx.tone(180, 90, 0.08, "square", 0.05);
  }
  if (h.st >= SNARE.dur) settle();
}
