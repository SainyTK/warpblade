import { ULT_LEVELS } from "../../../../constants/ultimate";
import { dealDamage } from "../../../../game/damage";
import { createBlastCore } from "../../../../game/effects/flash";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { setState, settle } from "../../../../game/hero/actions";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { emitSkillEvent } from "../../../../game/skills/events";
import { withBuild } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { hitStop } from "../../../../game/world";
import type { Enemy } from "../../../../types/enemy";
import { HOT_BLAST } from "../../constants/chamber";
import { BREAK_END } from "../../constants/clips/ultimate";
import { HOT_RAMP, PHOSPHOR } from "../../constants/colors";
import { BREAK_BASE_CUTS, BREAK_FIRST, BREAK_GAP, BREAK_REACH, BREAK_SHARE } from "../../constants/ultimate";
import { fillChamber } from "../chamber";
import { roundBlast } from "../effects/roundBlast";
import { SLASHES } from "../moves/slashes";
import { calderFx, calderRing } from "../skillFx";
import { calder } from "../state";
import { breakFinale } from "./finale";

const BREAK_ID = "ca_break";

/** when cut `i` lands, in seconds into the state */
export const cutTime = (i: number): number => BREAK_FIRST + i * BREAK_GAP;
/** when the run of cuts is over and the recovery starts */
export const breakOver = (): number => cutTime(calder.breakCuts);

/** the foes a cut reaches: every standing foe within its reach on either side, at about Calder's height */
function inReach(): Enemy[] {
  return game.enemies.filter((e) => {
    if (e.hp <= 0) return false;
    const [ex, ey] = enemyCenter(e);
    return Math.abs(ex - hero.x) <= calder.breakReach && Math.abs(ey - (hero.y - 16)) < 60;
  });
}

/** one cut of the run: a slash falling or rising by turn, and a round going off in every foe in reach */
function cut(i: number): void {
  const rising = i % 2 === 1;
  const ramp = calder.hot ? HOT_RAMP : PHOSPHOR;
  game.fx.push(createSlash(hero.x, hero.y, hero.face, { ...(rising ? SLASHES.rip : SLASHES.hew), ramp }));
  const foes = inReach();
  for (const e of foes) {
    const [ex, ey] = enemyCenter(e);
    dealDamage(e, calder.breakBlow, {
      fromX: hero.x,
      kx: Math.sign(ex - hero.x) * 40,
      ky: rising ? -120 : -30,
      source: "ultimate",
    });
    game.fx.push(createBlastCore(ex, ey, ramp[4]));
  }
  const [x, y] = foes[0] ? enemyCenter(foes[0]) : [hero.x + hero.face * 22, hero.y - 18];
  roundBlast(x, y, hero.face, calder.hot, true);
  const last = i === calder.breakCuts - 1;
  if (i === 0 || last) {
    const ring = { x: hero.x, y: hero.y, face: hero.face, reach: calder.breakReach * (last ? 0.7 : 0.45) };
    calderRing(BREAK_ID, "wave", ring, { damage: calder.breakBlow * (last ? calder.breakCuts : 1) });
  }
  calderFx(BREAK_ID, "burst", { x, y, face: hero.face, reach: 14 }, { damage: calder.breakBlow, quiet: !last });
  hitStop(0.04);
  emitSkillEvent({ type: "calderBlast", x, y, foes, kind: "ultimate" });
}

/**
 * Cylinder Break, Calder's ultimate: every round in the chamber goes into a run of exploding cuts, three with an empty
 * chamber and one more per round, each striking every foe in reach. Hot rounds hit half again as hard. The chamber
 * reloads hot when it is over. Its skill (`ca_break`) adds cuts and power, pulls foes in and ends the run with a finale.
 */
export function castCylinderBreak(level: number): void {
  const v = ultimateValues();
  const rounds = calder.rounds;
  calder.breakCuts = BREAK_BASE_CUTS + rounds + (v.cuts ?? 0);
  calder.breakDone = 0;
  calder.breakBlow =
    ULT_LEVELS[level - 1].power *
    progress.stats.ad *
    BREAK_SHARE *
    (v.power ?? 1) *
    (calder.hot || v.hot ? HOT_BLAST : 1);
  calder.breakReach = withBuild("area", BREAK_REACH[level - 1]);
  calder.rounds = 0;
  setState("cylinderBreak");
  hero.vx = 0;
  hero.inv = Math.max(hero.inv, breakOver() + BREAK_END.dur);
}

/** the run plays: each cut on its time, then the recovery, the finale and the chamber filled hot */
export function runCylinderBreak(): void {
  const h = hero;
  while (calder.breakDone < calder.breakCuts && h.st >= cutTime(calder.breakDone)) {
    if (ultimateValues().pull) for (const e of inReach()) e.vx += Math.sign(h.x - e.x) * 60;
    cut(calder.breakDone);
    calder.breakDone++;
  }
  if (!h.hitDone && calder.breakDone >= calder.breakCuts) {
    h.hitDone = true;
    breakFinale(calder.breakBlow);
    fillChamber(true);
    emitSkillEvent({ type: "calderReload", quick: true, ultimate: true });
  }
  if (h.st >= breakOver() + BREAK_END.dur) settle();
}
