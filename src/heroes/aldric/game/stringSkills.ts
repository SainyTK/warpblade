import { consumeStacks, markFoe } from "../../../game/enemies/skillStatus";
import { emitSkillEvent } from "../../../game/skills/events";
import { skillEvolved, skillValues, withBuild } from "../../../game/skills/query";
import { game, hero, progress } from "../../../game/state";
import { boxAhead } from "../../../game/world";
import { CREST_RING, OATH_WAVE } from "../constants/skillNumbers";
import type { AldricMoveId } from "../types/moves";
import { createDawnGround } from "./effects/dawnGround";
import { createDelayedRing } from "./effects/delayedRing";
import { createLightWave } from "./effects/lightWave";
import { foesIn, strikeEach } from "./strike";
import { gainValor } from "./valor";
import "../types/events";
import { enemyCenter } from "../../../game/enemies/enemy";
import { aldricFx } from "./fx";

/** the tiered effect of each blow his string skills ride on */
function stringFx(id: AldricMoveId, hits: number): void {
  const face = hero.face;
  if (id === "oathCut") {
    const cut = { x: hero.x + face * 6, y: hero.y - 17, face, reach: 15 };
    aldricFx("al_oath", "slash", cut, { damage: progress.stats.ad * 1.2, quiet: !hits, sigil: "sword" });
  }
  if (id === "shieldBash" && hits && hero.lastHit) {
    const [x, y] = enemyCenter(hero.lastHit);
    const damage = progress.stats.ad * (1 + (skillValues("al_breaker").shock ?? 0));
    aldricFx("al_breaker", "burst", { x: x - face * 4, y, face, reach: 11 }, { damage, sigil: "shield" });
    if (skillEvolved("al_breaker")) {
      aldricFx("al_breaker", "nova", { x, y: hero.y, reach: 30 }, { quiet: true, delay: 0.08 });
    }
  }
  if (id === "crestBreaker" && hero.ground) {
    const gx = hero.x + face * 18;
    const damage = progress.stats.ad * 2 * (skillValues("al_crest").crest ?? 1);
    aldricFx("al_crest", "pillar", { x: gx, y: hero.y, face, reach: 26 }, { damage, sigil: "sword", lift: 12 });
    if (skillEvolved("al_crest")) {
      for (let i = 1; i <= 2; i++) {
        const px = gx + face * 28 * i;
        aldricFx("al_crest", "pillar", { x: px, y: hero.y, reach: 22 }, { quiet: true, delay: i * 0.08 });
      }
    }
  }
}

/** Oathblade: a wave of light from the blow, from Crest breaker only until every blow throws one */
function oathWave(id: AldricMoveId): void {
  const v = skillValues("al_oath");
  if (!v.wave || !hero.ground) return;
  if (id !== "crestBreaker" && !v.waveAll) return;
  const size = v.size ?? 1;
  const crest = { x: hero.x + hero.face * 12, y: hero.y, face: hero.face, reach: 26 * size };
  aldricFx("al_oath", "wave", crest, { quiet: true, damage: progress.stats.ad * v.wave });
  game.fx.push(
    createLightWave(hero.x + hero.face * 12, hero.y - 18, hero.face, {
      speed: OATH_WAVE.speed,
      reach: withBuild("area", OATH_WAVE.reach * size),
      half: OATH_WAVE.half * size,
      damage: progress.stats.ad * v.wave,
      pierce: !!v.pierce || skillEvolved("al_oath"),
    }),
  );
}

/** Breaking Bash: the bashed foe is marked, a shock runs through to the foes behind it, and as Shattering Bash every
 *  Sunbrand on the foes it reaches bursts */
function breakingBash(): void {
  const v = skillValues("al_breaker");
  const foe = hero.lastHit;
  if (v.valor) gainValor(v.valor);
  if (foe && v.mark) markFoe(foe, "al_breaker", withBuild("duration", 3), v.mark);
  if (foe && v.shock) {
    const reach = withBuild("area", v.shockReach);
    const behind = foesIn(boxAhead(0, -36, 27 + reach, 0), foe.x).filter(
      (e) => e !== foe && (e.x - foe.x) * hero.face > 0,
    );
    strikeEach(behind, progress.stats.ad * v.shock, { fromX: hero.x, kx: 60, ky: -20, stagger: 0.5 });
  }
  if (!skillEvolved("al_breaker")) return;
  for (const e of foesIn(boxAhead(-2, -40, 40, 2), hero.x)) {
    const stacks = consumeStacks(e, "al_brand");
    if (stacks)
      strikeEach([e], progress.stats.ad * v.shatter * stacks, { fromX: hero.x, kx: 40, ky: -40, heavy: true });
  }
}

/** Crestfall: rings of light run out along the floor from Crest breaker, each knocking the foes it reaches down */
function crestRings(): void {
  const v = skillValues("al_crest");
  if (!hero.ground) return;
  if (v.valor) gainValor(v.valor);
  if (skillValues("al_dawn").crest) {
    const d = skillValues("al_dawn");
    game.fx.push(
      createDawnGround(
        hero.x + hero.face * 18,
        withBuild("area", d.width),
        withBuild("duration", d.time),
        progress.stats.ap * d.burn,
      ),
    );
  }
  if (!v.ring) return;
  const r = withBuild("area", v.ring);
  const gx = hero.x + hero.face * 18;
  for (let i = 0; i <= (v.echo ?? 0); i++)
    game.fx.push(
      createDelayedRing(gx, hero.y, r * (1 + i * CREST_RING.grow), i * CREST_RING.gap, progress.stats.ad * v.power, {
        kx: 50,
        ky: -50,
        stun: v.stun,
        heavy: true,
      }),
    );
}

/** a blow of the ground string is out: what his skills add to it */
export function stringSkills(id: AldricMoveId, hits: number): void {
  stringFx(id, hits);
  oathWave(id);
  if (id === "shieldBash" && hits) {
    breakingBash();
    emitSkillEvent({ type: "bash", foe: hero.lastHit, hits });
  }
  if (id === "crestBreaker") crestRings();
}
