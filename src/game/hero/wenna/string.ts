import { PAL } from "../../../constants/palette";
import { DROPS_PER_AIR, LAMP_BLOWS, LAMP_LINK, LAMP_STRING, QUARRY, SHOULDER_Y } from "../../../constants/wenna/lamp";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import { createSlash } from "../../effects/slash";
import { createFlameCone } from "../../effects/wenna/flameCone";
import { enemyCenter } from "../../enemies/enemy";
import { skillValues } from "../../skills/query";
import { game, hero, lights, progress } from "../../state";
import { markStruck, newSwing, struckThisSwing } from "../../world";
import { isFree, setState, settle } from "../actions";
import { skin } from "../skin";
import { biteFoe } from "./bite";
import { wenna } from "./memory";
import { packLunge } from "./packLunge";
import { isQuarry, markQuarry } from "./quarry";
import type { LampStrike } from "./strike";
import { strikeShape } from "./strike";
import { cappedWicks, spawnWick, wickCap, wicksNear } from "./wicks";

/** Open Shutter's Lighthouse: the Flare's cone becomes a long thin beam */
const BEAM = { far: 160, half: 0.14 } as const;

/** the pixels the Flare's cone reaches past its own, and its half angle: Open Shutter and Lighthouse */
function flareReach(): { grow: number; half: number } {
  const v = skillValues("w_flare");
  const shape = LAMP_BLOWS.flare.shape;
  if (shape.kind !== "cone") return { grow: 0, half: 0 };
  if (v.beam) return { grow: BEAM.far - shape.far, half: BEAM.half };
  return { grow: v.cone ?? 0, half: shape.half };
}

/** the power on top of a blow's own: Open Shutter on the Flare, Wick Hop on a Lamp Drop after a hop */
function blowScale(blow: LampStrike["blow"]): number {
  if (blow === "flare") return 1 + (skillValues("w_flare").power ?? 0);
  if (blow === "drop" && wenna.hopped) return 1 + (skillValues("w_hop").drop ?? 0);
  return 1;
}

/** the strike of the blow under way, from where she stands now */
function currentStrike(): LampStrike {
  const blow = wenna.current;
  const spec = LAMP_BLOWS[blow];
  const flare = blow === "flare" ? flareReach() : null;
  const shaped = flare && spec.shape.kind === "cone" ? { ...spec, shape: { ...spec.shape, half: flare.half } } : spec;
  return {
    blow,
    spec: shaped,
    at: { x: hero.x, y: hero.y, face: hero.face },
    grow: flare?.grow ?? 0,
    scale: blowScale(blow),
    repeat: false,
  };
}

/** the violet smear of the pole on its hit frame, or the cone of flame from the shutter */
function smear(s: LampStrike, power = 1): void {
  const shape = s.spec.shape;
  const ramp = skin.ramp;
  if (shape.kind === "cone") {
    game.fx.push(
      createFlameCone({
        x: s.at.x + s.at.face * 6,
        y: s.at.y - SHOULDER_Y,
        face: s.at.face,
        near: 2,
        far: shape.far + s.grow,
        half: shape.half,
        power,
      }),
    );
    return;
  }
  if (shape.kind === "jab") {
    game.fx.push(
      createSlash(s.at.x, s.at.y, s.at.face, {
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
  game.fx.push(
    createSlash(s.at.x, s.at.y, s.at.face, {
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
}

/** the Flare calls every Wick near its first foe to bite it at once, outside its own timer */
function callWicks(e: Enemy): void {
  const [cx, cy] = enemyCenter(e);
  for (const w of wicksNear(cx, cy, QUARRY.flareCall)) {
    if (e.hp <= 0) return;
    w.face = Math.sign(cx - w.x) || w.face;
    biteFoe(w, e);
  }
}

/** Open Shutter: each Wick near her repeats the Flare from where it stands; with Lighthouse each fires a beam */
function repeatFlare(s: LampStrike): void {
  const v = skillValues("w_flare");
  const share = v.beam ? Math.max(v.echo ?? 0, 0.6) : (v.echo ?? 0);
  if (!share) return;
  for (const w of wicksNear(hero.x, hero.y, QUARRY.flareCall)) {
    const at = { x: w.x, y: w.y + 4, face: w.face };
    const repeat: LampStrike = { ...s, at, scale: s.scale * share, repeat: true };
    smear(repeat, 0.6);
    const struck = new Set<Enemy>();
    strikeShape(
      repeat,
      (e) => struck.has(e),
      (e) => struck.add(e),
    );
  }
}

/** the blow strikes on its hit frame: the foe nearest becomes her Quarry, and the Flare calls the Wicks */
function strikeNow(): void {
  const s = currentStrike();
  smear(s);
  if (s.blow === "flare") lights.add(hero.x + hero.face * 14, hero.y - SHOULDER_Y, 36, PAL.wick[3], 0.4, 0.2);
  const wasQuarry = new Set(game.enemies.filter(isQuarry));
  const kills = new Set<Enemy>();
  const foes = strikeShape(s, struckThisSwing, markStruck);
  for (const e of foes) if (e.hp <= 0) kills.add(e);
  const first = foes[0];
  if (first) {
    if (wasQuarry.has(first)) packLunge(first);
    const marked = skillValues("w_quarry").pack ? foes : [first];
    for (const e of marked) markQuarry(e);
  }
  if (s.blow !== "flare") return;
  if (first) callWicks(first);
  repeatFlare(s);
  if (!skillValues("w_flare").wick) return;
  for (const e of kills) if (cappedWicks().length < wickCap()) spawnWick(enemyCenter(e)[0], hero.y, "skill");
}

function startBlow(index: number): void {
  wenna.blow = index;
  wenna.current = LAMP_STRING[index];
  wenna.queued = false;
  wenna.struck = false;
  wenna.link = 0;
  hero.chain = Math.min(progress.comboLimit, index + 1);
  hero.vx = 0;
  newSwing();
  setState("lamp");
  sfx.swing(wenna.current === "flare" ? 0.8 : 1.15);
}

/** J on the floor: the next blow of the string, or queue it during one */
export function pressString(): boolean {
  if (hero.state === "lamp") {
    wenna.queued = true;
    return true;
  }
  if (!isFree() || !hero.ground) return false;
  startBlow(wenna.link > 0 ? wenna.blow : 0);
  return true;
}

/** the clock of a blow: attack speed */
const blowRate = (): number => progress.stats.aspd;

/** the blow under way: it strikes on its hit frame, and when it ends a queued press carries the string on */
export function runString(dt: number): void {
  const h = hero;
  h.st += dt * (blowRate() - 1);
  const b = LAMP_BLOWS[wenna.current];
  if (!wenna.struck && h.st >= b.hit) {
    wenna.struck = true;
    strikeNow();
  }
  if (h.st < b.dur) return;
  const next = wenna.blow < LAMP_STRING.length - 1 ? wenna.blow + 1 : -1;
  if (wenna.queued && next >= 0) return startBlow(next);
  settle();
  wenna.blow = next >= 0 ? next : 0;
  wenna.link = next >= 0 ? LAMP_LINK : 0;
}

/** a blow's recovery after it struck can be cut short by a jump or a Swap */
export const inRecovery = (): boolean => (hero.state === "lamp" || hero.state === "lampDrop") && wenna.struck;

/** J in the air: Lamp Drop, one per airtime */
export function pressDrop(): boolean {
  if (hero.ground || wenna.drops <= 0) return false;
  if (!isFree() && hero.state !== "fall") return false;
  wenna.drops--;
  wenna.current = "drop";
  wenna.struck = false;
  newSwing();
  setState("lampDrop");
  sfx.swing(1.2);
  return true;
}

/** Lamp Drop: a downward swing ahead on its hit frame */
export function runDrop(dt: number): void {
  const h = hero;
  h.st += dt * (blowRate() - 1);
  const b = LAMP_BLOWS.drop;
  if (!wenna.struck && h.st >= b.hit) {
    wenna.struck = true;
    strikeNow();
  }
  if (h.ground || h.st >= b.dur) settle();
}

/** a landing hands the airtime's Lamp Drop and Wick Hops back */
export function landed(): void {
  wenna.drops = DROPS_PER_AIR;
  wenna.hops = 0;
  wenna.hopped = false;
}
