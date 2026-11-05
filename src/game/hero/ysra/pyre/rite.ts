import { PYRE_STATE_CLIPS } from "../../../../constants/clips/ysra/pyre";
import { DENY_FLASH } from "../../../../constants/combat";
import { RITE_RAMP, RITE_SPARKS } from "../../../../constants/ysra/emberLook";
import { BRAZIER, FLAME_PILLAR as P } from "../../../../constants/ysra/rites";
import { sfx } from "../../../../services/audio";
import { PK } from "../../../../types/particle";
import type { RiteDef, RiteId } from "../../../../types/ysra/pyre";
import { createFloorRing } from "../../../effects/floorRing";
import { hasPerk } from "../../../progress";
import { plantBrazier } from "../../../spells/rites/brazier";
import { castFlamePillar } from "../../../spells/rites/flamePillar";
import { castFlare } from "../../../spells/rites/flare";
import { castPyreColonnade } from "../../../spells/rites/pyreColonnade";
import { game, hero, lights, particles, rng } from "../../../state";
import { surfaceBelow } from "../../../world";
import { isFree, setState, settle } from "../../actions";
import { blowsDone, endCombo } from "../../combo";
import { healFromRite } from "./hearthfire";
import { flashHeat, heat, overheatLeft, overheatReady, spendHeat, startOverheat } from "./heat";
import { riteCost, selectedRite } from "./riteChoice";

const CLIP = PYRE_STATE_CLIPS.rite;
/** what the rite under way lets loose when the glaive is planted: a rite, or Overheat */
let calling: RiteId | "overheat" = "flare";

/** the nearest foe ahead within reach, or a spot just ahead when there is none */
function pillarSpot(): number {
  let best = hero.x + hero.face * P.fallback;
  let bestD: number = P.seek;
  for (const e of game.enemies) {
    const d = (e.x - hero.x) * hero.face;
    if (e.hp <= 0 || d < -6 || d >= bestD) continue;
    best = e.x;
    bestD = d;
  }
  return best;
}

/** a rite at this spot; Hot Iron calls the pillar without a cast */
export function letLoose(id: RiteId, x: number): void {
  const floor = surfaceBelow(x, hero.y);
  if (id === "flare") game.fx.push(castFlare(x, floor));
  else if (id === "flamePillar") game.fx.push(castFlamePillar(x, floor));
  else game.fx.push(plantBrazier(x, floor));
}

/** Overheat bursts out of her: a tall ring and a shower of embers */
function igniteOverheat(): void {
  startOverheat();
  game.fx.push(createFloorRing(hero.x, hero.y, 44, [...RITE_RAMP].reverse(), 0.6, 0.3));
  lights.add(hero.x, hero.y - 16, 60, RITE_RAMP[4], 0.7, 0.6);
  for (let i = 0; i < 30; i++)
    particles.spawn(PK.SPARK, hero.x, hero.y - 16, rng.range(-200, 200), -rng.range(80, 320), rng.range(0.3, 0.7), {
      sparks: RITE_SPARKS,
    });
  sfx.tone(140, 620, 0.5, "sawtooth", 0.06);
  sfx.noise(0.6, 600, 3000, 0.16, "bandpass", 0.9);
}

/** she plants the glaive and the rite bursts out; an evolved Flame Pillar bursts as Pyre Colonnade */
function release(): void {
  if (calling === "overheat") return igniteOverheat();
  const x =
    calling === "flamePillar" ? pillarSpot() : calling === "brazier" ? hero.x + hero.face * BRAZIER.ahead : hero.x;
  if (calling === "flamePillar" && hasPerk("pyreColonnade")) castPyreColonnade(x, hero.y);
  else letLoose(calling, x);
  healFromRite(calling);
}

/** a rite can start on the floor, standing or out of a string blow that has landed */
const canCall = (): boolean => hero.ground && (isFree() || (hero.state === "move" && blowsDone()));

function begin(what: RiteId | "overheat"): void {
  calling = what;
  if (hero.state === "move") {
    hero.move = null;
    endCombo(true);
  }
  hero.vx = 0;
  setState("rite");
}

/** I: Overheat at full Heat once learned, otherwise the selected rite; refused with a tick when Heat is short */
export function pressRite(): boolean {
  if (!canCall()) return false;
  if (overheatReady()) {
    begin("overheat");
    return true;
  }
  const rite: RiteDef | null = selectedRite();
  if (!rite) return true;
  const cost = riteCost(rite);
  if (overheatLeft() > 0 || heat() < cost) {
    flashHeat(DENY_FLASH);
    sfx.denied();
    return true;
  }
  spendHeat(cost);
  begin(rite.id);
  return true;
}

/** the rite pose plays; the rite leaves on its planting frame */
export function runRite(): boolean {
  const h = hero;
  if (h.state !== "rite") return false;
  if (!h.hitDone && h.st >= CLIP.hit) {
    h.hitDone = true;
    release();
  }
  if (h.st >= CLIP.dur) settle();
  return true;
}
