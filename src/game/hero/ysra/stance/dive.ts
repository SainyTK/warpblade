import { FEEL } from "../../../../constants/combo";
import { DIVE, DIVE_TIMES } from "../../../../constants/ysra/stance";
import { sfx } from "../../../../services/audio";
import { ignite } from "../../../enemies/burn";
import { meleeHit } from "../../../meleeHit";
import { skillEvolved, skillValues } from "../../../skills/query";
import { game, hero } from "../../../state";
import { boxAhead, newSwing, struckThisSwing } from "../../../world";
import { setState, settle } from "../../actions";
import { emitYsra } from "../events";
import { cutMove } from "./cut";
import { diveImpact, diveRing, pullToImpact } from "./landing";
import { stance } from "./memory";
import { createPhoenixWings } from "./phoenixCrash";
import { springOut } from "./spring";

/** where the glaive's point runs on the way down, pixels from her feet facing right */
const POINT_BOX = [8, -12, 28, 4] as const;

/** Falling Star's numbers; empty when not held */
const star = () => skillValues("y_dive");

/** K in the air: once per airtime (more with Falling Star), turn the glaive point down and drop along it */
export function startDive(): boolean {
  const h = hero;
  if (stance.dives >= (star().dives ?? 1)) return false;
  cutMove();
  stance.dives++;
  stance.landed = false;
  h.vx = 0;
  h.vy = Math.min(h.vy, 0);
  h.cutShort = true;
  // one swing for the whole drop, so the point strikes each foe once
  newSwing();
  setState("dive");
  if (skillEvolved("y_dive")) game.fx.push(createPhoenixWings());
  sfx.swing(0.6);
  return true;
}

/** the point skewers what it meets on the way down, setting it burning with Falling Star */
function skewer(): void {
  const hits = meleeHit([boxAhead(...POINT_BOX)], {
    power: star().skewer ?? DIVE.power * 0.5,
    kx: 40,
    ky: 120,
    feel: { stop: 0.04, shake: [0.08, 1.2], pitch: 0.9 },
  });
  if (!hits) return;
  const burn = star().burn ?? 0;
  if (burn) for (const e of game.enemies) if (struckThisSwing(e)) ignite(e, burn);
  emitYsra("strike", { source: "dive", hits });
}

/** the point goes into the floor: Falling Star draws foes in first, the impact strikes, then she may spring out */
function impact(): void {
  const v = star();
  const reach = v.reach ?? DIVE.reach;
  if (v.pull) pullToImpact(v.pull);
  diveImpact(boxAhead(8 - reach, -DIVE.height, 8 + reach, 4), {
    power: v.power ?? DIVE.power,
    kx: 70,
    ky: 0,
    launch: v.launch ? DIVE.launch * 1.6 : DIVE.launch,
    stun: DIVE.stun,
    big: true,
    feel: FEEL.crush,
  });
  if (v.ring || skillEvolved("y_dive")) diveRing(v);
  if (v.spring) springOut(v.spring);
}

/** the tuck hangs her in the air; the drop runs straight at 45 degrees until the floor, where the point goes in */
export function runDive(): void {
  const h = hero;
  if (stance.landed) {
    h.vx = 0;
    if (h.st >= DIVE_TIMES.end) settle();
    return;
  }
  if (h.st < DIVE_TIMES.drop) {
    h.vx = 0;
    h.vy = 0;
    return;
  }
  h.vx = h.face * DIVE.speed;
  h.vy = DIVE.speed;
  emitYsra("travel", { x: h.x, y: h.y, from: "dive" });
  if (!h.ground) {
    skewer();
    h.st = Math.min(h.st, DIVE_TIMES.hold);
    return;
  }
  stance.landed = true;
  h.vx = 0;
  h.st = DIVE_TIMES.impact;
  impact();
}
