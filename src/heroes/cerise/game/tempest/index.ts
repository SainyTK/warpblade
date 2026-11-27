import { ULT_LEVELS } from "../../../../constants/ultimate";
import { clampStageX } from "../../../../game/adventure";
import { createSlash } from "../../../../game/effects/slash";
import { setState, settle } from "../../../../game/hero/actions";
import { travelEnded } from "../../../../game/hero/travelEnd";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { game, hero, lights, progress } from "../../../../game/state";
import { boxAhead, newSwing, shake } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import { TEMPEST } from "../../constants/tempest";
import { ROSE_RAMP } from "../../look/rose";
import { createRoseLine } from "../effects/roseLine";
import { atFloor, ceriseFx } from "../fx";
import { roseMark } from "../mark";
import { THRUST } from "../moves/slashes";
import { cerise } from "../state";
import { pointStrike } from "../strike";

/** the level's power as damage: the charge level's power times attack damage */
const levelDamage = (): number => ULT_LEVELS[cerise.tempestLevel - 1].power * progress.stats.ad;

/**
 * Rose Tempest, Cerise's ultimate: a storm of thrusts into the foes ahead, then a lunge along her line while a streak
 * of rose light runs on ahead of her. Its skill (`ce_tempest`) adds thrusts, power, marks, a second streak behind her
 * and, evolved, a second storm at the end of the lunge.
 */
export function castRoseTempest(level: number): void {
  cerise.tempestLevel = level;
  cerise.tempestThrusts = 0;
  cerise.tempestLunged = false;
  setState("tempest");
  hero.vx = 0;
}

/** how many thrusts the storm has: ten, more with its skill */
const stormThrusts = (): number => TEMPEST.thrusts + (ultimateValues().thrusts ?? 0);

/** one thrust of the storm on every foe in reach ahead */
function stormThrust(i: number): void {
  const v = ultimateValues();
  newSwing();
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...THRUST, cy: -14 - (i % 4) * 3, R: 34, W: 3, trail: 0.1 }));
  const struck = pointStrike([boxAhead(...TEMPEST.box)], {
    damage: levelDamage() * TEMPEST.storm * (v.power ?? 1),
    source: "ultimate",
    kx: 6,
    stagger: 0.4,
    feel: { stop: 0.01, shake: [0.04, 0.8], pitch: 1.6 },
  });
  if (v.mark) for (const e of struck) roseMark(e);
  if (i % 2 === 0) sfx.swing(1.7);
}

/** the lunge: she flies along her line and the streak runs on ahead, striking every foe on it */
function lunge(): void {
  const v = ultimateValues();
  cerise.tempestLunged = true;
  const blow = levelDamage() * TEMPEST.lunge * (v.power ?? 1) * (v.lunge ?? 1);
  const ly = hero.y - 17;
  ceriseFx("ce_tempest", "pillar", atFloor(hero.x + hero.face * 36, hero.y, 30 + cerise.tempestLevel * 4), {
    damage: blow,
    sigil: "rose",
    lift: 34,
  });
  ceriseFx(
    "ce_tempest",
    "trail",
    { x: hero.x, y: ly, face: hero.face, toX: hero.x + hero.face * 80, toY: ly },
    { damage: blow, quiet: true },
  );
  const reach = TEMPEST.reach[cerise.tempestLevel - 1] * (v.reach ?? 1);
  const damage = levelDamage() * TEMPEST.lunge * (v.power ?? 1) * (v.lunge ?? 1);
  const y = hero.y - 17;
  const end = clampStageX(hero.x + hero.face * reach, -8);
  game.fx.push(createRoseLine(hero.x, y, hero.face, damage, "ultimate", undefined, end));
  if (v.behind) game.fx.push(createRoseLine(hero.x, y, -hero.face, damage * v.behind, "ultimate", undefined));
  hero.vx = hero.face * TEMPEST.speed;
  lights.add(hero.x + hero.face * 20, y, 40, ROSE_RAMP[3], 0.5, 0.35);
  shake(0.3, 3.2);
  sfx.ultimate(cerise.tempestLevel);
}

/** play the ultimate: the storm, the lunge, the stop that ends the travel */
export function runTempest(): void {
  const h = hero;
  h.inv = Math.max(h.inv, 0.1);
  while (
    cerise.tempestThrusts < stormThrusts() &&
    h.st >= TEMPEST.start + cerise.tempestThrusts * TEMPEST.gap * (TEMPEST.thrusts / stormThrusts())
  ) {
    stormThrust(cerise.tempestThrusts);
    cerise.tempestThrusts++;
  }
  if (!cerise.tempestLunged && h.st >= TEMPEST.lungeAt) lunge();
  const travel = TEMPEST.travel / TEMPEST.speed;
  if (cerise.tempestLunged && h.st >= TEMPEST.lungeAt + travel && h.vx !== 0) {
    h.vx = 0;
    travelEnded();
    if (ultimateValues().finale) finale();
  }
  if (h.st >= TEMPEST.dur) settle();
}

/** Thousand Roses: a second storm where the lunge ends, a ring of thrusts both ways */
function finale(): void {
  newSwing();
  const v = ultimateValues();
  const blow = levelDamage() * v.finale;
  ceriseFx("ce_tempest", "nova", atFloor(hero.x, hero.y, 48), { damage: blow });
  for (const side of [-1, 1])
    ceriseFx("ce_tempest", "pillar", atFloor(hero.x + side * 30, hero.y, 26), {
      damage: blow,
      quiet: true,
      delay: 0.08,
    });
  pointStrike([boxAhead(-48, -40, 48, 2)], {
    damage: levelDamage() * v.finale,
    source: "ultimate",
    kx: 80,
    ky: -60,
    heavy: true,
    feel: { stop: 0.1, shake: [0.25, 3], pitch: 0.8 },
  });
  game.fx.push(
    createSlash(hero.x, hero.y, hero.face, {
      cx: 0,
      cy: -18,
      R: 30,
      sy: 0.4,
      rot: 0,
      a0: -3.1,
      a1: 3.1,
      W: 6,
      ramp: ROSE_RAMP,
    }),
  );
}

/** the kit drives her speed during the lunge */
export const tempestDrives = (): boolean => hero.state === "tempest";
