import { enemyCenter } from "../../../../game/enemies/enemy";
import { moveDef } from "../../../../game/hero/kits";
import { skillEvolved, skillLevel, skillValues, withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { ECHO } from "../../constants/tempo";
import { NIGHT_RAMP } from "../../look/colors";
import { AIR_MOVES } from "../blades";
import { createDuskWave } from "../effects/duskWave";
import { createEchoCut } from "../effects/echoCut";
import { vesperFx } from "../skillFx";
import { gainTempo, tempoTop } from "../tempo";
import { airBlowLanded } from "./airSkills";
import { hexBloom } from "./duskSigil";
import { keenAfterStrike } from "./keen";

/** a small wave of a string blow: Rising Edge's moonrise wave, Crossing Storm's waves */
const WAVE = { speed: 230, life: 0.32, half: 7 } as const;

/** a wave from her blade ahead (or behind), cutting up to `most` foes once; with `tempo`, each foe it cuts adds a stack */
function sendWave(face: number, damage: number, most: number, tempo: boolean, night: boolean): void {
  game.fx.push(
    createDuskWave({
      x: hero.x + face * 12,
      y: hero.y - 18,
      face,
      rise: 0,
      damage,
      speed: WAVE.speed,
      life: WAVE.life,
      struck: new Set<Enemy>(),
      half: WAVE.half,
      ramp: night ? NIGHT_RAMP : undefined,
      most,
      cut: tempo ? () => gainTempo(1) : undefined,
    }),
  );
}

/** Rising Edge: the moonrise sends a wave; echo cuts hit harder; as Crescendo every blow at the top of Tempo echoes */
function edgeAfterStrike(id: string, foes: readonly Enemy[], short: boolean, last: boolean): void {
  const v = skillValues("ve_edge");
  if (skillLevel("ve_edge") && id === "duskCross" && last && foes.length) {
    const [x, y] = enemyCenter(foes[0]);
    const echoes = skillEvolved("ve_edge") ? ECHO.power * echoShare() : 0;
    vesperFx(
      "ve_edge",
      { x, y, face: hero.face },
      { damage: progress.stats.ad * (1 + (v.perStack ?? 0) * 10 + echoes) },
    );
  }
  if (v.wave && id === "moonrise" && last) sendWave(hero.face, progress.stats.ad * v.wave, 3, false, false);
  if (skillEvolved("ve_edge") && tempoTop() && !short)
    for (const foe of foes) game.fx.push(createEchoCut(foe, progress.stats.ad * ECHO.power * echoShare(), ECHO.delay));
}

/** Crossing Storm: a long-blade blow sends a small wave ahead; as Thousand Crossings every blow sends one both ways */
function stormAfterStrike(short: boolean, landed: boolean): void {
  const v = skillValues("ve_storm");
  if (skillLevel("ve_storm") && short && landed) {
    const waves = (v.wave ?? 0) * (skillEvolved("ve_storm") ? 2 : 1);
    vesperFx(
      "ve_storm",
      { x: hero.x + hero.face * 12, y: hero.y - 18, face: hero.face },
      { damage: progress.stats.ad * (1 + (v.shortPower ?? 0) + waves) },
    );
  }
  if (!v.wave) return;
  const both = skillEvolved("ve_storm");
  if (short && !both) return;
  const damage = progress.stats.ad * v.wave;
  const pierce = withBuild("amount", v.pierce ?? 1);
  sendWave(hero.face, damage, pierce, !!v.waveTempo, short);
  if (both) sendWave(-hero.face, damage, pierce, !!v.waveTempo, short);
}

/** what her skills add after a blow of the string lands: `foes` it struck, `short` it was the short blade's */
export function afterStrikeSkills(id: string, foes: readonly Enemy[], short: boolean): void {
  const last = hero.hitIndex === moveDef(id).hits.length;
  edgeAfterStrike(id, foes, short, last);
  stormAfterStrike(short, foes.length > 0);
  keenAfterStrike(id, last);
  if (id === "moonrise" && last) hexBloom(foes);
  if (AIR_MOVES.has(id)) airBlowLanded(foes, tempoTop());
}

/** the extra echo power Rising Edge gives every echo cut */
export const echoShare = (): number => 1 + (skillValues("ve_edge").echo ?? 0);
