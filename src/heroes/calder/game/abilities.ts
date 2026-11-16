import { isFree, setState, settle } from "../../../game/hero/actions";
import { blowsDone, endCombo } from "../../../game/hero/combo";
import { lift } from "../../../game/hero/lift";
import { travelEnded } from "../../../game/hero/travelEnd";
import { emitSkillEvent } from "../../../game/skills/events";
import { game, hero, progress } from "../../../game/state";
import type { AbilitySlot } from "../../../types/moveset";
import { RECOIL_TIME } from "../constants/chamber";
import { CALDER_ACTION_CLIPS } from "../constants/clips";
import { ABILITY_COLOR, CALDER_ABILITIES, SCATTER, SHOT_FIRE, SHOT_FIRE_BACK, SLUG } from "../constants/shots";
import type { CalderAbility } from "../types/ability";
import type { CalderClipName } from "../types/moves";
import { muzzlePoint } from "./aim";
import { roundPower } from "./chamber";
import { createMuzzleFlash } from "./effects/muzzleFlash";
import { SHELLS } from "./shells";
import { SHOTS } from "./shotCost";
import { scatterBlast } from "./shots/scatter";
import { createSlug } from "./shots/slug";
import { calder } from "./state";

/** the sword's angle where each shot clip fires, so the flash sits on the muzzle */
const FIRE_ANGLE = { slug: -0.45, breakerSlug: -0.7, scatter: -0.1, twinScatter: -0.1 } as const;

/** the clip a shot plays: Breaker Slug and Twin Scatter have their own, the shells fire as a slug */
function shotClip(a: CalderAbility, wide: boolean): keyof typeof FIRE_ANGLE {
  if (a === "scatter") return wide ? "twinScatter" : "scatter";
  return a === "slug" && wide ? "breakerSlug" : "slug";
}

/** a shot may start now: from a free stance, the follow-through of a blow (a snap shot), or a reload once the rounds are in */
const mayShoot = (): boolean => isFree() || blowsDone() || (hero.state === "reload" && hero.hitDone);

/** the shot under way is Twin Scatter, which fires again behind */
const twinScatter = (): boolean => calder.shotAbility === "scatter" && calder.shotWide;

/** the shot under way has done its work: every round has left the muzzle */
export const shotFired = (): boolean => hero.state === "shot" && hero.hitDone && (!twinScatter() || calder.backFired);

/** I on `a`: pay for it, and fire it from a stance; cut into a blow's follow-through it is a snap shot that skips the aim */
function castShot(a: CalderAbility, wide: boolean): boolean {
  if (!mayShoot()) return false;
  const cost = SHOTS[a];
  if (!cost.affordable(false)) return false;
  // held with only enough for the plain form, the plain form goes
  const pay = wide && cost.affordable(true);
  const snap = hero.state === "move";
  cost.pay(pay);
  calder.shotCd[a] = cost.recharge();
  calder.shotCdFull[a] = calder.shotCd[a];
  calder.shotAbility = a;
  calder.shotWide = pay;
  calder.backFired = false;
  hero.move = null;
  endCombo(false);
  setState("shot");
  if (snap) hero.st = SHOT_FIRE - 1 / 30;
  if (hero.ground) hero.vx = 0;
  emitSkillEvent({ type: "cast", ability: a });
  return true;
}

/** each ability's tab label */
const LABEL: Readonly<Record<CalderAbility, string>> = {
  slug: "SLUG",
  scatter: "SCATTER",
  flare: "FLARE",
  chain: "CHAIN",
  charge: "CHARGE",
};

/** Calder's abilities on I, in the order O turns through them: his two shots, then the shells his spell skills teach */
export const CALDER_SLOTS: readonly AbilitySlot[] = CALDER_ABILITIES.map((a) => ({
  id: a,
  label: LABEL[a],
  tint: `#${ABILITY_COLOR[a].toString(16).padStart(6, "0")}`,
  known: () => SHOTS[a].known(),
  wait: () => calder.shotCd[a],
  full: () => Math.max(0.01, calder.shotCdFull[a]),
  affordable: () => SHOTS[a].affordable(false),
  paidSoon: () => SHOTS[a].paidSoon(),
  cast: (wide: boolean) => castShot(a, wide),
  evolved: () => SHOTS[a].evolved(),
}));

/** the recharges run down */
export function rechargeShots(dt: number): void {
  for (const a of CALDER_ABILITIES) calder.shotCd[a] = Math.max(0, calder.shotCd[a] - dt);
}

/** the round leaves the muzzle: the flash, the recoil, and the shot itself along `dir` */
function fire(dir: number): void {
  const clip = shotClip(calder.shotAbility, calder.shotWide);
  const angle = FIRE_ANGLE[clip];
  const [x, y] = muzzlePoint(dir === hero.face ? angle : Math.PI - angle);
  game.fx.push(createMuzzleFlash(x, y, dir > 0 ? angle : Math.PI - angle));
  calder.recoil = RECOIL_TIME;
  const a = calder.shotAbility;
  const ap = progress.stats.ap * roundPower();
  if (a === "slug") {
    const damage = ap * SLUG.power * (calder.shotWide ? SLUG.wide : 1);
    game.fx.push(createSlug(x, y, dir, { damage, wide: calder.shotWide }));
    return;
  }
  if (a === "scatter") {
    scatterBlast(x, y, dir, ap * SCATTER.power);
    return;
  }
  SHELLS[a](x, y, dir, calder.shotWide);
}

/** Scatter Blast's recoil throws Calder back off his feet */
function recoilHop(): void {
  if (calder.shotAbility !== "scatter" || calder.shotWide) return;
  hero.vx = -hero.face * SCATTER.hop;
  if (hero.ground) lift(SCATTER.hopRise, false);
  calder.hopping = true;
}

/** the shot plays: it fires on its clip's hit, Twin Scatter fires again behind, and the hop lands as a travel move */
export function runShot(): void {
  const h = hero;
  const clip = CALDER_ACTION_CLIPS[shotClip(calder.shotAbility, calder.shotWide) as CalderClipName];
  if (!h.hitDone && h.st >= SHOT_FIRE) {
    h.hitDone = true;
    fire(h.face);
    recoilHop();
  }
  if (twinScatter() && !calder.backFired && h.st >= SHOT_FIRE_BACK) {
    calder.backFired = true;
    fire(-h.face);
  }
  if (calder.hopping && h.ground && h.st > SHOT_FIRE + 0.05) {
    calder.hopping = false;
    h.vx = 0;
    travelEnded();
  }
  if (h.st >= clip.dur) settle();
}

/** the hop drives Calder's speed itself while it is in the air */
export const shotDrivesMotion = (): boolean => hero.state === "shot" && calder.hopping;
