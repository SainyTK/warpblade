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

- `CharacterDef.comboHits` fixes the length of the ground string for the whole run: Kael 4, Ysra 3, Sable, Hulda, Orrin, Mirel, Wenna and Tallis chosen by their designers (2 to 4).
- Attack skills change the string's damage, speed and on-hit effects, never its length.
- The air string limit is fixed per hero or raised by one movement skill; the hero designer chooses.

## Base kit and buttons

- J attack, L dash, K warp or the hero's K action, I ability, O switch ability, U ultimate, Up jump: the controls stay as they are.
- With no skill, every button the hero uses does something. The hero designer chooses the base kit and writes it in `docs/skills/<hero>.md`.
- A skill either attaches to one of those buttons (`button` in its data) or runs on its own (`auto`). No skill adds a new key combination.
- Several skills on J, K, L or jump stack: each adds its effect to the same press.
- Ability skills on I join the kit's ability rotation, the way Kael's elements work today: the hero's base abilities plus the spell skills held, up to about five entries.
  The rotation is per kit (`createRotation` in `src/game/skills/rotation.ts`): the kit decides which button turns it (O for most; Sable reloads on O and turns hers her own way) and what an ability costs (MP, Heat or nothing).
- The special ultimate is in the base kit. Ultimate skills upgrade or replace it. A build holds at most one ultimate skill; once one is owned the others are no longer dealt.

## The 20 skills

Each hero has exactly 20 skills, at least this many of each kind:

| Kind | Least | What it is |
| --- | --- | --- |
| `attack` | 4 | Changes the hero's own attack presses (J, and K or O when the kit attacks with them): damage, speed, on-hit effects, a situational move. |
| `movement` | 3 | Changes dash, warp, jump or the hero's travel moves; hits on the move. |
| `spell` | 3 | An ability on I (or the hero's ability button), paid with MP, the kit's own resource, or nothing. |
| `dot` | 3 | Damage over time: burns, bleeds, poisons, curses. Weak early, a real attack once levelled and evolved. |
| `summon` | 3 | A chance on a trigger (blow landed, ability cast, perfect dodge, parry, kill) to call a supporter that strikes on its own. |
| `passive` | 0 | A lasting change: stats, Flow, sustain. |
| `ultimate` | 1 | Upgrades or replaces the U special. At most 3 per hero. |

The rest are the designer's choice.

### Levels

- Level 1 to level 8 must feel almost completely different.
  At least four of a skill's seven level ups add a new property (another projectile, pierce, a status, a new shape, a second trigger, a follow-up hit); the others are large number steps.
- The card says what the next level changes in one short line.
- Level 8 is about 6 to 12 times level 1 on its intended target; `dot` and `summon` skills may go up to 25 times.
- Ultimates are budgeted per cast against the base special, not per second: level 8 about 6 times the special, evolved about 15 times.
- A skill's `values` may name the stat it scales with (attack damage or ability power), for example `power` as a multiple of `progress.stats.ad` or `spellPower` of `progress.stats.ap`.

### Risk and reward

Every skill has a `risk`:

- `easy`: wide area, automatic or forgiving. Lowest damage.
- `timed`: needs positioning or timing within ordinary play (a dash through foes, a cast into a crowd, the combo's last hit).
- `precise`: needs a parry, a perfect dodge, a Keen press, a back attack or a hard read. Highest damage, and special buffs when pulled off.

Damage budget at level 8, on its intended target, measured per second of ordinary play: `timed` about 1.6 times `easy`, `precise` about 2.5 to 3 times `easy`.
Damage buffs a `precise` skill grants when pulled off count toward its budget.
`movement` skills may sit at about 0.8 of their risk band's budget.
Evolutions keep the trade: an `easy` evolution grows area and reliability, a `precise` evolution grows damage a lot or adds a strong buff when pulled off.

### Precise payoff

A `precise` skill hits very hard on the foe the hard move was aimed at, and only on that foe.
Its payoff is the damage the skill adds to one pull-off: Keen Edge's bonus, crystal wave and Peerless Edge's cross cut on a Keen move, Counter Thrust's power on the counter, Perfect Rhythm's prime on a perfect reload's bolts, Iron Counter's catch, Skyfall Breaker's slam and pounds on the caught foe, and the dives of the hawks a parry calls (Sun Hawk), which fly off once their foe falls.

- The payoff lands on at most `PRECISE_TARGETS` foes per pull-off (1, in `src/constants/growth.ts`): the first the move, wave or bolt reaches, nearest to the hero first.
- Every other foe the same blow, wave or bolt reaches takes it as the plain move would: the rest of a counter's line takes the plain counter thrust, a foe a primed bolt passes through takes the plain prime, and a Keen wave passes it by.
- A move's blows and what they send out share one payoff, so a Keen move and its wave pay off on the same foe; Perfect Rhythm's volley flies at the nearest foe for the same reason.
- An area the card names as the skill's own (a burst, a ring, a spread) has its own, smaller number and counts toward the crowd cap; buffs a pull-off grants (Fury, Riposte, crits) count toward the budget as before.

The result in the measuring room (`docs/skills/balance.md`): one foe in the precise band, a crowd at most about 300 a second at level 8 and about 900 evolved.

Code: `payoffLands(payoff, foe)` in `src/game/skills/payoff.ts` says whether a pull-off's payoff lands on a foe and keeps the foe it lands on.
A combo move's payoff is `movePayoff()`, fresh with each move; a precise blow sets `plain` on its `MoveHit` (or its `GlaiveTune`) to the power every foe past the payoff takes, and `meleeHit` strikes foes nearest first.
A projectile or a summon carries its own payoff (`Shot.payoff`, the last argument of `createCrystalWave`, each of Sun Hawk's hawks).

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
- Once all 8 slots are full, new skills are no longer dealt; the card pool is the owned skills and charms, and Second Wind fills any card the pool cannot.
- Reroll, skip and banish work as before.
- Tuned (`CARD_WEIGHT` in `src/constants/growth.ts`): a new skill 100, the next level of a held skill 6, a charm its own weight (50 to 90); starting tools unchanged at 2 rerolls, 2 skips, 1 banish. Method and results: `docs/growth-design.md`, "Skill cards and evolutions".

## Chests

- From wave 8 a chest evolves one ready skill if there is one.
- Otherwise it gives 1 upgrade (3 or 5 with luck): each a random owned skill or charm below its maximum. With nothing to raise it heals fully.

## Damage sources and Flow

- Hits of the hero's own presses (J, K, L, I, U, jump), and the skill effects those presses carry, count for `attacks`, `abilities` or `ultimate` and build Flow.
- A skill that deals its own hits (a summon, a projectile it launches on its own, damage over time, an aura) uses its skill id as the source and does not build Flow.
- A hero whose base kit fights through summons (Wenna's Wicks) counts their hits for `abilities` and passes `noFlow` to `dealDamage`, so a crowd of summons cannot fill Flow.
- The end of run screen lists each skill source by its name, with its level or Evolved.

## Code

- `src/types/skill.ts`: `SkillDef`, `SkillLevel`, `SkillEvolution`, `SkillKind`, `SkillRisk`, `SkillButton`.
- `src/types/skillBehavior.ts`: `SkillBehavior`, `SkillEvents`, `SkillMemory`, `SkillState`.
- `CharacterDef.skills` (20) replaces `branches` and `startRanks`; `CharacterDef.comboHits` is new.
- Skill data: `src/constants/characters/<hero>/skills/<skill>.ts`, one file per skill, and `skills/index.ts` listing all 20.
- Skill code that runs on its own or answers events: `src/game/skills/<hero>/<skill>.ts` implementing `SkillBehavior`, registered in `src/game/skills/<hero>/index.ts`.
- Kit code reads a skill through `skillLevel(id)`, `skillEvolved(id)` and `skillValues(id)` (the level's or the evolution's row) from `src/game/skills/query.ts`.
- Events (`src/game/skills/events.ts`): blow landed, ability cast, dash, warp, jump, perfect dodge, parry, kill, hurt, ultimate. The shared loop emits the common ones; a kit emits its parry and its own events through the same function.
- Runtime memory per skill per hero is kept by the skill runtime (`src/game/skills/runtime.ts`), one copy per co-op seat, host-only.
  Changed from the first draft, which put it in `progress.build.memory`: `progress` is sent to each guest fifteen times a second, and skill memory holds foes and projectiles.
  State a guest's HUD must show (stacks, a charge) belongs in the kit's own seat memory (`rememberPerSeat(objectMemory(...))`).
- Icons: every skill and every evolution has a code-drawn icon under `src/ui/skills/icons/<hero>/`; the evolution's is `<id>_evo`.
- Dev start builds: `?wave=8&build=<skill id>:8,evolve:<skill id>,might:5`.

Until the hero designs land, each hero's old tree nodes are temporary skills (`src/constants/characters/legacySkills.ts`): eight rows that repeat the old ranks (`values.rank`), the old perk on `perk`, a placeholder partner, and Kael's and Ysra's old evolutions folded in.
The hero designers replace these lists wholesale and delete `legacySkills.ts` with the last of them.

## How to add a skill

Crystal Familiar (`k_familiar`, in Kael's temporary list) is the reference summon: data in `src/constants/characters/kael/skills/crystalFamiliar.ts`, code in `src/game/skills/kael/crystalFamiliar.ts`, icons in `src/ui/skills/icons/kael/index.ts`.

### Data

Write a `SkillDef` in `src/constants/characters/<hero>/skills/<skill>.ts` and list it in that hero's `skills/index.ts`, which `CharacterDef.skills` reads.
`id` is unique across every hero (prefix it with the hero's letter), since recipes and damage sources are kept by id.
`levels` has eight rows; each row is the skill's whole state at that level, not an addition to the row before.
A row's `text` is the card line for reaching that level; `stats` and `scale` are stats the hero has while at that level; `values` are the numbers the skill's code reads.
`evolution.row` replaces the level 8 row once evolved, and `evolution.partner` is another skill of the same hero.
Kit perks: a skill whose effect lives in kit code can keep using `perk` and `hasPerk` until the kit reads `skillLevel` and `skillValues` directly; prefer the query.

### Reading a skill in kit code

```ts
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../skills/query";

const v = skillValues("k_sweep"); // {} when not held
if (skillLevel("k_sweep")) radius = withCharms("area", v.radius);
```

`withCharms(stat, value)` applies the charms to a skill's own number: `amount` adds Multitude, `area`, `duration`, `speed` and `cooldown` multiply by Reach, Persistence, Swiftness and Haste.
Might and Flow apply to every hit in `dealDamage`; do not multiply by them yourself.

### Code that runs on its own

```ts
export const crystalFamiliar: SkillBehavior = {
  create: () => ({ cd: 0, shards: [] }),
  update(memory, { level, evolved }, dt) { /* every step while the hero stands */ },
  draw(memory, state) { /* in front of the hero */ },
  drawBack(memory, state) { /* behind the hero and foes */ },
  on: { blow(memory, event, state) { /* event.foe, event.damage, event.move, event.finisher, ... */ } },
};
```

Register it in `src/game/skills/<hero>/index.ts` under its skill id.
The runtime calls it once per hero who holds the skill, with that hero swapped in (`hero`, `progress`, `character` are theirs), and makes its memory with `create()` the first time.
Memory starts fresh each run.
Call `place()` before drawing in world space, as other effects do.
Targeting helpers: `nearestFoe`, `foesOnScreen`, `distance2` and `touches` in `src/game/skills/targets.ts`.

### Events

| Event | Payload | Emitted by |
| --- | --- | --- |
| `blow` | `foe`, `damage`, `source` (`attacks`, `abilities`, `ultimate`), `move` (the combo move or null), `finisher`, `melee`, `back`, `crit`, `airborne`, `keen` | `dealDamage`, for every hit of the hero's own that is not damage over time |
| `cast` | `ability` (the kit's id: Kael's element, Ysra's rite, `snare`, `bellow`, `whirlwall`, `anchorPin`, `stoppedClock`, `secondHand`) | Kael's `startCast`, Ysra's rite release, Sable's snare, Hulda's bellow, Orrin's abilities |
| `dash` | `dir`, `foes` passed through | Kael's dash when it ends |
| `warp` | `x`, `y`, `foe` it was aimed at or null | Kael's warp and blink arrival |
| `jump` | `air` | Kael's jump and double jump |
| `perfectDodge` | `at` (the hero's x) | `rewardPerfectDodge` |
| `parry` | `fromX` | Ysra's brace parry |
| `grab` | `foe` | Hulda's grab (declared in `src/types/hulda.ts`) |
| `latch`, `release`, `tip`, `swingKick` | `kind` and `foe`; `speed` and `fling`; `foe` and `blow`; `foe` and `speed` | Orrin's hook, letting go of a swing, a chain hit at the tip and a swing kick (declared in `src/types/orrin.ts`) |
| `echo`, `field`, `rewind`, `toll`, `restart` | `foe` and `blow`; `open`, `foes`, `x`, `y` and `radius`; `healed`, `from` and `to`; `foes`; `foe` | Mirel's echo striking a foe, her Stillfield opening or closing, a Rewind ending and a Toll landing, and the shared stop status when a foe she stopped restarts (declared in `src/types/mirel.ts`) |
| `wick`, `swap`, `quarry`, `kindle`, `bite` | `x`, `y`, `lit`, `cause` and `wick`; `from`, `to` and `wick`; `foe`; `x`, `y` and `foes`; `foe`, `wick` and `damage` | Wenna's Wick lit or ended, a Swap arriving, a foe becoming her Quarry, a Wick bursting under Kindle and a Wick's bite (declared in `src/types/wenna.ts`) |
| `veil`, `sink`, `ambush`, `backstab` | `on` and `cause`; `from` and `to`; `foe`; `foe` and `kill` | Tallis's Veil coming on or ending, a Sink ending in a rise, an Ambush landing and one of his blows from behind landing (declared in `src/types/tallis.ts`) |
| `kill` | `foe`, `source` | `killEnemy`, when the killing hit has a source |
| `hurt` | `damage`, `fromX` | `hurtHero`, when HP is lost |
| `ultimate` | `level` | the shared ultimate release |

Emit with `emitSkillEvent({ type: "dash", dir, foes })` from `src/game/skills/events.ts`.
A kit adds its own events without editing the shared file, by augmenting `SkillEvents` from its own types file, as Hulda's grab does:

```ts
declare module "./skillBehavior" {
  interface SkillEvents {
    throw: { foe: Enemy; into: Enemy | null };
  }
}
```

A kit whose evade meets a blow at the right moment calls `rewardPerfectDodge()` (`src/game/hero/perfectDodge.ts`): it gives the feat, the Flow stacks, the slow motion, MP and stamina, the PERFECT cue and the `perfectDodge` event.
Each kit that has its own dash, warp-like travel, jump or ability emits the matching event itself; only Kael's and the shared ones are wired now.

### Dealing damage

```ts
dealDamage(foe, progress.stats.ad * v.power, { source: "k_familiar", fromX: x, kx: 50 });
```

A hit the skill deals on its own passes its skill id as `source`: it counts on the end of run screen under the skill's name and level, kills count toward skill-kill goals, its number is drawn quiet, and it builds no Flow.
A skill effect carried by the hero's own press (a bigger J blow, a burst on the dash) keeps the press's source (`attacks`, `abilities`, `ultimate`, or no source for `attacks`) and builds Flow.

### Statuses every hero can use

`src/game/enemies/skillStatus.ts`:

- `addStacks(foe, skillId, { stacks, max, damage, every, duration })`: stacking damage over time (poison, bleed, burn, lodged bolts). Each tick deals `damage x stacks` with the skill id as source; a new stack refreshes the duration.
- `stacksOf(foe, skillId)` and `consumeStacks(foe, skillId)` (returns the count and clears them) for detonations and consuming strikes.
- `markFoe(foe, source, seconds, bonus)`: the foe takes `bonus` more damage from every source while marked (0.2 is +20%). Marks of different sources add, together with the kit's own damage-taken bonuses, capped at +100% (`DAMAGE.takenCap`); a source's new mark refreshes its own.
- The older statuses stay: `ignite` (`src/game/enemies/burn.ts`), `chill`, `frozen`, `shock`, `stun`.
- `stopFoe(foe, seconds, share)` (`src/game/enemies/timeStop.ts`): the foe stops dead in time and stores the damage it takes; when it restarts, `share` of what it stored lands again as one hit. `takeStored(foe)` takes the stored damage out for a skill that tolls it itself.
- Time fields (`src/game/timeFields.ts`): `raiseField` holds an area open where foes act at their rank's pace and foe shots fly at their own; `fieldPace(x, y, rank?)` reads it.
- Foe awareness (`src/game/enemies/awareness.ts`): a kit's `hidden()` hook hides its hero, and a foe's `blind` seconds blind it. `foeSees(e)` is false for a blind foe and for a minion while the hero is hidden; such a foe keeps its facing, starts no wind-up at the hero and walks on past them. Mini bosses turn twice as slowly toward a hidden hero, and the Rift Warden ignores the rule.

### Per-seat memory rules

- The runtime's skill memory is host-only and per seat: safe for foes, projectiles and summons.
- Kit state a guest's HUD or touch buttons read (stacks, a charge, a selected ability) goes in the kit's seat memory: a plain object registered with `rememberPerSeat(objectMemory(obj))`, or `objectMemory(obj, true)` when the guest never reads it.
- Never keep per-hero state in a module variable without registering it; a co-op room would share it between heroes.

### Icons

Add `<id>` and `<id>_evo` drawers to `src/ui/skills/icons/<hero>/index.ts` and spread that record into `ICONS` in `src/ui/skills/icons/iconImage.ts`.
`skillIcon(id, evolved)` picks the evolved art when it is drawn.

### Checking

`npm run dev`, then `?wave=8&level=30&build=<id>:8,<partner>:4` opens a run at wave 8 with the skill ready: the first chest evolves it.
`?build=evolve:<id>` starts with it evolved.
