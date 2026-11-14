import { ULT_LEVELS } from "../../../../constants/ultimate";
import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { leaveAfterimages } from "../../../../game/hero/afterimages";
import { ultimateValues } from "../../../../game/hero/ultimate";
import { foesOnScreen } from "../../../../game/skills/targets";
import { game, hero, lights, progress } from "../../../../game/state";
import { shake } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { WALTZ_CUTS, WALTZ_FADE, WALTZ_REACH, WALTZ_SHARE, WALTZ_TEMPO } from "../../constants/waltz";
import { DUSK_RAMP, DUSK_SPARKS, NIGHT_RAMP } from "../../look/colors";
import { vesperSound } from "../sound";
import { vesper } from "../state";
import { gainTempo, tempoMost } from "../tempo";

/** a waltz cut: two crossing arcs on the foe, one dusk and one night */
const CUT_A = { cx: 0, cy: 0, R: 16, sy: 0.9, rot: 0.7, a0: -2.5, a1: 0.9, W: 5, sweep: 0.03, trail: 0.16 };
const CUT_B = { ...CUT_A, rot: -0.7, ramp: NIGHT_RAMP };
/** the closing cross of Dusk Waltz's skill: larger, on every foe the dance struck */
const FINALE = { ...CUT_A, R: 26, W: 9, hold: 0.06, trail: 0.3 };

/** one dance: her afterimage hops from foe to foe and cuts, the cuts spread evenly across every foe in reach */
function createDance(foes: Enemy[], cutsEach: number, blow: number, delay: number, last: boolean): Effect {
  const order: Enemy[] = [];
  for (let i = 0; i < cutsEach; i++) order.push(...foes);
  const v = ultimateValues();
  const o = { t: -delay, next: 0, x: hero.x, y: hero.y - 16 };
  const perCut = blow / cutsEach;
  const finish = () => {
    if (v.finale)
      for (const e of foes) {
        if (e.hp <= 0) continue;
        const [x, y] = enemyCenter(e);
        game.fx.push(createSlash(x, y, hero.face, FINALE));
        dealDamage(e, blow * v.finale, { fromX: hero.x, kx: 0, ky: -80, heavy: true, source: "ultimate" });
      }
    leaveAfterimages(o.x, o.y + 16, hero.x, hero.y);
    shake(0.25, 3);
  };
  return {
    update(dt) {
      o.t += dt;
      while (o.t >= o.next * WALTZ_CUTS.gap && o.next < order.length) {
        const first = order[o.next++];
        // a cut whose foe has already fallen goes to the nearest foe still standing in the dance
        const e =
          first.hp > 0
            ? first
            : foes.filter((f) => f.hp > 0).sort((a, b) => Math.abs(a.x - o.x) - Math.abs(b.x - o.x))[0];
        if (!e) continue;
        const [x, y] = enemyCenter(e);
        const side = o.next % 2 ? 1 : -1;
        leaveAfterimages(o.x, o.y + 16, x - side * 10, e.y);
        o.x = x - side * 10;
        o.y = y;
        game.fx.push(createSlash(x, y, side, CUT_A));
        game.fx.push(createSlash(x, y, -side, CUT_B));
        game.fx.push(createImpact(x, y, side, false, DUSK_SPARKS));
        lights.add(x, y, 20, DUSK_RAMP[4], 0.5, 0.15);
        dealDamage(e, perCut, {
          fromX: x - side * 10,
          kx: side * 20,
          ky: -30,
          launch: v.launch ? -160 : undefined,
          source: "ultimate",
        });
        vesperSound.dart();
      }
      if (o.next < order.length) return true;
      if (last) finish();
      return false;
    },
    draw() {},
  };
}

/**
 * Dusk Waltz, Vesper's ultimate: her afterimage dances through every foe in reach and cuts each a few times, more cuts at
 * higher Tempo. Its skill (`ve_waltz`) adds cuts, throws foes up, closes with a cross on every foe it struck, fills Tempo,
 * leaves her untouchable for a moment, and as Endless Waltz dances twice, the second time across the whole screen.
 */
export function castDuskWaltz(level: number): void {
  const v = ultimateValues();
  const reach = WALTZ_REACH[level - 1];
  const near = (r: number) => foesOnScreen().filter((e) => Math.abs(e.x - hero.x) <= r);
  const tempoBonus = 1 + vesper.tempo * WALTZ_TEMPO;
  const blow = ULT_LEVELS[level - 1].power * progress.stats.ad * WALTZ_SHARE * tempoBonus * (v.power ?? 1);
  const cuts = WALTZ_CUTS.base + Math.floor(vesper.tempo / WALTZ_CUTS.perTempo) + (v.cuts ?? 0);
  const foes = near(reach);
  game.fx.push(createDance(foes, cuts, blow, WALTZ_CUTS.first, !v.twice));
  if (v.twice) {
    const again = near(WALTZ_REACH[WALTZ_REACH.length - 1]);
    const later = WALTZ_CUTS.first + foes.length * cuts * WALTZ_CUTS.gap + 0.1;
    game.fx.push(createDance(again, cuts, blow, later, true));
  }
  vesper.fade = WALTZ_FADE;
  if (v.top) gainTempo(tempoMost());
  if (v.untouch) hero.inv = Math.max(hero.inv, v.untouch);
}
