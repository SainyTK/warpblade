import { drillFighter } from "../../../../drill";
import { staggerFoe } from "../../../../game/enemies/stagger";
import { skillLevel } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import { SKILL } from "../../constants/skills/ids";
import type { SheatheOptions } from "../../types/drillSkill";
import { createEchoRelease } from "../effects/echoRelease";
import { sheatheFlash } from "../effects/sheatheFlash";
import { sayaFx } from "../skillFx";
import { releaseCuts, storedCuts } from "../store";
import { heldSkills } from "./held";

export function sheathe(source: "attacks" | "abilities" | "ultimate" = "attacks", extra: Partial<SheatheOptions> = {}) {
  if (!storedCuts().length) {
    return [];
  }
  const options: SheatheOptions = { factor: 1, clean: false, echo: 0, stagger: 0, mp: 0, ...extra };
  for (const [skill, state] of heldSkills()) {
    skill.sheathe?.(options, state);
  }
  sheatheFlash();
  const released = releaseCuts(true, { factor: options.factor, clean: options.clean });
  if (skillLevel(SKILL.clean) && released.length) {
    const h = drillFighter() ?? hero;
    const total = released.reduce((sum, cut) => sum + cut.amount, 0);
    sayaFx(
      SKILL.clean,
      { x: h.x - h.face * 22, y: h.y - 14, face: h.face, toX: h.x + h.face * 10, toY: h.y - 14 },
      { damage: total },
    );
  }
  for (const cut of released) {
    if (options.stagger) {
      staggerFoe(cut.foe, options.stagger);
    }
  }
  if (options.mp) {
    hero.mp = Math.min(progress.stats.mp, hero.mp + options.mp * released.length);
  }
  if (options.echo && released.length) {
    game.fx.push(createEchoRelease(released, options.echo, source));
  }
  return released;
}
