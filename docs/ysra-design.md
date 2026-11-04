# Ysra design

Ysra shares Kael's rig and nothing else.
Kael is a fast duelist: a warp throw, a dash nothing can touch, crystal hangs, juggles, three element spells paid with MP.
Ysra is a heavy reach fighter: long pokes that pierce a whole line, held lunges, a pole vault and a dive for travel, a brace that blocks and parries, and Heat that her blows build and her fire rites spend.
Every rule below is meant to make her play differently from Kael from the first second of a run.

## Controls

| Key | Kael | Ysra |
| --- | --- | --- |
| A / D | Walk, double tap to run | Walk, slower and planted. Double tap charges only with Warpath |
| W | Jump, double jump with a pick | One heavy jump, lower than Kael's. No double jump ever |
| J | Sword string picked by the situation | Glaive string: long pokes that pierce every foe in the line |
| Hold J | Nothing | Heft: wind a lunge while standing still, release to lunge forward through the line |
| Up + J | Launcher (pick) | Skyhook: a rising hook that lifts the foe (from the start) |
| Down + J | Low sweep (pick) | Ground lash: a low sweep that hooks foes and drags them in (from the start) |
| J in the air | Air string | One wide air sweep, then nothing until she lands |
| K | Warp throw (pick, MP) | Pole vault on the floor: plants the glaive and arcs over foes. In the air: dive, glaive first, down at an angle |
| L | Dash, untouchable, stamina | Hold to brace: blocks blows from the front, each block costs stamina. A press just before a blow is a parry. L with a side held away is a short backstep |
| I | Cast the selected element (MP) | Call the selected rite, paid with Heat |
| O | Switch element | Switch rite |
| U | Ultimate | Ultimate (shared charge and MP rules) |

## Heat

Heat is Ysra's second bar, 0 to 100, shown where Kael's MP-only setup leaves room.
Glaive blows that land build Heat: about 6 per foe hit by a string blow, 12 per foe hit by a full lunge, vault strike or dive impact.
Heat drains 8 per second after 2.5 seconds without landing a blow.
Rites spend Heat, never MP.
MP only pays for her ultimate.

## Starting kit

At level 1 she has the full glaive string (three blows, growing with level like Kael's combo limit), Heft lunge, Skyhook, Ground lash, the air sweep, the vault, the dive, the brace, the parry, the backstep and the Flare rite.
Her picks change and extend these.
Kael starts with almost nothing and learns abilities; Ysra starts with a full toolkit and learns how to bend it.

## Numbers to start from

- Jump rise about 46 px (Kael 61). Walk speed through her 0.93 move stat.
- Glaive string blows reach about 40 px ahead, hit every foe in the box, and plant her feet. Wind-ups are longer than Kael's and the hits heavier.
- Heft: 0.6 s to a full wind; release under 0.2 s is a quick poke; a full lunge travels about 60 px, pierces all, and is untouchable for its first 0.15 s.
- Vault: about 70 px forward, peak about 40 px, untouchable from the plant to the peak. 1.2 s recharge shown in the HUD tab where Kael's warp recharge sits.
- Dive: once per airtime, about 45 degrees down, impact burst around the landing point.
- Brace: blocks blows from the front for 12 stamina each (Firm Stance cuts that). A blow in the first 0.12 s of a press is a parry: no cost, the attacker staggered 1 s, a short slow motion, and with Counter Thrust the next J is the counter.
- Backstep: about 30 px back, low hop, 25 stamina, untouchable for 0.12 s.
- Flare 30 Heat, Flame Pillar 40, Brazier 50.

## Skill tree

The tree data lives in `src/constants/characters/ysra/`: Lance (early), Bastion (steady), Pyre (late) and Fusion.
Texts on the nodes are the promise to the player; the code must do what they say.
Pyre Wave is her special from level 3, as before; Sunspear, Phoenix Dive and Volcanic Rift replace it.

## Code layout

- `src/types/kit.ts`: the HeroKit interface. The shared loop calls `kit()` from `src/game/hero/kits.ts`.
- `src/game/hero/ysra/kit.ts`: Ysra's kit, composed of three parts. Each part owns its files:
  - Glaive (`ysra/glaive/`, `types/ysra/glaive.ts`, `constants/clips/ysra/glaive.ts`, tree `lance.ts`).
  - Stance (`ysra/stance/`, `types/ysra/stance.ts`, `constants/clips/ysra/stance.ts`, tree `bastion.ts`): jump, vault, dive, brace, parry, backstep, Warpath, and her free-state look (idle, walk, run, jump, fall, hurt).
  - Pyre (`ysra/pyre/`, `constants/clips/ysra/pyre.ts`, tree `pyre.ts`): Heat, rites, and the HUD and control texts for Ysra.
- `src/game/hero/ysra/events.ts`: parts talk through events (`strike`, `block`, `parry`, `lungeEnd`, `land`, `travel`) so no part imports another, except `counterReady` and `spendCounter` from the stance part.
- Ultimates in `src/game/ultimates/`, icons in `src/ui/skills/icons/ysra.ts`.
