# Ysra design

Ysra shares Kael's rig and nothing else.
Kael is a fast duelist: a warp throw, a dash nothing can touch, crystal hangs, juggles, three element spells paid with MP.
Ysra is a heavy reach fighter: long pokes that pierce a whole line, held lunges, a pole vault and a dive for travel, a brace that blocks and parries, and Heat that her blows build and her fire rites spend.
Every rule below is meant to make her play differently from Kael from the first second of a run.

## Controls

| Key | Kael | Ysra |
| --- | --- | --- |
| A / D | Walk, double tap to run | Walk, a steady stride with no run. Double tap charges only with Warpath |
| W | Jump, double jump with a pick | One heavy jump, lower than Kael's. No double jump ever |
| J | Sword string picked by the situation | Glaive string: long pokes that pierce every foe in the line |
| Hold J | Nothing | Heft: wind a lunge while standing still, release to lunge forward through the line |
| Up + J | Launcher (pick) | Skyhook: a rising hook that lifts the foe (from the start) |
| Down + J | Low sweep (pick) | Ground lash: a low sweep that hooks foes and drags them in (from the start) |
| J in the air | Air string | One wide air sweep, then nothing until she lands |
| K | Warp throw (pick, MP) | Pole vault on the floor: plants the glaive and arcs over foes, also straight out of a brace or a backstep. In the air: dive, glaive first, down at an angle |
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

- Jump rise about 46 px (Kael 61). Walk speed through her 1.1 move stat: 74.8 px/s (Kael walks 68 and runs 125).
- Glaive string blows reach about 40 px ahead, hit every foe in the box, and plant her feet. Wind-ups are longer than Kael's and the hits heavier.
- Heft: 0.6 s to a full wind; release under 0.2 s is a quick poke; a full lunge travels about 60 px, pierces all, and is untouchable for its first 0.15 s.
- Vault: about 70 px forward, peak about 40 px, untouchable from the plant until 0.1 s past the peak. 0.95 s recharge shown in the HUD tab where Kael's warp recharge sits, just longer than a vault takes, so vaults chain.
- The vault starts out of a brace (K while L is held) and out of a backstep (K in the hop vaults on landing, K in the skid vaults at once), toward a held side. Backstep then K with the side away held is her escape: a hop back, a turn and a vault away.
- Every vault crosses from the pose shown last into the plant over two frames, before the stab.
- Dive: once per airtime, about 45 degrees down, impact burst around the landing point.
- Brace: blocks blows from the front for 12 stamina each (Firm Stance cuts that). A blow in the first 0.12 s of a press is a parry: no cost, 25 stamina back, the attacker staggered 1 s, a short slow motion, and with Counter Thrust the next J is the counter.
- Backstep: 36 px back in the hop (about 53 px with the skid), low hop, 20 stamina, untouchable for 0.15 s.
- Flare 30 Heat, Flame Pillar 40, Brazier 50. Flare also heals 5% of her max HP, her one heal without a pick.

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

## Skill tree

The tree data lives in `src/constants/characters/ysra/`: Lance (early), Bastion (steady), Pyre (late) and Fusion.
Texts on the nodes are the promise to the player; the code must do what they say.
Pyre Wave is her special from level 3, as before; Sunspear, Phoenix Dive and Volcanic Rift replace it.

Her Evolution branch (`evolution.ts`) holds Pyre Colonnade, the evolved Flame Pillar.
It is offered from level 6 once Flame Pillar is learned and Kindling is at 3/3, as the gold first card of a wave pick.
The cast keeps the rite's Heat cost (40, or 28 with Hearthfire), its clip and its targeting.
A ringed sigil glows under the target with two smaller sigils 30 px either side.
The main pillar bursts at 6.6 times ability power (base 5.5), and the two flank pillars burst 0.12 s later at 3.85 times, 64 px high, with a lighter shake.
A cast deals 6.6 times ability power to a lone foe and up to 14.3 times across a crowd.
Hearthfire still heals once per cast, and Hot Iron's free pillar stays a single base pillar.
The numbers live in `PYRE_COLONNADE` in `src/constants/evolutions.ts`; every pillar is drawn by `castFlamePillar` with its own shape.

## Code layout

- `src/types/kit.ts`: the HeroKit interface. The shared loop calls `kit()` from `src/game/hero/kits.ts`.
- `src/game/hero/ysra/kit.ts`: Ysra's kit, composed of three parts. Each part owns its files:
  - Glaive (`ysra/glaive/`, `types/ysra/glaive.ts`, `constants/clips/ysra/glaive.ts`, tree `lance.ts`).
  - Stance (`ysra/stance/`, `types/ysra/stance.ts`, `constants/clips/ysra/stance.ts`, tree `bastion.ts`): jump, vault, dive, brace, parry, backstep, Warpath, and her free-state look (idle, walk, run, jump, fall, hurt).
  - Pyre (`ysra/pyre/`, `constants/clips/ysra/pyre.ts`, tree `pyre.ts`): Heat, rites, and the HUD and control texts for Ysra.
- `src/game/hero/ysra/events.ts`: parts talk through events (`strike`, `block`, `parry`, `lungeEnd`, `land`, `travel`) so no part imports another, except `counterReady` and `spendCounter` from the stance part.
- Ultimates in `src/game/ultimates/`, icons in `src/ui/skills/icons/ysra.ts`.
