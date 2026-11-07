# Ysra design

Ysra shares Kael's rig and nothing else.
Kael is a fast duelist: a warp throw, a dash nothing can touch, crystal hangs, juggles, three element spells paid with MP.
Ysra is a heavy reach fighter: long pokes that pierce a whole line, held lunges, a pole vault and a dive for travel, a brace that blocks and parries, and Heat that her blows build and her fire rites spend.
Every rule below is meant to make her play differently from Kael from the first second of a run.

## Controls

| Key | Kael | Ysra |
| --- | --- | --- |
| A / D | Walk, double tap to run | Walk, a steady stride with no run. With Warpath, walking on breaks into a charge (the run key charges at once) |
| W | Jump, double jump with a pick | One heavy jump, lower than Kael's. No double jump ever |
| J | Sword string picked by the situation | Glaive string of three blows that pierce every foe in the line; the middle blow is picked by the foes around her |
| Hold J | Nothing | Heft: wind a lunge while standing still, release to lunge forward through the line |
| J in the air | Air string | One wide air sweep (two with Vault Strike), then nothing until she lands |
| J in a vault | | The vault crash, glaive driven down where she lands |
| K | Warp throw (pick, MP) | Pole vault on the floor: plants the glaive and arcs over foes, also straight out of a brace or a backstep. In the air: dive, glaive first, down at an angle |
| L | Dash, untouchable, stamina | Hold to brace: blocks blows from the front, each block costs stamina. A press just before a blow is a parry. L with a side held away is a short backstep |
| I | Cast the selected element (MP) | Call the selected rite, paid with Heat |
| O | Switch element | Switch rite: Flare and Cinder Lash from the start, more with skills |
| U | Ultimate | Ultimate (shared charge and MP rules) |

## Heat

Heat is Ysra's second bar, 0 to 100, shown where Kael's MP-only setup leaves room.
Glaive blows that land build Heat: about 6 per foe hit by a string blow, 12 per foe hit by a full lunge, vault strike or dive impact.
Heat drains 8 per second after 2.5 seconds without landing a blow.
Rites spend Heat, never MP.
MP only pays for her ultimate.

## Starting kit

She starts with the whole base kit in `docs/skills/ysra.md`: the three-blow glaive string, the heft lunge, the air sweep, the vault and its crash, the dive, the brace, the parry, the backstep, and two rites, Flare and Cinder Lash.
No blow needs a direction held: the string picks the twirl, the haft ram, the sky thrust, the overhead cleave or the ground lash from the foes around her.
Her 20 skills change and extend these.

## Numbers to start from

- Jump rise about 46 px (Kael 61). Walk speed through her 1.1 move stat: 74.8 px/s (Kael walks 68 and runs 125).
- Glaive string blows reach about 40 px ahead, hit every foe in the box, and plant her feet. Wind-ups are longer than Kael's and the hits heavier.
- Heft: 0.6 s to a full wind; release under 0.2 s is a quick poke; a full lunge travels about 60 px, pierces all, and is untouchable for its first 0.15 s.
- Vault: about 70 px forward, peak about 40 px, untouchable from the plant until 0.1 s past the peak. 0.95 s recharge shown in the HUD tab where Kael's warp recharge sits, just longer than a vault takes, so vaults chain.
- The vault starts out of a brace (K while L is held) and out of a backstep (K in the hop vaults on landing, K in the skid vaults at once), toward a held side. Backstep then K with the side away held is her escape: a hop back, a turn and a vault away.
- Every vault crosses from the pose shown last into the plant over two frames, before the stab.
- Dive: once per airtime, about 45 degrees down, impact burst around the landing point.
- Brace: blocks blows from the front for 12 stamina each (Counter Thrust cuts that). A blow in the first 0.12 s of a press is a parry: no cost, 25 stamina back, the attacker staggered 1 s, a short slow motion, and with Counter Thrust the next J is the counter.
- Backstep: 36 px back in the hop (about 53 px with the skid), low hop, 20 stamina, untouchable for 0.15 s.
- Flare 30 Heat, Cinder Lash 25 (3 times ability power along 70 px ahead, dragging the nearest foe 30 px in). Flare also heals 5% of her max HP, her one heal without a skill.

## Mobility and survival pass (feedback #9)

Players found her too slow and short of ways to survive next to Kael.
The pass keeps her without a run, a dash or a double jump, and leans on her walk, vault, backstep, parry and Heat.
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
- `src/game/hero/ysra/kit.ts`: Ysra's kit, composed of three parts. Each part owns its files:
  - Glaive (`ysra/glaive/`, `types/ysra/glaive.ts`, `constants/clips/ysra/glaive.ts`): the string, heft, lunge, counter, hook and windmill.
  - Stance (`ysra/stance/`, `types/ysra/stance.ts`, `constants/clips/ysra/stance.ts`): jump, vault, dive, brace, parry, backstep, Warpath, and her free-state look (idle, walk, run, jump, fall, hurt).
  - Pyre (`ysra/pyre/`, `constants/clips/ysra/pyre.ts`): Heat, rites, and Ashen Wake's fire.
- Kit-level helpers every part may use: `buffs.ts` (Riposte, crits, glow, the full-bar bonus, Overheat's reach, Sunflock's guard) and `pin.ts`.
- `src/game/hero/ysra/events.ts`: parts talk through events (`strike`, `block`, `parry`, `lungeEnd`, `land`, `travel`) so no part imports another, except `counterReady` and `spendCounter` from the stance part.
- Skills read their level through `skillValues`; skill code that acts on its own (summons, Scorch, Brand, the death burst, Fire Wheel) is in `src/game/skills/ysra/`, and her kit emits `block`, `spin`, `altar` and `land` as skill events (`src/types/ysra/index.ts`).
- Ultimates in `src/game/ultimates/`, icons in `src/ui/skills/icons/ysra/`.
