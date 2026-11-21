import { staggerFoe } from "../../../../game/enemies/stagger";
import { game, hero, progress } from "../../../../game/state";
import type { SheatheOptions } from "../../types/drillSkill";
import { createEchoRelease } from "../effects/echoRelease";
import { sheatheFlash } from "../effects/sheatheFlash";
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
