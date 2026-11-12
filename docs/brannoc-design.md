# Brannoc, the berserker

The tenth hero and the seventh built in the hero sprint (patch 0.10.0).
Id `brannoc`, kit `brannoc`, name Brannoc (he/him), title "The red oath".
Blurb: "He swore to the rift that he would give it his blood before he gave it ground. It keeps taking him up on it. Every cut he takes makes the axe lighter."
Price: 2450 coins in `src/constants/heroUnlocks.ts`, the eighth price by the rule written there (300 x 1.35^7, rounded to 50).
Accent `#eadbb8` (bone), the colour of his war paint and axe haft binding. No hero uses a pale warm neutral: Kael is cyan, Ysra orange, Sable mint, Hulda coral, Orrin amber, Mirel teal, Wenna violet, Tallis rose and Jory cobalt.
His effects use a new crimson ramp (below), so the menu colour and the fight colour are both his own.

Code layout follows Jory and Tallis: kit `src/game/hero/brannoc/`, character `src/constants/characters/brannoc/` (index, look, skills), numbers `src/constants/brannoc/`, clips `src/constants/clips/brannoc/`, types and kit events `src/types/brannoc.ts`, skill behaviours `src/game/skills/brannoc/`, effects `src/game/effects/brannoc/`, icons `src/ui/skills/icons/brannoc/`, touch icons `src/ui/touch/icons/brannocArt.ts`, the HP debt segment `src/ui/debtBar.ts`, his ability tabs `src/ui/brannocTabs.ts`, his axe `src/game/hero/draw/greatAxe.ts`, his skill tables `docs/skills/brannoc.md`, and the design note `docs/brannoc-design.md`.
Add `brannoc` to `KitId` in `src/types/kit.ts`.

## How he differs from every hero in the game

- Kael (warp swordsman) dashes untouchable, double jumps, teleports and spends MP on element spells. Brannoc has no untouchable travel, no double jump and spends no MP outside his special. His abilities are paid in HP.
- Ysra (planted glaive, brace and parry, vault, Heat) meets one blow from the front. Brannoc cannot block or parry. He takes every blow in full and answers with damage.
- Sable (ranged hunter, ammo and reload) keeps foes at 250 px. Brannoc wants foes on both sides of him: his finisher hits all around.
- Hulda (grappler, armour plates from Grit) halves blows with armour and moves foes with her hands. Brannoc has no armour and no grab. His only no-flinch window is Frenzy and Berserk, and a blow then still takes full HP and forfeits his debt.
- Orrin (chain dancer, Momentum from speed) earns damage by moving fast through the air. Brannoc earns damage by being hurt.
- Mirel (time mage, Sand, Rewind) undoes HP loss by waiting and turning back. Brannoc gets HP back only by landing blows, and loses that chance the moment he is hit.
- Wenna (summoner, Wicks, Wax) fights through bodies. Brannoc fights alone in the middle of the crowd.
- Tallis (shadow assassin, Veil, blows from behind) wins by not being seen. Brannoc wins by standing where every foe can reach him.
- Jory (war drummer, beat clock, Groove) wins by when he presses. Brannoc wins by how much he is willing to lose.

The axes:

- Movement: walk and run with one jump of the shared height, plus Hunt, a lunge that homes on the nearest ground foe ahead and ends in a chop. No backstep or retreat move anywhere in his kit. Fury makes him walk faster.
- Defence: none in the usual sense. He wins HP back by striking (the debt), heals on kills while Bloodied, and only in Berserk refuses to fall.
- Resource: his own HP. Abilities on K and I cost HP, and missing HP is Fury.
- Range: a great axe, 8 to 34 px ahead, and a finisher that hits 36 px on both sides.
- Attack shape: wide, heavy arcs. Every string blow hits every foe in its arc, and the finisher hits all around him.

## Stats

`base: { ad: 13, ap: 6, hp: 125, mp: 70, stamina: 100, crit: 0.06, move: 1.02, aspd: 0.9, haste: 1 }`, `growth: { hp: 1.2, mp: 0.25 }`, `comboHits: 3`, `special: "berserk"`.
HP 125 sits between Hulda (120) and Ysra (130) because HP is also what he spends. Attack speed 0.9 is the slowest base swing in the roster and Fury lifts it.

Balance fallback, in order, only if the mash bot falls before wave 3: HP 125 to 135, then Hew and Reave power +10%. Record each step in the design note.

## Fury: missing HP is power

`missing = 1 - hero.hp / progress.stats.hp`, read every frame.

- `damageScale()` returns `1 + 0.6 x missing` (every hit from any source, through the existing kit hook).
- `attackRate()` returns `1 + 0.3 x missing` (string clips, through the existing kit hook).
- `walkSpeed(speed)` returns `speed x (1 + 0.15 x missing)`.
- Bloodied: HP at or under 35% of max. While Bloodied the Cleave spins twice (below), a kill heals 3% max HP (Bloodthirst, outside the debt), and his look changes (below). Crossing in plays a low growl (`sfx.tone(70, 160, 0.08, "sawtooth", 0.05)`) and a one-frame crimson rim flash; crossing out plays nothing.
- His idle at low HP uses his own Bloodied idle in place of the shared wounded idle: shoulders heaving on a 0.8 s breath, head low, axe head dragging on the floor. The shared red danger glow at the screen edge stays as it is.

At 35% HP he deals 1.39x and swings 1.195x faster; near 0 HP 1.6x and 1.3x.

## The debt

HP he spends on K and I is not lost at once. It becomes debt, shown on the HP bar, and he can win it back.

- Spending: the cost comes off `hero.hp`. A press whose cost would leave him under 1 HP is refused with the shared deny tick and the HP bar blinks. Spent HP adds to the debt, which is capped at 40% of max HP; HP spent past the cap is gone for good.
- Winning back: each foe a blow of his lands on (any source of his, at most 3 foes a blow; a blow is one swing, and a cast or a Hunt counts as one) returns 2.5% of max HP from the debt to his HP, a crit 5%, a kill 5% more. Summon and damage-over-time hits return nothing.
- Fading: after 3.0 s with no blow landed, the debt fades at 5% of max HP a second.
- The debt never reaches past the empty part of the bar: a heal that fills the bar (a chest, a new wave) shrinks it.
- Forfeit: any blow that takes his HP (the shared `hurt` event) clears the whole debt.
- The debt lives in his seat memory (`rememberPerSeat(objectMemory(brannoc))`) so a guest's HUD reads its own.
- Kit events: `debt` with `change` (`spend`, `repay`, `fade`, `forfeit`) and `amount`.

HUD: his HP bar gets a debt segment, a `#hpDebt` element in the HP track right after the fill, width `debt / max HP`, filled `PAL.rage[2]` with a one-pixel `PAL.rage[4]` edge. It brightens for 0.1 s on each repay, pulses slowly while fading, and on a forfeit flashes white for 0.08 s and breaks into four shards that drop out of the bar over 0.2 s. A one-pixel tick on the HP track marks 35%. Both show only for him (hidden for other kits). He has no second bar; the MP and ST bars stay.
On the stage, each repay draws two or three crimson motes from the struck foe into his chest over 0.25 s (`SPARKS.rage`).

## Controls

| Key | Brannoc |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | One jump of the shared height. No double jump |
| S | With W, drop through a ledge |
| J | Axe string: Hew, Reave, Cleave, the same every time. In the air, Hatchet Drop, once per airtime |
| K | Frenzy (costs HP) |
| L | Hunt, a lunge at the nearest ground foe ahead |
| I | Selected ability: War Cry, Red Crescent, or a spell skill (HP) |
| O | Switch ability |
| U | Special: Berserk (shared charge and MP rules) |

Touch buttons read Axe, Jump, Frenzy, Hunt, Ability, Switch and Special, with icons in `brannocArt.ts`; nothing has to be held that a key does not hold.
The Controls screen lists every key from `ACTION_TEXT.brannoc` and, on touch screens, the stick (`STICK_DIRECTIONS.brannoc`) and the buttons (`TOUCH_TEXT.brannoc`).

## J: the axe string

J on the floor plays Hew, Reave and Cleave in that order every time, wherever foes stand, and never turns him (`docs/combo-design.md`). A J pressed during a blow is kept. Every string blow staggers for the shared `COMBO.stagger` and hits every foe in its box, nearest first.
Frames are clip frames at 30 a game second, played at attack speed times `attackRate()`.

| Blow | Frames | Hit on | Next from | Reach | Power | Knockback | Hit feel | Extra |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Hew | 18 | 8 | 13 | 8 to 30 px ahead, 0 to 40 px up | 1.15x AD | 12 | `FEEL.firm` (0.08 s, 1.5 px) | |
| Reave | 18 | 7 | 13 | 14 px behind to 32 px ahead, 4 to 30 px up | 1.0x AD | 16 toward his front | `FEEL.firm` (0.07 s, 1.2 px) | a foe behind him is swept to his front side |
| Cleave | 26 | 11 | 22 | 36 px on both sides, 0 to 36 px up | 1.9x AD | 70, knockdown | `FEEL.crush` (0.13 s, 3 px) | heavy (breaks a guard) |
| Cleave, Bloodied | 32 | 11 and 17 | 28 | the same | 1.9x then 0.8x AD | 70 then 30 | crush, then 0.09 s, 2 px | the second spin hits everyone the first did and anyone new |
| Hatchet Drop (air) | 14 | 6 | | 4 to 24 px ahead, 30 px down | 1.2x AD | 20 | 0.07 s, 1.5 px | once per airtime, heavy |

Animation beats, to `docs/motion-standard.md`, both hands on the haft:

- Hew: anticipation frames 0 to 7, the axe climbs over the far shoulder until the head is behind his head, weight on the back foot, chest open, held three frames. Strike on 8, a diagonal chop from high back to low front with a crimson smear (`PAL.rage[3]` fading to `[2]`). Follow-through: the head bites the floor ahead with three dust motes, front knee bent, then he levers it up and settles.
- Reave: anticipation, he drops the axe low behind his hip and twists his torso away from the foe. Strike on 7, a flat waist-high sweep from behind him round to the front, the smear a wide half ring. Follow-through: the axe carries past his front shoulder, back heel lifts, then unwinds.
- Cleave: anticipation frames 0 to 9, a deep crouch with the axe wound all the way back and head low, the longest load in his kit. Strike on 11 as he spins a full turn on the front foot (the rig turns through back view and front view), with a full crimson ring smear. Follow-through: the axe slams into the floor ahead with a crack decal 12 px wide that fades over 0.6 s, six dust motes, two held frames, then he heaves it out. The Bloodied Cleave adds a second turn before the slam.
- Hatchet Drop: a tuck with the axe raised overhead at the top of the jump, then a straight chop down held to the landing.
- Bloodied, every blow trails two extra crimson drip pixels from the axe edge.

## K: Frenzy

- Costs 12% of max HP into the debt. No stamina, no MP.
- 0.25 s activation: he draws the axe edge across his forearm, a crimson burst of eight sparks from the arm and a short roar (`sfx.tone(90, 220, 0.09, "sawtooth", 0.05)`). Works on the floor and in the air.
- For 4.0 s: `attackRate()` gains another +20%, each repay is 1.5x, and his kit's `steadfast()` returns true, so a blow takes its HP with no knockback, flinch or combo reset. The blow still forfeits the debt.
- After Frenzy ends, K waits 2.0 s; a press in that wait gets the deny cue.
- Look while Frenzied: a 1 px crimson outline pulses on his sprite and his breath shows as red steam from the mouth every 0.4 s.
- Kit event `frenzy` with `on`.

## L: Hunt

- 20 stamina, then 0.6 s before the next Hunt. With too little stamina, the shared tired puff.
- Two-frame crouch load, then a low lunge 8 px off the floor at 380 px/s scaled by move speed toward the facing side (or the side held). If a ground foe stands ahead within 110 px, he goes for it, following it as it moves through the lunge, and lands 24 px short of it: outside a walking foe's touch (its 12 px half-width and his 5) and inside the chop's 26 px reach. Otherwise he travels 56 px.
- On landing, Hunt Chop: 0.8x AD, 4 to 26 px ahead, staggers, knockback 10. Then 0.2 s recovery.
- He is never untouchable during Hunt, and he stops against a foe's body.
- In the air, once per airtime: Headlong, a 45 degree dive down and ahead at 420 px/s that lands into the same chop.
- Each Hunt calls `travelEnded()` (Aftershock) on landing and emits the shared `dash` with direction and the foes passed, plus kit event `hunt` with `foe` (or null).
- Look: the body leans almost flat with the axe trailing behind, two afterimage frames in `PAL.rage[1]`, a dust skid on landing.

## Abilities on I (HP), rotation on O

Both cost HP into the debt and emit the shared `cast` with ability `warCry` or `redCrescent`.

- War Cry: 8% max HP, 10 s recharge. 0.3 s roar with the head thrown back. Minions and elites within 64 px take 0.5x AP + 0.2x AD and are staggered 0.5 s; every foe within 64 px is marked (`markFoe`, +20% from all sources, 6 s). Mini bosses and bosses take the damage and the mark only. Look: three expanding crimson arcs from his mouth and a 1 px screen shake.
- Red Crescent: 10% max HP, 4 s recharge. An overhead swing throws a crimson crescent 150 px along the floor at 280 px/s that passes through foes, 0.9x AD + 0.6x AP to each. Each foe it strikes repays the debt like a blow. Look: a 14 px tall crescent in `PAL.rage[3]` with a `[5]` core and a trail of drips.

The HUD tabs (CRY, CRESCENT, GEYSER, AXE and PACT) and the touch Ability button show the selected one and its recharge, as for Jory.
Each tab also shows its HP cost as a share of max HP ("CRY 8%", "CRESCENT 10%"), and the touch Ability button shows the selected one's cost as crimson pips along the bottom of its face, one for each 5% of max HP.
A tab whose HP cost would leave him under 1 HP is also struck through in crimson, and the touch button dims.

## U: Berserk

Shared charge levels and MP costs.

- On release: a 0.35 s roar with arms wide and the axe raised, a 48 px crimson ring that pushes minions out to 56 px, and the scene edges tint crimson (15%). He is untouchable through the roar.
- Then Berserk for 3, 4, 5 or 7 s by charge level: Deathless (a blow can leave him at 1 HP but never below, and Last Light is not spent), no flinch (`steadfast`), +40% attack rate, repays doubled, and the debt does not fade.
- When it ends: Last Cleave, an automatic full spin, a ring of 60, 80, 100 or 130 px for the level's power x 0.3 x (AD + AP), knocking minions down and elites over, screen shake 4 px. Untouchable through the spin.
- New shared seam: an optional kit hook `hpFloor?(): number` in `HeroKit`. `hurtHero` clamps HP to it before `lastLight()`. Left out it is 0, so every other hero is unchanged.
- The ultimate skill `b_unending` replaces Berserk with Unending Rage.

## The 20 skills

Ids are prefixed `b_`. The full eight-level tables are in `docs/skills/brannoc.md`, written from the data. Each skill adds a new property on at least four of its seven level ups (`docs/skill-design.md`).
Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1. Risk: precise 5, easy 7, timed 8.
His precise move is fighting Bloodied, or catching a wind-up with the Cleave; precise payoffs land on `PRECISE_TARGETS` foes.
Spell skills cost HP into the debt, like his base abilities.

| Id | Name | Kind, risk, button | Level 1 | Properties levels add | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| b_redEdge | Red Edge | attack, precise, J | while Bloodied, Cleave +60% on its first foe | Hew too; the payoff foe bleeds; the payoff is a sure crit; repays triple | Crimson Moon (b_scarred): a Bloodied Cleave throws a 90 px crimson arc both ways |
| b_heavyHew | Heavy Hew | attack, easy, J | Hew +25% | a 40 px floor crack ahead for 0.4x AD; breaks a guard; crack 70 px; crack staggers | Earthsplitter (b_geyser): the crack runs 140 px and erupts in spikes |
| b_reaver | Reaver | attack, timed, J | Reave reaches 24 px behind | pulls foes 10 px in; slows struck foes 20%; pulls elites; a second sweep | Reaping Hook (b_hunt): Reave drags every foe within 60 px into the Cleave's arc |
| b_executioner | Executioner | attack, precise, J | +80% on a foe under 30% HP | 35% threshold; a kill repays 10%; works on elites; minions under 15% die outright | Headsman (b_bleed): Cleave fells minions and elites under 20% outright, 3x on mini bosses |
| b_spinningReap | Spinning Reap | attack, timed, J | Cleave spins once more for 0.6x | drifts 20 px forward; pulls foes in; another turn; a wind ring | Red Tempest (b_headlong): Cleave becomes a 1.2 s whirl steered with A and D |
| b_sunder | Sunder | attack, precise, J | a Cleave on a winding foe +100% and stuns it 0.8 s | marks it +20%; breaks guard for 3 s; elites too; a shatter ring | Shatterblow (b_rend): the stunned foe bursts for 50 px |
| b_hunt | Long Hunt | movement, timed, L | Hunt reaches 150 px, chop +40% | a second Hunt within 0.6 s is free; chop launches; hunted foe marked; 5 less stamina | Wolf's Road (b_wolves): each Hunt sends a red wolf down the lane |
| b_headlong | Headlong | movement, easy, L | foes Hunt passes take 0.5x AD and are shoved aside | passes through minions; staggers them; elites; leaves a dust wave | Juggernaut (b_reaver): Hunt passes every ground foe and the chop hits all of them |
| b_bloodTrail | Blood Trail | movement, timed, L | Hunt leaves a 2 s trail, 0.2x AD every 0.5 s | slows; longer; bleeds; repays on kills | River of Red (b_hemorrhage): the trail spreads to 3 s and bursts at its end |
| b_geyser | Blood Geyser | spell, easy, I, 8% HP | a pillar erupts under the nearest foe within 120 px, 1.0x AP + 0.4x AD, launches | a second pillar; wider; marks; repays per foe | Blood Fountain (b_pact): three pillars, each repays the debt |
| b_axeThrow | Hurled Axe | spell, easy, I, 10% HP | a hand axe flies 160 px and returns, 0.7x AD each way | pierces; bleeds; a second axe; returns through him repaying debt | Twin Fangs (b_spinningReap): two axes orbit him for 3 s |
| b_pact | Blood Pact | spell, precise, I, 20% HP | 5 s: crit +25%, crits repay double | the first Bloodied blow is a sure crit at 2x; longer; Fury +0.1; no fade | Oathbound (b_executioner): every kill in the pact extends it 1 s |
| b_bleed | Open Wounds | dot, easy, auto | string blows stack a bleed, 0.08x AD a second per stack, 5 max | 8 stacks; spreads on death; faster ticks; Cleave adds 2 | Bleed Dry (b_sunder): Cleave consumes every stack as one hit |
| b_rend | Rend | dot, timed, J | Cleave rends: 3 heavy stacks | Hew rends; longer; stacks slow; wider | Flay (b_heavyHew): rended foes take +30% from Hew |
| b_hemorrhage | Haemorrhage | dot, precise, auto | Bloodied blows plant a mark that bursts after 2 s for 1.5x the damage stored | repays on burst; spreads; shorter fuse; mini bosses | Red Bloom (b_redEdge): bursts chain to the next foe |
| b_wolves | Blood Wolves | summon, easy, on kill | 15%: a red wolf spirit lunges at the nearest foe, 0.8x AD | two wolves; bites bleed; 30%; wolves stay 3 s | Blood Pack (b_ravens): every kill while Bloodied calls a wolf |
| b_ancestor | Forebear | summon, timed, on Frenzy | a ghostly forebear stands beside him through Frenzy and swings on every third blow, 1.0x AD | every second blow; cleaves both sides; taunts; outlasts Frenzy 2 s | Host of Forebears (b_unending): three forebears through Berserk |
| b_ravens | Carrion Ravens | summon, timed, on hurt | 40%: two ravens strike the foe that hurt him, 0.6x AD | blind it 1 s; four ravens; 60%; they repay on hit | Carrion Storm (b_axeThrow): a cloud that circles him for 4 s |
| b_scarred | Scarred Hide | passive, easy | debt cap +10% of max HP | fades 25% slower; Bloodied at 40%; Fury +0.1; Bloodthirst heals 4% | Thousand Scars (b_ancestor): a blow forfeits only half the debt |
| b_unending | Unending Rage | ultimate, timed, U | Berserk lasts 2 s longer and Last Cleave strikes twice | ring wider; repays triple; kills extend 0.5 s; roar stuns | World Ender (b_bloodTrail): Last Cleave splits the floor across the stage |

Ultimate budgets follow the skill design rule (level 8 about 6x the special, evolved about 15x).
Every skill and evolution gets a code-drawn icon on a dark crimson disc with a bone rim, the axe and blood shapes bold enough to read at card size.

Kit events declared in `src/types/brannoc.ts`: `debt`, `frenzy`, `hunt`, `bloodied` (with `on`) and `berserk` (with `on` and `level`). The shared `cast`, `jump`, `dash` and `hurt` are emitted as for Jory.

## Look

Shared rig, heavy build, his own skin in `src/constants/characters/brannoc/look.ts`.

- Pale weathered skin, a wild ash-blond mane in ragged, streaked locks with two thick braids on the ponytail rope, a short braided beard, and a bone-white war paint band across both eyes.
- Bare scarred chest under a dark wolf-fur mantle on the shoulders and a short ragged wolf pelt hung from the back of the belt in place of coat tails (`src/game/hero/draw/furTails.ts`), so the legs stay clear, iron bracers bound in bone-coloured cord, a wide leather belt with an iron buckle, dark trousers and fur-wrapped boots.
- The great axe (`src/game/hero/draw/greatAxe.ts`): a long dark ash haft wrapped in bone cord at both grips, a wide bearded iron head with a pale edge and a crimson glint along it for two frames after each blow lands. Held two-handed at the clip's blade angle; in walk and run it rests on the near shoulder so it never cuts through the body.
- Bloodied: the war paint glows `PAL.rage[4]`, his eyes become two crimson pixels, and red steam rises from his shoulders every 0.5 s.

New ramp in `src/constants/palette.ts`: `PAL.rage` (`#1a0508`, `#4a0c14`, `#8e1424`, `#d0283a`, `#ff6a5a`, `#ffd8c8`) and `SPARKS.rage` from it (`#ffd8c8`, `#ff6a5a`, `#d0283a`, `#8e1424`). `SPARKS.blood` stays for the shared hurt.
His own clips in `src/constants/clips/brannoc/`: the stance, the idle and the Bloodied idle, every blow, Frenzy, Hunt and Headlong, War Cry, Red Crescent, the spell cast, the charge, the Berserk roar and Last Cleave. Walk, run, jump, fall, hurt and death use the shared clips through the motion layer.

## Achievements

- `heroTrial("brannoc", "Brannoc")`: clear wave 10 with him, 40 coins.
- On the Edge (Skill, 60 coins): "As Brannoc, defeat 30 foes while Bloodied in one run." Tracked stat `bloodiedKills`, the best of a run, through `src/utils/trackedStats.ts`.
- Achievements go from 33 worth 2,470 coins to 35 worth 2,570; update `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

Vitality: his HP, which is also his resource pool. Honed Edge: every axe blow, Hunt Chop, Hatchet Drop, Red Crescent and Last Cleave. Arcana: War Cry, Red Crescent, his spells, the ability power dots and Last Cleave. Wellspring: MP for Berserk. Precision: every hit, and crits repay double. Light Boots: walk, run and Hunt's speed. Endurance: Hunt's stamina. Aftershock: every Hunt landing. Lodestone, Head Start and Last Light work in shared code (Berserk's Deathless keeps Last Light unspent).
Add his paragraph to `docs/meta-progress.md` and his Aftershock line to the shop list.

## Co-op

The debt, its fade timer, Frenzy, Berserk, the K wait, the Hunt wait and the selected ability live in his seat memory (`rememberPerSeat(objectMemory(...))`), so a guest's debt segment and tabs read his own. Fury reads each seat's own HP. His rings, crescents and summons are host-side effects.

## What stays unchanged

The other nine heroes' kits, numbers and clips. `PACE`, the combo layer and the beat clock.
Shared seams added for him, each a no-op for every other hero: the `hpFloor` kit hook and the HP bar's debt segment and 35% tick (hidden for other kits).
Saves: coins, shop levels, unlocked heroes and options load as before; `bloodiedKills` starts at 0 in an old save; Brannoc appears locked at 2450 coins.
The playtest folder is untouched.

## How it fits a run

Early, he plays as a slow heavy hitter who gets stronger as foes chip him. A skilled player spends HP on Frenzy and War Cry before a crowd, sweeps it with Reave and Cleave to win the debt back, and lives Bloodied on purpose for the double Cleave, Bloodthirst and the precise skills. Berserk is his answer to the Rift Warden and the Abyss Sovereign: seven seconds where he cannot fall.

## Where the build differs from the plan

- Slows: the cards that slow (Reaver, Rend, Blood Trail) use the shared chill, which halves a foe's pace, so they say "slowed for N s" and give no percentage.
- Reaver level 1 also adds 20% to Reave, so its first card is worth taking on its own.
- Forebear's sixth level makes its swing stagger and mark minions: foes in this game have no taunt to aim them at a summon.
- Forebear sits on K (it comes with Frenzy), Blood Wolves and Carrion Ravens are automatic.
- Hunt's two afterimages are copies of his lunge pose in his own crimson glow, from the shared move ghost.

## Bot check

The mash bot (walk to the nearest foe and mash J, first card of every pick) from wave 1, one run per hero on this patch.
The other nine heroes' rows match the 0.9.0 baseline exactly.

| Hero | Wave | Level | Kills | Game seconds |
| --- | --- | --- | --- | --- |
| Kael | 5 | 5 | 14 | 82.6 |
| Ysra | 5 | 5 | 17 | 77.1 |
| Sable | 5 | 6 | 17 | 73.7 |
| Hulda | 5 | 5 | 14 | 104.4 |
| Orrin | 5 | 6 | 18 | 75.1 |
| Mirel | 5 | 6 | 18 | 81.4 |
| Wenna | 5 | 5 | 15 | 87.1 |
| Tallis | 3 | 4 | 9 | 67.1 |
| Jory | 4 | 5 | 10 | 98.9 |
| Brannoc | 5 | 5 | 14 | 102.2 |

Brannoc falls on wave 5, within two waves of every other hero, so the balance fallback in Stats was not needed.

The skilled bot from wave 20 at level 14 (the 0.9.0 baseline for the other nine heroes, run again for him on this patch):

| Hero | Wave | Level | Kills | Game seconds |
| --- | --- | --- | --- | --- |
| Kael | 20 | 14 | 0 | 23.1 |
| Ysra | 20 | 14 | 0 | 24.3 |
| Sable | 20 | 14 | 0 | 29.5 |
| Hulda | 20 | 14 | 0 | 28.8 |
| Orrin | 20 | 14 | 0 | 21 |
| Mirel | 20 | 14 | 0 | 24.5 |
| Wenna | 20 | 14 | 0 | 22.2 |
| Tallis | 20 | 14 | 0 | 23.1 |
| Jory | 20 | 14 | 0 | 26.9 |
| Brannoc | 20 | 14 | 0 | 24.6 |

Like every hero, he falls to the Rift Warden at wave 20 in 21 to 30 s with no kills.

## Note for the owner

A skilled bot policy for Brannoc would press K before a crowd, string J into it, press L at a foe out of reach, and press U when Bloodied.
The mash bot never spends HP, so it measures him as a plain heavy hitter with Fury from the HP foes take.
