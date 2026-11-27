import { CHARACTERS, type HeroId } from "../../heroes/roster";
import type { Goal, HeroStat } from "../../types/achievement";
import type { CharacterDef } from "../../types/character";
import type { EnemyType } from "../../types/enemy";
import type { SkillDef } from "../../types/skill";
import type { UnlockDef } from "../../types/unlock";

export const skillUnlockId = (skill: string): string => `skill:${skill}`;

export const STARTER_SKILLS: Readonly<Record<HeroId, readonly string[]>> = {
  kael: ["k_keen", "k_phase", "k_reap", "k_splinters", "k_volt"],
  cerise: ["ce_measure", "ce_riposte", "ce_pin", "ce_thorns", "ce_bloom"],
  aldric: ["al_oath", "al_breaker", "al_brand", "al_verdict", "al_lance"],
  vesper: ["ve_edge", "ve_keen", "ve_turn", "ve_moon", "ve_hex"],
  saya: ["sa_edge", "sa_clean", "sa_reverse", "sa_flow", "sa_crescent"],
  yun: ["yu_echo", "yu_flow", "yu_tide", "yu_crane", "yu_fan"],
  brynn: ["br_heavy", "br_slam", "br_cleave", "br_launch", "br_arc"],
  zafir: ["za_whirling", "za_unbroken", "za_veins", "za_deep", "za_gale"],
  calder: ["ca_trigger", "ca_breech", "ca_blastjump", "ca_flare", "ca_scorch"],
};

const HUNTED_FOES: Readonly<Record<HeroId, readonly [EnemyType, EnemyType]>> = {
  kael: ["thornback", "mire"],
  cerise: ["moth", "slagling"],
  aldric: ["stormkite", "emberbat"],
  vesper: ["rimehound", "skyguard"],
  saya: ["shardling", "inkling"],
  yun: ["galehawk", "pagewing"],
  brynn: ["husk", "golem"],
  zafir: ["wisp", "rotcrawler"],
  calder: ["sprite", "stalker"],
};

interface Step {
  goal: (hero: string, hunted: readonly [EnemyType, EnemyType]) => Goal;
  price?: number;
  secret?: boolean;
}

const heroGoal =
  (stat: HeroStat, need: number): Step["goal"] =>
  (hero) => ({ kind: "heroStat", hero, stat, need });

const huntGoal =
  (which: 0 | 1, need: number): Step["goal"] =>
  (_, hunted) => ({ kind: "foeKills", foe: hunted[which], need });

const LADDER: readonly Step[] = [
  { goal: heroGoal("kills", 40) },
  { goal: heroGoal("kills", 200) },
  { goal: heroGoal("kills", 500) },
  { goal: heroGoal("minis", 1) },
  { goal: heroGoal("kills", 900) },
  { goal: heroGoal("kills", 1400), price: 150 },
  { goal: heroGoal("level", 70) },
  { goal: heroGoal("kills", 2000) },
  { goal: heroGoal("evolutions", 1) },
  { goal: huntGoal(0, 600) },
  { goal: heroGoal("kills", 2800) },
  { goal: heroGoal("bosses", 1) },
  { goal: heroGoal("kills", 3800), price: 300 },
  { goal: huntGoal(1, 800) },
  { goal: heroGoal("clears", 3), secret: true },
];

const lockedSkills = (c: CharacterDef, starters: readonly string[]): SkillDef[] => {
  const locked = c.skills.filter((s) => !starters.includes(s.id));
  return [...locked.filter((s) => s.kind !== "ultimate"), ...locked.filter((s) => s.kind === "ultimate")];
};

function heroSkillUnlocks(c: CharacterDef): UnlockDef[] {
  const hero = c.id as HeroId;
  const skills = lockedSkills(c, STARTER_SKILLS[hero]);
  if (skills.length !== LADDER.length) throw new Error(`${c.id} has ${skills.length} skills to unlock`);
  return skills.map((s, i) => {
    const step = LADDER[i];
    return {
      id: skillUnlockId(s.id),
      reward: { kind: "skill", hero: c.id, skill: s.id },
      goal: step.goal(c.id, HUNTED_FOES[hero]),
      ...(step.price ? { price: step.price } : {}),
      ...(step.secret ? { secret: true } : {}),
    };
  });
}

export const SKILL_UNLOCKS: readonly UnlockDef[] = CHARACTERS.flatMap(heroSkillUnlocks);
