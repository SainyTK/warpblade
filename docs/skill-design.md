# Skill design

The skill rework asked for on 7 November 2026 (task T-mac-213, second round), after the owner played the growth loop.
Owner feedback: the relic system leans too hard on Vampire Survivors, long combos do not work in a game full of knock-ups, and the extended combo inputs (dash after the fourth hit, Up or Down after a combo) are rarely used.
Relics go away completely.
Their idea of growth (levels 1 to 8, then an evolution with a partner) moves to each hero's own skills.

This file is the contract between the framework and each hero's build.
Each hero's full skill list and numbers live in `docs/skills/<id>.md`; Kael's is `docs/skills/kael.md`.
Where a hero's skill files live and how they are registered is in `docs/hero-module.md`.
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

- `CharacterDef.comboHits` fixes the length of the ground string for the whole run: 4 for Kael, and 2 to 4 for each other hero as its designer chooses.
- Attack skills change the string's damage, speed and on-hit effects, never its length.
- The air string limit is fixed per hero or raised by one movement skill; the hero designer chooses.

## Base kit and buttons

- Every hero plays on the same layout (`docs/moveset-design.md`): J tapped for the string, J held for the warp move, K guard and parry, L front dodge, I ability (held, its wide form), O switch ability, U ultimate, Up jump.
- With no skill, every button the hero uses does something. The hero designer chooses the base kit and writes it in `docs/skills/<id>.md`.
- A skill either attaches to one of those buttons (`button` in its data) or runs on its own (`auto`). No skill adds a new key combination.
- Several skills on J, K, L or jump stack: each adds its effect to the same press.
- Ability skills on I join the kit's ability list (`HeroKit.abilities`): the hero's base abilities plus the spell skills held, up to about five entries.
  The shared ability bar (`src/game/hero/abilityBar.ts`) casts them: each has its own recharge, I on a recharging one casts the next ready one, O switches by hand, and the kit decides what each costs (MP, the kit's own resource or nothing).
- The special ultimate is in the base kit and stays on U all run. The hero's one ultimate skill upgrades it.

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
| `ultimate` | 1 | Upgrades the U special. Exactly 1 per hero. |

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
Its payoff is the damage the skill adds to one pull-off: for Kael's Keen Edge, the Keen bonus, the crystal wave and Peerless Edge's cross cut on a Keen move.

- The payoff lands on at most `PRECISE_TARGETS` foes per pull-off (1, in `src/constants/growth.ts`): the first the move, wave or bolt reaches, nearest to the hero first.
- Every other foe the same blow, wave or bolt reaches takes it as the plain move would, and a Keen wave passes it by.
- A move's blows and what they send out share one payoff, so a Keen move and its wave pay off on the same foe.
- An area the card names as the skill's own (a burst, a ring, a spread) has its own, smaller number and counts toward the crowd cap; buffs a pull-off grants (Riposte, crits) count toward the budget as before.

The result in the measuring room (`docs/skills/balance.md`): one foe in the precise band, a crowd at most about 300 a second at level 8 and about 900 evolved.

Code: `payoffLands(payoff, foe)` in `src/game/skills/payoff.ts` says whether a pull-off's payoff lands on a foe and keeps the foe it lands on.
A combo move's payoff is `movePayoff()`, fresh with each move; a precise blow sets `plain` on its `MoveHit` to the power every foe past the payoff takes, and `meleeHit` strikes foes nearest first.
A projectile or a summon carries its own payoff, made with `createPayoff()` or handed on from the move (the last argument of Kael's `createCrystalWave`).

### Damage over time

`dot` skills pay off late on purpose: at levels 1 to 4 they deal less than an `attack` skill of the same level, at 7 and 8 more, and their evolution turns the stacks into an attack (a detonation, a spread, a consuming strike).
Taking one early costs the player early power for a much stronger late game.

### Summons

A summon has a trigger and a chance; levels raise the chance, the supporter's damage, duration, count or give it a new move.
A summon never fires more than its own internal cooldown allows, so attack speed does not break it.

## Drill baseline

Every hero on the shared drill engine (`src/drill`, `docs/hero-module.md`, "The drill engine") keeps exactly 20 skills, and each skill upgrades one drill mechanic.
Kael's set (`docs/skills/kael.md`, "Drill set") is the worked example every other hero copies.

### Skills per mechanic

| Mechanic | Skills | Kind | Kael |
| --- | --- | --- | --- |
| Slash chain (J) | 4 | `attack` | one per slash of the chain (first, second, third) and one for the air slash |
| Guard and parry (K) | 1 | `attack` | Crystal Aegis |
| Warp strike and dash (L or Shift) | 4 | `movement` | Warpcraft, Blink Step, Passing Cut, Spellwarp |
| Jump, wall kick and air (Space) | 1 | `movement` | Sky Dance |
| Prepared spells and infusion (I) | 3 | `spell` | one per spell of the set |
| Damage over time | 3 | `dot` | any trigger: slashes, warp, dash |
| Summons | 3 | `summon` | any trigger: back hits, casts, parries |
| Charged tiers (held J) | 1 | `ultimate` | upgrades all four tiers |

The `kind` least counts of "The 20 skills" above still hold.
The base kit is the drill with no skill: every spell of the set is known from the start, so spell skills upgrade a spell and never unlock one.

### How a skill plugs in

- Numbers the engine owns change through `DrillProfile.modifiers()`: the hero folds every held skill into one `DrillModifiers` (start from `NEUTRAL_MODIFIERS`, so a hero with no skill plays exactly as its profile).
- Effects on top of a hit go through `DrillProfile.hooks`: `swordHit` (a slash, warp strike or infused hit struck a foe), `slashed` (a slash or warp strike was let loose), `spellHit` (a spell blast struck a foe), `dashed` (the foes a dash passed), `released` (a charged tier struck) and `tick`.
- The engine also emits the skill events `slash`, `prepare`, `infuse`, `cast`, `warp`, `dash`, `jump`, `ultimate`, `blow`, `kill` and `hurt`, so a `SkillBehavior` that answers events works under the drill unchanged.
- A skill row keeps the numbers the hero's native kit reads and adds the drill's own under a `drill.` prefix, so the same skill id works in both kits; Kael's `drillLevels` (`src/heroes/kael/constants/skills/drillLevels.ts`) builds such rows.
- The card text describes the drill, the controller every solo Adventure plays; the native kit reads only its own numbers.

### Levels and evolutions

- Level 1 gives the skill's one idea on its mechanic.
- Levels 2, 3, 5 and 7 each add a new property: a status (stagger, chill, freeze, burn, shock), a second trigger, another hit, or more of a count the engine owns (air slashes, air dashes, infusion hits).
- Levels 4, 6 and 8 are number steps; level 8 is about 6 to 10 times level 1 on its intended target.
- An evolution keeps the skill's mechanic and adds one strong new behaviour: a follow-up hit, a wider reach, a timer that makes every press count as the strong one, or a free recharge.
- Partners stay inside the hero and pair a mechanic with a neighbour (a slash skill with another slash or movement skill, a spell with a summon or a damage over time skill).

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
- Tuned (`CARD_WEIGHT` in `src/constants/growth.ts`): a new skill 100, the next level of a held skill 9, a charm its own weight (50 to 90); starting tools unchanged at 2 rerolls, 2 skips, 1 banish. Method and results: `docs/growth-design.md`, "Skill cards and evolutions".

## Chests

- From wave 8 a chest evolves one ready skill if there is one.
- Otherwise it gives 1 upgrade (3 or 5 with luck): each a random owned skill or charm below its maximum. With nothing to raise it heals fully.

## Damage sources and Flow

- Hits of the hero's own presses (J, K, L, I, U, jump), and the skill effects those presses carry, count for `attacks`, `abilities` or `ultimate` and build Flow.
- A skill that deals its own hits (a summon, a projectile it launches on its own, damage over time, an aura) uses its skill id as the source and does not build Flow.
- A hero whose base kit fights through summons counts their hits for `abilities` and passes `noFlow` to `dealDamage`, so a crowd of summons cannot fill Flow.
- The end of run screen lists each skill source by its name, with its level or Evolved.

## Code

- `src/types/skill.ts`: `SkillDef`, `SkillLevel`, `SkillEvolution`, `SkillKind`, `SkillRisk`, `SkillButton`.
- `src/types/skillBehavior.ts`: `SkillBehavior`, `SkillEvents`, `SkillMemory`, `SkillState`.
- `CharacterDef.skills` holds the hero's 20 skills and `CharacterDef.comboHits` the length of the ground string.
- Skill data: `src/heroes/<id>/constants/skills/<skill>.ts`, one file per skill, and `index.ts` in the same folder listing all 20.
- Skill code that runs on its own or answers events: `src/heroes/<id>/game/skills/<skill>.ts` implementing `SkillBehavior`, registered by skill id in the hero's `HeroModule.skills`.
  A skill that reshapes a move lives in the kit.
- Kit code reads a skill through `skillLevel(id)`, `skillEvolved(id)` and `skillValues(id)` (the level's or the evolution's row) from `src/game/skills/query.ts`.
- Events (`src/game/skills/events.ts`): blow landed, ability cast, dash, warp, jump, perfect dodge, parry, block, kill, hurt, ultimate.
  The shared code emits the common ones; a kit emits its casts and its own events through the same function.
- Runtime memory per skill per hero is kept by the skill runtime (`src/game/skills/runtime.ts`), one copy per co-op seat, host-only.
  `progress` is sent to each guest fifteen times a second, and skill memory holds foes and projectiles, so it stays out of `progress.build`.
  State a guest's HUD must show (stacks, a charge) belongs in the kit's own seat memory (`rememberPerSeat(objectMemory(...))`).
- Icons: every skill has a code-drawn icon under `src/heroes/<id>/ui/icons/`, registered by skill id in the hero's `HeroModule.icons`.
  An evolution may have its own as `<id>_evo`; without one it keeps the skill's.
- Dev start builds: `?wave=8&build=<skill id>:8,evolve:<skill id>,might:5`.

## How to add a skill

A hero's files, the rules of its folder and how its module is registered are in `docs/hero-module.md`.
Crystal Familiar (`k_familiar`) is the reference summon: data in `src/heroes/kael/constants/skills/crystalFamiliar.ts`, code in `src/heroes/kael/game/skills/crystalFamiliar.ts`, icons in `src/heroes/kael/ui/icons/`.

### Data

Write a `SkillDef` in `src/heroes/<id>/constants/skills/<skill>.ts` and list it in that folder's `index.ts`, which the hero's `CharacterDef.skills` reads.
`id` is unique across every hero, since recipes and damage sources are kept by id: it starts with the hero's prefix (`k_` for Kael; the others are listed in `docs/hero-module.md`).
`levels` has eight rows, and each row is the skill's whole state at that level.
A row's `text` is the card line for reaching that level; `stats` and `scale` are stats the hero has while at that level; `values` are the numbers the skill's code reads.
`evolution.row` replaces the level 8 row once evolved, and `evolution.partner` is another skill of the same hero.

### Reading a skill in kit code

```ts
import { skillEvolved, skillLevel, skillValues, withCharms } from "../../../game/skills/query";

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

Register it under its skill id in the record the hero's `HeroModule.skills` points to (Kael's is `KAEL_SKILLS` in `src/heroes/kael/game/skills/index.ts`).
There is no shared table to edit.
The runtime calls it once per hero who holds the skill, with that hero swapped in (`hero`, `progress`, `character` are theirs), and makes its memory with `create()` the first time.
Memory starts fresh each run.
Call `place()` before drawing in world space, as other effects do.
Targeting helpers: `nearestFoe`, `foesOnScreen`, `distance2` and `touches` in `src/game/skills/targets.ts`.

### Events

The shared events are declared in `SkillEvents` (`src/types/skillBehavior.ts`):

| Event | Payload | Emitted by |
| --- | --- | --- |
| `blow` | `foe`, `damage`, `source` (`attacks`, `abilities`, `ultimate`), `move` (the combo move or null), `finisher`, `melee`, `back`, `crit`, `airborne`, `keen` | `dealDamage`, for every hit of the hero's own that is not damage over time |
| `cast` | `ability` (the kit's own id for it: Kael's `lance`, `burst` or element) | the kit, when an ability goes off (Kael's cast in `src/heroes/kael/game/spell.ts`) |
| `dash` | `dir`, `foes` passed through | the shared front dodge when it ends |
| `warp` | `x`, `y`, `foe` it was aimed at or null | the shared warp's arrival (`arrive` in `src/game/hero/warp.ts`), which Kael's blink and counter also go through |
| `jump` | `air` | the shared jump and double jump (`src/game/hero/jump.ts`) |
| `perfectDodge` | `at` (the hero's x) | `rewardPerfectDodge` |
| `parry` | `fromX` | the shared guard's parry (`src/game/hero/heroGuard.ts`) |
| `block` | `fromX` | the shared guard's block |
| `kill` | `foe`, `source` | `killEnemy`, when the killing hit has a source |
| `hurt` | `damage`, `fromX` | `hurtHero`, when HP is lost |
| `ultimate` | `level` | the shared ultimate release |

Kael declares no events of his own; his skills answer the shared ones.

Emit with `emitSkillEvent({ type: "dash", dir, foes })` from `src/game/skills/events.ts`.
A kit adds its own events without editing the shared file, by augmenting `SkillEvents` from a file in its own `types/` folder:

```ts
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    drawCut: { foe: Enemy };
  }
}
```

A kit whose evade meets a blow at the right moment calls `rewardPerfectDodge()` (`src/game/hero/perfectDodge.ts`): it gives the feat, the Flow stacks, the slow motion, MP and stamina, the PERFECT cue and the `perfectDodge` event.
A kit that has its own dash, warp-like travel, jump or ability emits the matching event itself.

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
- The older statuses stay: `ignite` (`src/game/enemies/burn.ts`), and the fields `chill`, `frozen`, `shock` and `stun` on `Enemy`.
- `halt` holds a walker's feet, `pinned` holds a foe still on the floor whatever its own step asks for, and `blind` blinds it for a time (fields on `Enemy`, in seconds).
  A blind foe neither turns toward a hero nor starts a wind-up at one (`foeSees(e)` in `src/game/enemies/awareness.ts`).
- Time fields (`src/game/timeFields.ts`): `raiseField` holds an area open where foes act at their rank's pace and foe shots fly at their own, `lowerField` closes it, and `fieldPace(x, y, rank?)` reads it.
- Shot wards (`src/game/shotWards.ts`): `raiseWard` holds a circle open that breaks foe shots, and `lowerWard` closes it.

### Per-seat memory rules

- The runtime's skill memory is host-only and per seat: safe for foes, projectiles and summons.
- Kit state a guest's HUD or touch buttons read (stacks, a charge, a selected ability) goes in the kit's seat memory: a plain object registered with `rememberPerSeat(objectMemory(obj))`, or `objectMemory(obj, true)` when the guest never reads it.
- Never keep per-hero state in a module variable without registering it; a co-op room would share it between heroes.

### Icons

Add `<id>` and, when the evolution has art of its own, `<id>_evo` drawers to the record in `src/heroes/<id>/ui/icons/index.ts`, which the hero's `HeroModule.icons` points to.
An icon is a function `(s: SpriteCanvas) => void` on a 16 by 16 canvas, and `src/ui/skills/icons/parts.ts` has shared shapes.
`skillIcon(id, evolved)` (`src/ui/skills/icons/iconImage.ts`) picks the evolved art when it is drawn.

### Checking

`npm run dev`, then `?wave=8&level=30&build=<id>:8,<partner>:4` opens a run at wave 8 with the skill ready: the first chest evolves it.
`?build=evolve:<id>` starts with it evolved.
