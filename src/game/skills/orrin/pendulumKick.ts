import { SWING } from "../../../constants/orrin/hook";
import { COMET, KICK_ECHO } from "../../../constants/orrin/skillEffects";
import { PAL } from "../../../constants/palette";
import { sfx } from "../../../services/audio";
import type { Enemy } from "../../../types/enemy";
import type { SkillBehavior, SkillMemory } from "../../../types/skillBehavior";
import { dealDamage } from "../../damage";
import { createImpact } from "../../effects/impact";
import { ignite } from "../../enemies/burn";
import { enemyCenter } from "../../enemies/enemy";
import { ghostCanvas } from "../../hero/afterimages";
import { drawHero } from "../../hero/drawHero";
import { heroLook } from "../../hero/look";
import { kickPower } from "../../hero/orrin/swing";
import { game, hero, progress } from "../../state";
import { skillValues, withCharms } from "../query";
import { drawTrail, type FlameTrail, layFlame, newTrail, stepTrail } from "./flameTrail";

const ID = "o_pendulumkick";

/** a kick the afterimage will repeat */
interface Echo {
  foe: Enemy;
  speed: number;
  /** the direction he flew, for the knockback */
  ux: number;
  left: number;
}

interface KickMemory {
  echoes: Echo[];
  /** seconds Comet Heel still lays its trail after a kick */
  comet: number;
  trail: FlameTrail;
}

const memoryOf = (m: SkillMemory): KickMemory => m as unknown as KickMemory;

/** a fading copy of him left where he kicked, which kicks again a moment later */
function leaveGhost(): void {
  drawHero(ghostCanvas, hero.pose, heroLook(4));
  const life = KICK_ECHO.ghost;
  game.ghosts.push({ s: ghostCanvas.snapshot(), x: hero.x, y: hero.y, flip: hero.face < 0, life, max: life });
}

/** the afterimage's kick: the same blow again, from where he was */
function echoKick(echo: Echo): void {
  const e = echo.foe;
  if (e.hp <= 0) return;
  dealDamage(e, progress.stats.ad * kickPower(e, echo.speed), {
    fromX: e.x - echo.ux * 10,
    kx: echo.ux * 120,
    heavy: true,
    melee: true,
    source: ID,
  });
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, Math.sign(echo.ux) || 1, true, PAL.shadow));
  sfx.hit(true, 1.3);
}

/** a foe under the comet trail burns */
function cometBurn(e: Enemy): void {
  dealDamage(e, progress.stats.ad * COMET.power, { fromX: e.x, kx: 0, dot: true, source: ID });
  ignite(e, withCharms("duration", COMET.burn));
}

/**
 * Pendulum Kick: swing kicks start slower, hit harder, launch, stun and give hooks back (in the kit). Here: from level 8
 * a kick at top speed leaves an afterimage that kicks the foe again a moment later; Comet Heel makes it kick on every
 * pass and leaves a burning brass comet trail behind each kick.
 */
export const pendulumKick: SkillBehavior = {
  create: () => ({ echoes: [], comet: 0, trail: newTrail() }),
  update(memory, state, dt) {
    const m = memoryOf(memory);
    for (const echo of m.echoes) {
      echo.left -= dt;
      if (echo.left <= 0) echoKick(echo);
    }
    m.echoes = m.echoes.filter((echo) => echo.left > 0);
    if (state.evolved && m.comet > 0) {
      m.comet -= dt;
      layFlame(m.trail, hero.x, hero.y - 12, withCharms("duration", COMET.life), COMET.drop, dt);
    }
    stepTrail(m.trail, dt, withCharms("area", COMET.reach), COMET.every, cometBurn);
  },
  drawBack(memory) {
    drawTrail(memoryOf(memory).trail, PAL.brass);
  },
  on: {
    swingKick(memory, event, state) {
      const m = memoryOf(memory);
      const v = skillValues(ID);
      if (state.evolved) m.comet = COMET.lay;
      if (!v.echo) return;
      if (!v.echoAll && event.speed < SWING.maxSpeed * KICK_ECHO.topShare) return;
      leaveGhost();
      const ux = hero.vx / (event.speed || 1);
      m.echoes.push({ foe: event.foe, speed: event.speed, ux, left: KICK_ECHO.delay });
    },
  },
};
