import { PENDANTS_PER_AIR, SHOULDER_Y, STAFF_BLOWS, STAFF_LINK, STAFF_STRING } from "../../../constants/mirel/string";
import { sfx } from "../../../services/audio";
import { createSlash } from "../../effects/slash";
import { game, hero, progress } from "../../state";
import { markStruck, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { blowGrow, blowHeavy, blowScale, blowSure, onBlowStruck, takeInstantEcho } from "./blowSkills";
import { startDive } from "./dive";
import { leaveEchoes } from "./echo";
import { mirel } from "./memory";
import { quickRate } from "./quicken";
import { ringCentre } from "./shape";
import type { StaffStrike } from "./strike";
import { strikeShape } from "./strike";

/** the strike of the blow under way, from where she stands now */
export function currentStrike(): StaffStrike {
  const blow = mirel.current;
  return {
    blow,
    spec: STAFF_BLOWS[blow],
    at: { x: hero.x, y: hero.y, face: hero.face },
    echo: false,
    grow: blowGrow(blow),
    scale: blowScale(blow),
    sure: blowSure(),
    heavy: blowHeavy(blow),
  };
}

/** the teal smear the blow leaves on its hit frame */
function smear(s: StaffStrike): void {
  const shape = s.spec.shape;
  const ramp = skin.ramp;
  if (shape.kind === "jab") {
    game.fx.push(
      createSlash(hero.x, hero.y, hero.face, {
        cx: shape.near,
        cy: -shape.y,
        R: shape.far - shape.near + s.grow,
        sy: 0.18,
        rot: 0,
        a0: -0.25,
        a1: 0.15,
        W: 2,
        sweep: 0.03,
        trail: 0.1,
        ramp,
      }),
    );
    return;
  }
  if (shape.kind === "arc") {
    game.fx.push(
      createSlash(hero.x, hero.y, hero.face, {
        cx: 0,
        cy: -SHOULDER_Y,
        R: shape.radius + s.grow,
        sy: 1,
        rot: 0,
        a0: shape.a0,
        a1: shape.a1,
        W: 3,
        sweep: 0.06,
        trail: 0.1,
        ramp,
      }),
    );
    return;
  }
  const [cx, cy] = ringCentre(shape, s.at);
  game.fx.push(
    createSlash(cx, cy, hero.face, {
      cx: 0,
      cy: 0,
      R: shape.radius + s.grow,
      sy: 0.32,
      rot: 0,
      a0: -Math.PI / 2,
      a1: -Math.PI / 2 + Math.PI * 1.96,
      W: 3,
      sweep: 0.08,
      trail: 0.12,
      ramp,
    }),
  );
}

/** the blow strikes on its hit frame and leaves its echoes behind */
function strikeNow(): void {
  const s = currentStrike();
  smear(s);
  const foes = strikeShape(s, struckThisSwing, markStruck);
  onBlowStruck(s, foes);
  leaveEchoes(s, takeInstantEcho());
}

function startBlow(index: number): void {
  mirel.blow = index;
  mirel.current = STAFF_STRING[index];
  mirel.queued = false;
  mirel.struck = false;
  mirel.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("staff");
  sfx.swing(mirel.current === "toll" ? 0.75 : 1.1);
}

/** J on the floor: the next blow of the string, or queue it during one */
export function pressString(): boolean {
  if (hero.state === "staff") {
    mirel.queued = true;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  startBlow(mirel.link > 0 ? mirel.blow : 0);
  return true;
}

/** the clock of a blow: attack speed, and Quickened on top */
const blowRate = (): number => progress.stats.aspd * quickRate() - 1;

/** the blow under way: it strikes on its hit frame, and when it ends a queued press carries the string on, or after
 *  Toll starts the next string */
export function runString(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const b = STAFF_BLOWS[mirel.current];
  if (!mirel.struck && h.st >= b.hit) {
    mirel.struck = true;
    strikeNow();
  }
  if (h.st < b.dur) return;
  const last = mirel.blow >= STAFF_STRING.length - 1;
  const next = last ? 0 : mirel.blow + 1;
  if (mirel.queued) return startBlow(next);
  settle();
  mirel.blow = next;
  mirel.link = last ? 0 : STAFF_LINK;
}

/** a blow's recovery after it struck can be cut short by a jump or a shared action */
export const inRecovery = (): boolean => (hero.state === "staff" || hero.state === "pendant") && mirel.struck;

/** J in the air: Pendant Strike, one per airtime; a hover goes on through it. Falling Hour makes it a dive. */
export function pressPendant(): boolean {
  if (hero.ground || mirel.pendants <= 0) return false;
  if (!isFree() && hero.state !== "fall") return false;
  mirel.pendants--;
  mirel.current = "pendant";
  mirel.struck = false;
  newSwing();
  setState("pendant");
  sfx.swing(1.2);
  startDive();
  return true;
}

/** Pendant Strike: a downward arc ahead on its hit frame */
export function runPendant(dt: number): void {
  const h = hero;
  h.st += dt * blowRate();
  const b = STAFF_BLOWS.pendant;
  if (!mirel.struck && h.st >= b.hit) {
    mirel.struck = true;
    if (!mirel.diving) strikeNow();
  }
  if (h.ground || (h.st >= b.dur && !mirel.diving)) settle();
}

/** a landing hands the airtime's Pendant Strike back */
export function givePendantBack(): void {
  mirel.pendants = PENDANTS_PER_AIR;
}

/** a shared action cuts in: the string starts over and a dive under way ends where she is */
export function cutString(): void {
  mirel.queued = false;
  mirel.blow = 0;
  mirel.link = 0;
  mirel.diving = false;
}
