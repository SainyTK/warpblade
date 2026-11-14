# Ysra design

Ysra shares Kael's rig and the moveset every hero plays on (`docs/moveset-design.md`): J tapped and held, K guard, L dodge, I abilities, O switch, U ultimate.
Kael is a fast duelist: a sword string, juggles, element spells paid with MP.
Ysra is a heavy reach fighter: long pokes that pierce a whole line, a glaive hurled like a javelin, a firm guard whose parry opens a counter thrust and a backstep out of it, and Heat that her blows build and her fire rites spend.
Every rule below is meant to make her play differently from Kael from the first second of a run.

## Controls

| Key | Ysra |
| --- | --- |
| A / D | Walk, a steady stride with no run. With Warpath, walking on breaks into a charge (the run key charges at once) |
| W | One heavy jump, lower than Kael's. No double jump ever |
| J | Glaive string of three blows that pierce every foe in the line, the same every time: hip thrust, reverse sweep, impale |
| J right after a parry | Counter Thrust: a piercing thrust along the line, also straight out of the guard |
| J in the air | One wide air sweep (two with Firewalk), then nothing until she lands |
| Hold J | The warp: she hurls the glaive like a javelin at the nearest foe ahead, warps to its haft and wrenches it free in a burst of embers. The arrival builds 8 Heat |
| K | The guard: a firm block (10% through, 9 stamina a blow), a parry on a fresh press just as a blow lands. A side held away while she guards is a short backstep |
| L | The front dodge every hero shares |
| I | The selected ability: her rites, paid with Heat. An unpaid one passes I to the next ready one |
| Hold I | A wider Flare; a Cinder Lash both ways; more, weaker Flame Pillars on both sides |
| O | Switch ability: Flare and Cinder Lash from the start, more rites with skills |
| U | Pyre Wave, her one ultimate (shared charge and MP rules), upgraded by the Pyre Wave skill |

## Heat

Heat is Ysra's second bar, 0 to 100, shown where Kael's MP-only setup leaves room.
Glaive blows that land build Heat: about 6 per foe hit by a string blow, 12 per foe hit by a counter or a warp's rail.
A warp's arrival builds 8, a parry 12.
Heat drains 8 per second after 2.5 seconds without landing a blow.
Rites spend Heat, never MP.
MP pays for her warp and her ultimate.

## Starting kit

She starts with the whole base kit in `docs/skills/ysra.md`: the three-blow glaive string, the hurled glaive, the air sweep, the guard, the parry and its counter thrust, the backstep, and two rites, Flare and Cinder Lash.
No blow needs a direction held, and no blow depends on where the foes stand: the string is the hip thrust, the reverse sweep and the impale, and J never turns her round.
The reverse sweep rises from low behind her to over her head, so the fixed string reaches the day's moths, which hover 40 to 53 px up.
Windmill and Skyhook change the middle blow while they are held.
Her 20 skills change and extend these.

## Numbers to start from

- Jump rise about 46 px (Kael 61). Walk speed through her 1.1 move stat: 74.8 px/s (Kael walks 68 and runs 125).
- Glaive string blows reach about 40 px ahead, hit every foe in the box, and plant her feet. Wind-ups are longer than Kael's and the hits heavier.
- String rhythm, in real seconds on screen with J pressed in time: 0.70 from the hip thrust to the reverse sweep, 0.74 from the sweep to the impale, and 0.98 from the impale to the next string's hip thrust.
- Each blow winds up the other way and holds the coil for at least 3 animation frames, snaps out past the mark, holds through the hit-stop, carries onto the front foot and settles home.
- Hit feel grows through the string: hit-stop 0.09, 0.12 and 0.2 s, shake 1.8, 2.6 and 3.8 px, hit pitch 0.9, 0.72 and 0.55 (`GLAIVE_FEEL` in `src/constants/ysra/glaive.ts`).
- The hip thrust and the middle blow stagger a minion 0.65 s, past the next blow; the impale knocks it down 0.8 s, past the next string's first blow (`GLAIVE_STRING`).
- Every change of clip crosses from the pose shown last over a few frames (`src/game/hero/ysra/handover.ts`, `HANDOVER_FRAMES` in `src/constants/ysra/motion.ts`): a blow's wind-up starts where the last blow left her, idle takes 5 frames to settle her back into guard, a turn swings her limbs through over 2 frames, and a hurt cuts at once.
- Her jump from a stand or a stride sinks on the floor for 2 frames into the squat her jump clip starts from (the shared take-off load), then pushes onto her toes; out of a blow's follow-through she leaves at once, and a landing dips her hips by the fall speed (1.5 to 4.5 px over 8 frames, `LANDING_DIP`).
- Warp: the shared warp's numbers (`WARP`, 10 MP, 2 s recharge); her arrival is the wrench (`JAVELIN` in `src/constants/ysra/javelin.ts`), a blow ahead and a little behind at the shared power, then 8 Heat.
- Guard: the shared guard (`HERO_GUARD`) with her own block, 10% of the blow through and 9 stamina (Counter Thrust and Haft Ward cut that). A parry gives 12 Heat, and for 0.8 s J is the counter thrust (3.75 AD down the line).
- Backstep: 36 px back in the hop (about 53 px with the skid), low hop, 20 stamina, untouchable for 0.15 s.
- Flare 30 Heat, Cinder Lash 25 (3 times ability power along 70 px ahead, dragging the nearest foe 30 px in). Flare also heals 5% of her max HP, her one heal without a skill.

## Mobility and survival pass (feedback #9)

Players found her too slow and short of ways to survive next to Kael.
The pass kept her without a run, a dash or a double jump, and leaned on her walk, vault, backstep, parry and Heat.
The shared moveset of 13 November 2026 gave her the front dodge and the warp on top.
The vault was removed on 14 November 2026: it blocked her other skills with its long recharge and long travel (`docs/skills/ysra.md`, "The vault removed"); the vault figures below are kept as the record of that pass.
Measured in the real game with real key presses, foes cleared, at 120 Hz steps sampled every 16 ms:

| Measure | Ysra before | Ysra after | Kael |
| --- | --- | --- | --- |
| Walk speed | 62.7 px/s | 74.2 px/s | 67.4 walk, 124.0 run |
| Cross the stage (x 10 to 300) | 4.62 s | 3.92 s | 2.48 s running |
| Escape in 1 s (best of her kit) | 108.5 px | 104.9 px | 167.6 to 187.6 px |
| Escape in 2 s | 164.1 px | 176.0 px | 235.1 to 242.0 px |
| Untouchable in one vault | 0.416 s | 0.512 s | dash 0.240 s |
| Untouchable in one backstep | 0.128 s | 0.144 s | |

A longer vault (86 px) was tried and dropped: the skilled bot vaults toward foes, overshot them and fell earlier.
Her escape covers less ground than Kael's dash and run, and she is untouchable for longer while she does it.

## Skills

Her 20 skills, their levels, evolutions and balance are in `docs/skills/ysra.md`; their data is in `src/constants/characters/ysra/skills/`.

## Code layout

- `src/types/kit.ts`: the HeroKit interface. The shared loop calls `kit()` from `src/game/hero/kits.ts`.
- `src/game/hero/ysra/kit.ts`: Ysra's kit, composed of four parts and her ability list. Each part owns its files:
  - Glaive (`ysra/glaive/`, `types/ysra/glaive.ts`, `constants/clips/ysra/glaive.ts`): the string, the counter, hook, windmill and the air reaps with Sunreap.
  - Javelin (`ysra/javelin/`, `constants/ysra/javelin.ts`): the warp style (the thrown glaive, the wrench, Ember Javelin's rail).
  - Stance (`ysra/stance/`, `types/ysra/stance.ts`, `constants/clips/ysra/stance.ts`): jump, the guard style, backstep, Warpath, and her free-state look (idle, walk, run, jump, fall, hurt) and her clips for the shared guard, throw, warp strike and dodge.
  - Pyre (`ysra/pyre/`, `constants/clips/ysra/pyre.ts`): Heat and rites.
- `ysra/abilities.ts`: her abilities on I as `AbilitySlot`s, the rites with their Heat cost.
- Kit-level helpers every part may use: `buffs.ts` (Riposte, crits, glow, the full-bar bonus, Overheat's reach, Sunflock's guard) and `pin.ts`.
- `src/game/hero/ysra/events.ts`: parts talk through events (`strike`, `block`, `parry`, `warp`) so no part imports another, except `counterReady` and `spendCounter` from the stance part.
- Skills read their level through `skillValues`; skill code that acts on its own (summons, Scorch, Brand, Smoulder, Firewalk's cut, Haft Ward, the death burst, Fire Wheel) is in `src/game/skills/ysra/`, and her kit emits `spin` and `altar` as skill events (`src/types/ysra/index.ts`); the shared guard emits `block` and `parry`.
- Pyre Wave in `src/game/ultimates/pyreWave.ts` and `pyreEruptions.ts`, icons in `src/ui/skills/icons/ysra/`.
