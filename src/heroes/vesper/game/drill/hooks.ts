import { drillFighter, drillSession } from "../../../../drill";
import { skillEvolved, skillLevel, skillValues } from "../../../../game/skills/query";
import { game, progress } from "../../../../game/state";
import type { DefenseCue, DrillHooks, DrillModifiers, DrillStrikeId } from "../../../../types/drill";
import { DRILL_STATUS } from "../../constants/drill/statuses";
import type { DrillSkillState, VesperDrillSkill } from "../../types/drillSkill";
import { createEchoCut } from "../effects/echoCut";
import { drawDance, resetDance, tickDance } from "./dance";
import { resetLater, tickLater } from "./later";
import { releaseWaltz } from "./release";
import { VESPER_DRILL_SKILLS } from "./skills";
import { liftFoe } from "./statuses";

const PREFIX = "drill.";
const seenCues = new WeakSet<DefenseCue>();

function drillNumbers(id: string): Record<string, number> {
  return Object.fromEntries(
    Object.entries(skillValues(id))
      .filter(([key]) => key.startsWith(PREFIX))
      .map(([key, value]) => [key.slice(PREFIX.length), value]),
  );
}

function held(): [VesperDrillSkill, DrillSkillState][] {
  return VESPER_DRILL_SKILLS.filter((skill) => skillLevel(skill.id) > 0).map((skill) => [
    skill,
    { values: drillNumbers(skill.id), evolved: skillEvolved(skill.id) },
  ]);
}

const strikeNow = (): DrillStrikeId | "warp" => drillFighter()?.swing?.kind ?? "warp";

export function vesperModifiers(neutral: DrillModifiers): DrillModifiers {
  const modifiers = { ...neutral };
  for (const [skill, state] of held()) {
    skill.modify?.(modifiers, state);
  }
  return modifiers;
}

function watchParry(): void {
  const cue = drillSession()?.defenseCue;
  if (!cue || seenCues.has(cue)) {
    return;
  }
  seenCues.add(cue);
  if (cue.kind === "parry" || cue.kind === "enhancedParry") {
    for (const [skill, state] of held()) {
      skill.parried?.(cue, state);
    }
  }
}

export const VESPER_DRILL_HOOKS: DrillHooks = {
  swordHit: (foe, infusion) => {
    const strike = strikeNow();
    if (strike === "third") {
      liftFoe(foe, DRILL_STATUS.finisherLaunch);
    } else if (strike === "air" && foe.air) {
      liftFoe(foe, DRILL_STATUS.airJuggle);
    }
    if (infusion) {
      const { power, delay } = DRILL_STATUS.infusedEcho;
      game.fx.push(createEchoCut(foe, progress.stats.ad * power, delay, "attacks"));
    }
    for (const [skill, state] of held()) {
      skill.swordHit?.(foe, infusion, strike, state);
    }
  },
  slashed: (strike, landed) => {
    const h = drillFighter();
    if (strike === "third" && landed && h?.grounded) {
      h.grounded = false;
      h.vy = -DRILL_STATUS.finisherLeap;
      h.airSlashes = 0;
    }
    for (const [skill, state] of held()) {
      skill.slashed?.(strike, landed, state);
    }
  },
  spellHit: (foe, spell) => {
    for (const [skill, state] of held()) {
      skill.spellHit?.(foe, spell, state);
    }
  },
  dashed: (foes) => {
    for (const [skill, state] of held()) {
      skill.dashed?.(foes, state);
    }
  },
  released: (cast) => {
    releaseWaltz(cast, 1);
    for (const [skill, state] of held()) {
      skill.released?.(cast, state);
    }
  },
  tick: (dt) => {
    tickLater(dt);
    tickDance(dt);
    watchParry();
    for (const [skill, state] of held()) {
      skill.tick?.(dt, state);
    }
  },
  draw: drawDance,
  reset: () => {
    resetLater();
    resetDance();
  },
};
