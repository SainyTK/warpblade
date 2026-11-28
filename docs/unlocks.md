# Unlocks and the Codex

A new player starts small and opens more with every run, won or lost.
A new save has Kael and Cerise, five of their 20 skills each, the Sunlit Ruins and an empty Armory.
Everything else (stages, Hyper stages, heroes, skills, Armory items and hero jobs) opens when its goal is met.
Some unlocks then cost gold.

## One table

Every unlock except the hero jobs is one row of `UNLOCKS` (`src/constants/unlocks/`): an id kept in the save, a reward, a goal, and for some a gold price or `secret`.
The folder has one file per kind (`stages.ts`, `heroes.ts`, `items.ts`, `skills.ts`) and `index.ts` joins them.

- A row without a price is found the moment its goal is met.
- A row with a price goes on sale then and is found when bought: heroes on the hero screen, Hyper stages on the stage screen, skills in the Armory.
- A secret row shows only ??? until found, and is left out of the next goals on the result screen.
- A skill row of a hero still locked waits: it neither opens nor goes on sale until the hero is unlocked.

Hero jobs keep their own goal on `CharacterDef.jobs` (`docs/hero-module.md`) and are checked with the same machinery.

## Starting skills

Locked skills are never dealt: `cardView()` passes `isSkillOpen` as the card pool's `isAvailable` filter.
With five skills open the pick budget is still covered by levels, masteries, Deeper Charge, Attunement and Honing (`docs/growth-design.md`).
Each hero's five starters include a partner pair, so an evolution is possible from the first runs.

| Hero | Starting skills |
| --- | --- |
| Kael | Keen Edge, Phase Cut, Reaping Sweep, Crystal Splinters, Lightning |
| Cerise | Measured Touch, Riposte Chain, Pinning Point, Thorn Wounds, Rose Bloom |
| Aldric | Oathblade, Breaking Bash, Sunbrand, Verdict, Dawn Lance |
| Vesper | Rising Edge, Twin Keen, Turning Blade, Falling Moon, Dusk Sigil |
| Saya | Honed Draw, Clean Sheathe, Reverse Edge, Ink Flow, Crescent Wave |
| Yun | Twin Echo, Flowing Water, High Tide, Crane's Reach, Sword Fan |
| Brynn | Heavy Hands, Anvil Weight, Wide Arc, Skyward Heave, Ember Arc |
| Zafir | Whirling Edge, Unbroken Whirl, Opened Veins, Deep Wounds, Hot Gale |
| Calder | Hair Trigger, Breech Slam, Blast Jump, Phosphor Shell, Scorch Rounds |

The data is `STARTER_SKILLS` in `src/constants/unlocks/skills.ts`.

## Skill ladder

Every hero's other 15 skills follow the same ladder, in the hero's skill order with the ultimate skill last.
"With the hero" counts only runs played as that hero.
The two hunted foes give each hero a reason to visit other stages.

| Step | Goal | Price |
| --- | --- | --- |
| 1 | Slay 40 foes with the hero | |
| 2 | Slay 200 foes with the hero | |
| 3 | Slay 500 foes with the hero | |
| 4 | Defeat a mini boss with the hero | |
| 5 | Slay 900 foes with the hero | |
| 6 | Slay 1,400 foes with the hero | 150 |
| 7 | Reach level 70 with the hero | |
| 8 | Slay 2,000 foes with the hero | |
| 9 | Evolve a skill with the hero | |
| 10 | Slay 600 of the first hunted foe | |
| 11 | Slay 2,800 foes with the hero | |
| 12 | Defeat a stage boss with the hero | |
| 13 | Slay 3,800 foes with the hero | 300 |
| 14 | Slay 800 of the second hunted foe | |
| 15 | Clear 3 stages with the hero (???) | |

| Hero | Unlock order | Hunted foes |
| --- | --- | --- |
| Kael | Skybreaker, Crystal Aegis, Warpcraft, Blink Step, Spellwarp, Passing Cut, Sky Dance, Fire Flask, Ice Spikes, Rift Wound, Static Charge, Phantom Edge, Crystal Familiar, Mirror Knight, Crystal Nova | Thornback, Mire Toad |
| Cerise | Long Lunge, Feint, Rose Mark, Passing Touch, Swallow Dive, Needle Rain, Mirror Guard, Weeping Mark, Wilting Curse, Mirror Blade, Petal Blades, Thorn Sentinel, Poise, Grace, Rose Tempest | Glimmer Moth, Slagling |
| Aldric | Iron Retort, Crestfall, Shield Step, Bulwark Arrival, Skyfall, Mending Light, High Sun, Penance, Lingering Dawn, Oathsworn, Sun Lion, Dawn Falcon, Resolve, Iron Vow, Sanctuary | Storm Kite, Ember Bat |
| Vesper | Sky Ribbon, Crossing Storm, Ascending Step, Thrown Dusk, Slipstream, Dusk Gale, Dusk Thread, Falling Night, Afterglow, Dusk Shade, Night Swallows, Twin Phantom, Unbroken Rhythm, Wanderer's Grace, Dusk Waltz | Rime Hound, Sky Guard |
| Saya | Falling Moon, Passing Draw, Shadow Step, Long Stroke, Ink Rain, Still Water, Weeping Cut, Ink Stain, Lingering Line, Ink Crane, Ink Shade, Paper Blades, Feather Step, Calm Mind, Silent Moon | Shardling, Inkling |
| Yun | Petal Storm, Cloud Step, Sword Riding, Drifting Leaf, Sword Cage, Qi Crescent, Lingering Qi, Thousand Cuts, Jade Needle, Guardian Blade, Jade Heron, Sage's Shade, Sage's Breath, Harmony, Heaven's Grove | Gale Hawk, Pagewing |
| Brynn | Counter Cleave, Spinning Throw, Crater Leap, Shoulder Charge, Brand Pillars, War Cry, Cinder Edge, Fault Lines, Crushing Weight, Falling Blade, Echo Swing, Heart Splinter, Iron Skin, Bloodletter, Crimson Fall | Husk, Rune Golem |
| Zafir | Sirocco Descent, Two-Faced Cut, Falling Dune, Dune Walk, Whirlwind Arrival, Sand Slip, Glass Rain, Quicksand, Scouring Sand, Desert Thirst, Sand Wraith, Mirage Dancer, Desert Hawk, Sand Veil, Sandstorm | Wisp, Rot Crawler |
| Calder | Vent Blast, Point Blank, Speed Loader, Ricochet, Recoil Dash, Tracer Warp, Chain Shot, Blast Charge, Shrapnel, Hot Brass, Spare Barrel, Smoke Double, Scrap Hound, Drum Cylinder, Cylinder Break | Prism Sprite, Void Stalker |


## Heroes

| Hero | Goal | Price |
| --- | --- | --- |
| Aldric | Clear the Sunlit Ruins | 300 |
| Vesper | Slay 2,500 foes | 400 |
| Saya | Defeat 3 mini bosses | 550 |
| Yun | Unlock 30 skills | 750 |
| Brynn | Clear the Cinder Foundry | 1,000 |
| Zafir | Defeat 6 stage bosses | 1,350 |
| Calder | Clear a Hyper stage (???) | 1,800 |

The prices are each hero's `CharacterDef.price`.

## Armory items

Each item appears in the Armory when its goal is met; the prices and effects are in `docs/meta-progress.md`.

| Item | Goal |
| --- | --- |
| Vitality | Slay 25 foes |
| Honed Edge | Reach level 12 |
| Arcana | Bank 150 gold from runs |
| Skip | Slay 400 foes |
| Wellspring | Reach level 30 |
| Reroll | Slay 1,000 foes |
| Precision | Defeat a mini boss |
| Light Boots | Slay 500 Glimmer Moths |
| Endurance | Slay 800 Thornbacks |
| Lodestone | Bank 1,000 gold from runs |
| Aftershock | Defeat a stage boss |
| Banish | Unlock 15 skills |
| Growth | Make a Fusion |
| Greed | Bank 2,500 gold from runs |
| Curse | Clear 3 different stages (???) |

## Stages and Hyper stages

The stage graph is `STAGE_OPENS` in `src/constants/stageGraph.ts`.
Clearing a stage opens the stages it leads to; the Abyss Citadel needs both Veil Spires and Blightroot Hollow.

| Clear | Opens |
| --- | --- |
| Sunlit Ruins | Storm Marsh, Cinder Foundry |
| Storm Marsh | Frostglass Caverns, Thunderhead Skyway |
| Cinder Foundry | Frostglass Caverns, Drowned Archive |
| Frostglass Caverns | Moonlit Ruins |
| Thunderhead Skyway | Moonlit Ruins, Veil Spires |
| Drowned Archive | Moonlit Ruins, Blightroot Hollow |
| Moonlit Ruins | Veil Spires, Blightroot Hollow |
| Veil Spires and Blightroot Hollow | Abyss Citadel |

A stage clear puts that stage's Hyper version on sale for 150, 300, 450, 600 or 900 gold by tier (`HYPER_PRICE`).
Clearing a Hyper stage gives its reward once: a Rift Stage's Rift Art in every run, one more reroll for the Sunlit Ruins, one more banish for the Abyss Citadel.

## Pacing

`docs/growth-review/unlock-sim.mts` plays 400 runs of a modelled player through the real table, goals, Armory prices and stage foe lists.
Load it through the dev server (`await import("/docs/growth-review/unlock-sim.mts")` in the browser console) and read `UNLOCK_PACING`.

The model, from the numbers in `docs/growth-design.md`:

- Kills and gold come from the real stage route: every foe up to the level the run reaches, with the stage's gold share, twist and the Armory's Greed and Curse.
- A run reaches level 14 on its first try at a stage, 16 more for each earlier try, 12 fewer for each tier above the first, 8 fewer in a hero's first two runs, and up to 30 more with the Armory's stats; 99 is a clear.
- A run that reaches level 60 makes a Fusion; one that reaches 85 evolves a skill.
- A run lasts 25 minutes times the share of the stage played, plus 1.5 minutes in menus.
- The player rotates through the open heroes that still have locked skills, plays the first stage it has not cleared, and buys heroes, then skills, then Hyper stages, then the cheapest Armory level it can afford.

Result on 27 November 2026:

| Milestone | Run | Hours |
| --- | --- | --- |
| Every Armory item found | 20 | 5.2 |
| Full Armory bought | 51 | 13.4 |
| Every Kael and Cerise skill | 63 | 17.1 |
| Every stage cleared | 71 | 19.0 |
| Every hero | 77 | 20.9 |
| Every skill and every unlock | 150 | 41.3 |

26 of the first 30 runs unlock something.
The four that do not are first tries at a new stage that fall before level 18; they still move the kill and fall counters.
The first runs unlock one or two things each, and the first run that reaches the boss of a stage unlocks several at once.
A full clear earns 380 to 670 gold by stage, and twice that on a Hyper stage.

## The run and the result screen

`src/store/unlocks.ts` checks every row after every feat, after every purchase and once as the game loads.
It owns what is found, the known recipes, what was found since the run began (`unlockedThisRun()`) and each goal's count at the run's start.

The stage result screen shows:

- Unlocked: `unlockedThisRun()`, each with its kind (Armory, Kael's skill, Hero, Stage open).
- Next goals: the three closest goals with a bar, the count and, in green, what this run added (`closestGoals()`); goals this run moved come first.

A fallen run keeps its gold, kill counts and goal progress and counts one fall; only a cleared run counts a stage clear.

## Goals

A goal is a `Goal` read from the tracked stats and the meta save (`docs/achievements.md`); `goalText()` in `src/utils/goalText.ts` writes it for the screens.
The unlocks add these goal kinds:

| Goal | Counts |
| --- | --- |
| `heroStat` | a hero's kills, best level, mini boss kills, stage boss kills, evolutions and stage clears |
| `skillsFound` | skills unlocked, starters not counted |
| `fusionsFound` | different Fusions made |
| `goldSpent` | gold in Armory levels now owned plus gold paid for unlocks |
| `armoryLevels` | Armory levels owned |

They also read the `falls` count, the best `level`, `foeKills`, `coinsBanked`, `miniKills`, `bossKills` and `stageClears`.
The `kill`, `evolved` and new `levelReached` feats carry the hero.

## Co-op

Co-op runs count.
On the host, `feat()` hands each feat to the room (`HostRun.shareFeat`).
Kills, waves, run ends and stage clears count for every player, each under their own hero.
Levels, evolutions, combos, perfects, chests and the rest count for the player whose hero did it.
The host records its own share and sends each guest theirs (`{ t: "feat" }`), which the guest records in its own save.
A guest sends its loadout (Armory levels switched on and open skills) when it joins and after each change, and the host deals that guest's cards from it.

## Where the player sees them

- A banner in the achievement style, in crystal, when something is found or goes on sale.
- The result screen, as above.
- The Codex: the Armory's items, Resonance, Fusions, Rift Arts and each hero's skills with their evolutions.
  A locked entry shows a dark silhouette, its name, what opens it and a bar; a skill for sale shows its price; a secret one only ???.
- The hero screen: a locked hero shows the padlock with its goal and bar, or its price once for sale; every hero shows how many of their skills are open.
- The Armory lists the items found, the skills for sale and how many items are still locked.

A playtest session (`warpblade-playtest`) has everything found and finds nothing.

## Recipes

A skill card shows its evolution's name and "Evolves with ???" until the player has made that evolution once.
Core calls `learnRecipe(id)` when a skill evolves and `learnFusion(id)` when a Fusion forms.
Recipes and Fusions are kept in the save's `recipes`.

## Saving

The `warpblade-meta-v2` save keeps `unlocks` (found unlock ids, hero and job ids included) and `recipes`.
A save from before this change has its bought heroes moved into `unlocks` as `hero:<id>`.
