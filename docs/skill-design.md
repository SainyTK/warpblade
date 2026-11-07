# Skill design

The skill rework asked for on 7 November 2026 (task T-mac-213, second round), after the owner played the growth loop.
Owner feedback: the relic system leans too hard on Vampire Survivors, long combos do not work in a game full of knock-ups, and the extended combo inputs (dash after the fourth hit, Up or Down after a combo) are rarely used.
Relics go away completely.
Their idea of growth (levels 1 to 8, then an evolution with a partner) moves to each hero's own skills.

This file is the contract between the framework and the four hero builds.
Each hero's full skill list and numbers live in `docs/skills/<hero>.md`.
Numbers here are starting values; balance changes them in the constants files and updates this file when the shape changes.

## Words

- **Skill**: one of a hero's 20 skills. Levels 1 to 8, then one evolution.
- **Partner**: the other skill of the same hero a skill needs to evolve.
- **Evolution**: the skill's final form, given by a chest once the skill is at level 8 and its partner is owned at level 4 or more.
- **Charm**: a passive that multiplies a stat for every source (Might, Haste). Charms stay as they are; the ones that worked only on relics now work on skills.
- **Base kit**: what a hero can do with no skill at all. Every button does something from the first second of a run.
- **Build**: the skills, charms and evolutions a hero holds in a run, in `progress.build`, reset with the run.

## What goes away

- Relics: data, code, icons, cards, slots, chest relic upgrades, relic unlock goals, relic Codex entries, relic damage sources, the playtest bots' relic preference and the relic sections of the docs.
  A hero may bring back a relic's idea as one of its own skills, themed to the hero (for example a summon that strikes after a blow).
- The skill tree: branches, paths, `requires`, `crossRequires`, `needs`, `group`, ranks and level gates on skills.
  Skill picks have no prerequisites; any of the hero's 20 skills can be dealt from wave 1.
- Combo length growth: combo hits no longer grow with level or with a skill (Flowing Chain and its kind are gone).
- Extended combo inputs: any move that needs a direction, a dash or a double tap pressed during or right after a combo (Kael's Rising Launcher, Low Sweep, Phase Finish and Skybreaker, and the same kind of input on the other heroes).
  What those moves did can come back in an easier form: picked by the situation, triggered by the combo's last hit, or on a single button.

## Combo

- `CharacterDef.comboHits` fixes the length of the ground string for the whole run: Kael 4, Ysra 3, Sable and Hulda chosen by their designers (2 to 4).
- Attack skills change the string's damage, speed and on-hit effects, never its length.
- The air string limit is fixed per hero or raised by one movement skill; the hero designer chooses.

## Base kit and buttons

- J attack, L dash, K warp or the hero's K action, I ability, O switch ability, U ultimate, Up jump: the controls stay as they are.
- With no skill, every button the hero uses does something. The hero designer chooses the base kit and writes it in `docs/skills/<hero>.md`.
- A skill either attaches to one of those buttons (`button` in its data) or runs on its own (`auto`). No skill adds a new key combination.
- Several skills on J, K, L or jump stack: each adds its effect to the same press.
- Ability skills on I join a rotation that O switches through, the way Kael's elements work today.
- The special ultimate is in the base kit. Ultimate skills upgrade or replace it. A build holds at most one ultimate skill; once one is owned the others are no longer dealt.

## The 20 skills

Each hero has exactly 20 skills, at least this many of each kind:

| Kind | Least | What it is |
| --- | --- | --- |
| `attack` | 4 | Changes J blows: damage, speed, on-hit effects, a situational move. |
| `movement` | 3 | Changes dash, warp, jump or the hero's travel moves; hits on the move. |
| `spell` | 3 | An MP ability on I (or the hero's ability button). |
| `dot` | 3 | Damage over time: burns, bleeds, poisons, curses. Weak early, a real attack once levelled and evolved. |
| `summon` | 3 | A chance on a trigger (blow landed, ability cast, perfect dodge, parry, kill) to call a supporter that strikes on its own. |
| `passive` | 0 | A lasting change: stats, Flow, sustain. |
| `ultimate` | 1 | Upgrades or replaces the U special. At most 3 per hero. |

The rest are the designer's choice.

### Levels

- Level 1 to level 8 must feel almost completely different.
  At least four of a skill's seven level ups add a new property (another projectile, pierce, a status, a new shape, a second trigger, a follow-up hit); the others are large number steps.
- The card says what the next level changes in one short line.
- Level 8 is about 6 to 10 times level 1 on its intended target.

### Risk and reward

Every skill has a `risk`:

- `easy`: wide area, automatic or forgiving. Lowest damage.
- `timed`: needs positioning or timing within ordinary play (a dash through foes, a cast into a crowd, the combo's last hit).
- `precise`: needs a parry, a perfect dodge, a Keen press, a back attack or a hard read. Highest damage, and special buffs when pulled off.

Damage budget at level 8, on its intended target, measured per second of ordinary play: `timed` about 1.6 times `easy`, `precise` about 2.5 to 3 times `easy`.
Evolutions keep the trade: an `easy` evolution grows area and reliability, a `precise` evolution grows damage a lot or adds a strong buff when pulled off.

### Damage over time

`dot` skills pay off late on purpose: at levels 1 to 4 they deal less than an `attack` skill of the same level, at 7 and 8 more, and their evolution turns the stacks into an attack (a detonation, a spread, a consuming strike).
Taking one early costs the player early power for a much stronger late game.

### Summons

A summon has a trigger and a chance; levels raise the chance, the supporter's damage, duration, count or give it a new move.
A summon never fires more than its own internal cooldown allows, so attack speed does not break it.

## Evolution

- A skill at level 8 with its partner owned at level 4 or more (`EVOLVE_PARTNER_LEVEL`) is ready.
- From wave 8, a chest evolves one ready skill, as it evolved relics before.
- Partners are other skills of the same hero, so evolutions shape which skills a player keeps together.
- The partner of a skill is hidden ("Evolves with ???") on cards and in the Codex until the player has made that evolution once.
- Target: in most runs a player evolves at most three skills, and only by steering with skips, banishes and rerolls. Evolving all eight is possible in theory and almost never happens.

## Slots and cards

- 8 skill slots from the first run (`SKILL_SLOTS`). Charm slots unchanged (3, unlocking up to 5).
- A pick deals 3 cards, 4 with luck, as before.
- Cards for skills the hero does not hold yet come up much more often than the next level of a skill already held; charms sit between.
  The weights are tuned with the growth model so that, over a full run:
  - a player who takes the best card each time and uses no tools evolves 1 to 2 skills (median);
  - a player who steers with skips, banishes and rerolls evolves 3 (median), and 4 or more in under 10% of runs.
- Once all 8 slots are full, new skills are no longer dealt; the card pool is the owned skills, charms and Second Wind.
- Reroll, skip and banish work as before. The run's starting amounts may change in tuning.

## Chests

- From wave 8 a chest evolves one ready skill if there is one.
- Otherwise it gives 1 upgrade (3 or 5 with luck): each a random owned skill or charm below its maximum. With nothing to raise it heals fully.

## Damage sources and Flow

- Hits of the hero's own presses (J, K, L, I, U, jump), and the skill effects those presses carry, count for `attacks`, `abilities` or `ultimate` and build Flow.
- A skill that deals its own hits (a summon, a projectile it launches on its own, damage over time, an aura) uses its skill id as the source and does not build Flow.
- The end of run screen lists each skill source by its name, with its level or Evolved.

## Code

- `src/types/skill.ts`: `SkillDef`, `SkillLevel`, `SkillKind`, `SkillRisk`, `SkillButton`.
- `CharacterDef.skills` (20) replaces `branches` and `startRanks`; `CharacterDef.comboHits` is new.
- Skill data: `src/constants/characters/<hero>/skills/<skill>.ts`, one file per skill, and `skills/index.ts` listing all 20.
- Skill code that runs on its own: `src/game/skills/<hero>/<skill>.ts` implementing `SkillBehavior`, registered in `src/game/skills/<hero>/index.ts`.
- Kit code reads a skill through `skillLevel(id)`, `skillEvolved(id)` and `skillValues(id)` (the level's or the evolution's row) from `src/game/skills/query.ts`.
- Events a skill can listen to (`src/game/skills/events.ts`): blow landed, ability cast, dash, warp, jump, perfect dodge, parry, kill, hurt, ultimate. The shared loop emits the common ones; a kit emits its own (parry, grab) through the same function.
- Runtime memory per skill per hero lives in `progress.build.memory[id]`, so co-op seats keep their own. Large or binary state is host-only.
- Icons: every skill and every evolution has a code-drawn icon under `src/ui/skills/icons/<hero>/`.
- Dev start builds: `?build=<skill id>:8,evolve:<skill id>,might:5`.
