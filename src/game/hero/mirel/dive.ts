import type { StaffBlowSpec } from "../../../constants/mirel/string";
import { PAL } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import { createFloorRing } from "../../effects/floorRing";
import { skillValues, withCharms } from "../../skills/query";
import { game, hero, lights } from "../../state";
import { dust, markStruck, newSwing, shake, struckThisSwing } from "../../world";
import { leaveEchoes } from "./echo";
import { giveHoverBack, hoverTime } from "./hover";
import { mirel } from "./memory";
import { openFreeField } from "./stillfield";
import { type StaffStrike, strikeShape } from "./strike";

const ID = "m_fallinghour";
/** how fast the dive drops her */
const DIVE_SPEED = 300;
/** the dive ring's hit on a foe; the landing itself shakes and rings on its own */
const DIVE_FEEL = { stop: 0.06, shake: [0.1, 1.2], pitch: 1 } as const;

/** Falling Hour: the Pendant Strike becomes a dive straight down, harder out of a hover, which it ends */
export function startDive(): void {
  const v = skillValues(ID);
  if (!v.power) return;
  mirel.diving = true;
  mirel.diveBoost = mirel.hovering ? (v.hover ?? 0) : 0;
  mirel.hovering = false;
  hero.vx = 0;
  hero.vy = DIVE_SPEED;
}

/** the dive's ring as a blow: its own radius and power, launching with its level */
function diveStrike(): StaffStrike {
  const v = skillValues(ID);
  const spec: StaffBlowSpec = {
    dur: 0,
    hit: 0,
    shape: { kind: "ring", ahead: 0, radius: withCharms("area", v.ring) },
    power: v.power,
    kx: 80,
    ky: -40,
    lift: v.launch ? -150 : undefined,
    feel: DIVE_FEEL,
  };
  return {
    blow: "pendant",
    spec,
    at: { x: hero.x, y: hero.y, face: hero.face },
    echo: false,
    grow: 0,
    scale: 1 + mirel.diveBoost,
  };
}

/** the dive lands: its ring strikes, echoes with its level, gives the hover back and opens Sky Clock's field */
export function landDive(): void {
  if (!mirel.diving) return;
  mirel.diving = false;
  const v = skillValues(ID);
  const s = diveStrike();
  newSwing();
  strikeShape(s, struckThisSwing, markStruck);
  if (v.echo) leaveEchoes(s);
  if (v.refresh) {
    giveHoverBack();
    mirel.hoverLeft = hoverTime();
  }
  if (v.field) openFreeField(hero.x, hero.y - 16, withCharms("duration", v.field));
  game.fx.push(createFloorRing(hero.x, hero.y, s.spec.shape.kind === "ring" ? s.spec.shape.radius : 24, PAL.hour, 0.4));
  lights.add(hero.x, hero.y - 6, 40, PAL.hour[3], 0.5, 0.25);
  dust(hero.x, hero.y, 8);
  shake(0.15, 2.5);
  sfx.hit(true, 0.8);
}
