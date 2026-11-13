# Brannoc, the berserker

The tenth hero and the seventh built in the hero sprint (patch 0.10.0).
Id `brannoc`, kit `brannoc`, name Brannoc (he/him), title "The red oath".
Blurb: "He swore to the rift that he would give it his blood before he gave it ground. It keeps taking him up on it. Every cut he takes makes the axe lighter."
Price: 2450 coins in `src/constants/heroUnlocks.ts`, the eighth price by the rule written there (300 x 1.35^7, rounded to 50).
Accent `#eadbb8` (bone), the colour of his war paint and axe haft binding. No hero uses a pale warm neutral: Kael is cyan, Ysra orange, Sable mint, Hulda coral, Orrin amber, Mirel teal, Wenna violet, Tallis rose and Jory cobalt.
His effects use a new crimson ramp (below), so the menu colour and the fight colour are both his own.

Code layout follows Jory and Tallis: kit `src/game/hero/brannoc/`, character `src/constants/characters/brannoc/` (index, look, skills), numbers `src/constants/brannoc/`, clips `src/constants/clips/brannoc/`, types and kit events `src/types/brannoc.ts`, skill behaviours `src/game/skills/brannoc/`, effects `src/game/effects/brannoc/`, icons `src/ui/skills/icons/brannoc/`, touch icons `src/ui/touch/icons/brannocArt.ts`, the HP debt segment `src/ui/debtBar.ts`, his axe `src/game/hero/draw/greatAxe.ts`, his skill tables `docs/skills/brannoc.md`, and the design note `docs/brannoc-design.md`.
Since the shared moveset (`docs/moveset-design.md`), his warp is `warpStyle.ts` with the thrown axe in `src/game/effects/brannoc/thrownAxe.ts`, his guard `guardStyle.ts`, and his abilities on I `abilities.ts`; the shared ability tabs show them.
Add `brannoc` to `KitId` in `src/types/kit.ts`.

## How he differs from every hero in the game

- Kael (warp swordsman) double jumps, hangs from crystals and spends MP on element spells. Brannoc has no double jump and spends MP only on the shared warp and his special. His abilities are paid in HP.
- Ysra (planted glaive, brace and parry, vault, Heat) blocks well. Brannoc's guard is the worst in the roster: half of each blow bleeds through it. His parry is the best: it wins back all the HP he spent.
- Sable (ranged hunter, ammo and reload) keeps foes at 250 px. Brannoc wants foes on both sides of him: his finisher hits all around.
- Hulda (grappler, armour plates from Grit) halves blows with armour and moves foes with her hands. Brannoc has no armour and no grab. His only no-flinch window is Frenzy and Berserk, and a blow then still takes full HP and forfeits his debt.
- Orrin (chain dancer, Momentum from speed) earns damage by moving fast through the air. Brannoc earns damage by being hurt.
- Mirel (time mage, Sand, Rewind) undoes HP loss by waiting and turning back. Brannoc gets HP back only by landing blows, and loses that chance the moment he is hit.
- Wenna (summoner, Wicks, Wax) fights through bodies. Brannoc fights alone in the middle of the crowd.
- Tallis (shadow assassin, Veil, blows from behind) wins by not being seen. Brannoc wins by standing where every foe can reach him.
- Jory (war drummer, beat clock, Groove) wins by when he presses. Brannoc wins by how much he is willing to lose.

The axes:

- Movement: walk and run with one jump of the shared height, the shared front dodge, and the Hunt, his warp: the great axe hurled into the nearest foe ahead and him after it. No backstep or retreat move anywhere in his kit. Fury makes him walk faster.
- Defence: a poor guard that bleeds into the debt and a parry that pays the debt back. He wins HP back by striking, heals on kills while Bloodied, and only in Berserk refuses to fall.
- Resource: his own HP. Abilities on I cost HP, and missing HP is Fury.
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

HP he spends on I, and HP that bleeds through his guard, is not lost at once. It becomes debt, shown on the HP bar, and he can win it back.

- Spending: the cost comes off `hero.hp`. A press whose cost would leave him under 1 HP is refused with the shared deny tick and the HP bar blinks. Spent HP adds to the debt, which is capped at 40% of max HP; HP spent past the cap is gone for good.
- Winning back: each foe a blow of his lands on (any source of his, at most 3 foes a blow; a blow is one swing, and a cast or a Hunt counts as one) returns 2.5% of max HP from the debt to his HP, a crit 5%, a kill 5% more. Summon and damage-over-time hits return nothing.
- Fading: after 3.0 s with no blow landed, the debt fades at 5% of max HP a second.
- The debt never reaches past the empty part of the bar: a heal that fills the bar (a chest, a new wave) shrinks it.
- Forfeit: any blow that takes his HP (the shared `hurt` event) clears the whole debt. A blow he blocks does not: what bleeds through his guard joins the debt.
- Blood Answer: a parry wins back the whole debt at once (below).
- The debt lives in his seat memory (`rememberPerSeat(objectMemory(brannoc))`) so a guest's HUD reads its own.
- Kit events: `debt` with `change` (`spend`, `repay`, `fade`, `forfeit`) and `amount`.

HUD: his HP bar gets a debt segment, a `#hpDebt` element in the HP track right after the fill, width `debt / max HP`, filled `PAL.rage[2]` with a one-pixel `PAL.rage[4]` edge. It brightens for 0.1 s on each repay, pulses slowly while fading, and on a forfeit flashes white for 0.08 s and breaks into four shards that drop out of the bar over 0.2 s. A one-pixel tick on the HP track marks 35%. Both show only for him (hidden for other kits). He has no second bar; the MP and ST bars stay.
On the stage, each repay draws two or three crimson motes from the struck foe into his chest over 0.25 s (`SPARKS.rage`).

## Controls

The shared moveset (`docs/moveset-design.md`).

| Key | Brannoc |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | One jump of the shared height. No double jump |
| S | With W, drop through a ledge |
| J tapped | Axe string: Hew, Reave, Cleave, the same every time. In the air, Hatchet Drop, once per airtime |
| J held | The Hunt, his warp: the great axe hurled into a foe, and him after it with a chop |
| K | Guard, held; a parry, Blood Answer, when pressed just as a blow lands |
| L | The shared front dodge |
| I | Selected ability, paid in HP: Frenzy, War Cry, Red Crescent, or a spell skill. I held: the wide form |
| O | Switch ability |
| U | Special: Berserk (shared charge and MP rules) |

Touch buttons read Axe, Jump, Dodge, Guard, Ability, Switch and Special, with icons in `brannocArt.ts`; nothing has to be held that a key does not hold.
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

## J held: the Hunt

His warp, on the shared numbers (`WARP` and `COST.warp` in `src/constants/combat.ts`): the same cost, recharge, reach and arrival power as every hero's.

- He winds the great axe up over his far shoulder and hurls it two handed at the nearest foe ahead (from the air, at a foe below), spinning end over end with a crimson blur behind its head (`drawThrownAxe`).
- It bites into the foe, and he leaps after it and rips it out with the Hunt chop: the shared arrival power, on the shared arrival box, heavy on a foe caught winding up, so it breaks a minion's wind-up.
- The chop is one of his axe blows, so it repays the debt like any blow, and his attack skills (Executioner's payoff, Blood Pact's crits) reach it.
- His extra: the axe ripped out of the foe wins back 5% of max HP more from the debt (`HUNT.repay`), with the motes from the foe.
- Each Hunt emits the shared `warp` and the kit event `hunt` with its foe, whether he threw from the air and where he threw from, for Long Hunt's Wolf's Road and Blood Trail.
- Long Hunt shapes its numbers through the warp's `tune`, and Headlong strikes the foes round where he lands, staggers and drags them in front of him.
- Look: the wind up and the two handed hurl (`HUNT_THROW_CLIP`), both hands out after the axe while it flies (`HUNT_WAIT_CLIP`), then the chop from the moment the axe is buried.

## K: guard and Blood Answer

- Held, he takes blows from the front on the haft, held flat across his chest (`BRANNOC_GUARD_CLIP`).
- The worst block in the roster: half the blow bleeds through (`BRANNOC_GUARD.chip`) and each block costs 25 stamina.
- What bleeds through goes into the debt like HP he spent, and the debt he owed stays, so a block never forfeits it.
- A blow from behind still lands.
- The parry, Blood Answer, is the strongest reward in the roster: the whole debt comes back into his HP at once, out of the foe he turned aside, and Frenzy starts for free for 3 s (`BLOOD_ANSWER`), longer with Forebear.
- Look: a crimson burst from the forearm, a crimson floor ring and a short roar on top of the shared parry flash.

## I: Frenzy

- His first ability on I. Costs 12% of max HP into the debt. No stamina, no MP.
- 0.27 s activation: he draws the axe edge across his forearm, a crimson burst of eight sparks from the arm and a short roar (`sfx.tone(90, 220, 0.09, "sawtooth", 0.05)`). Works on the floor and in the air.
- For 4.0 s: `attackRate()` gains another +20%, each repay is 1.5x, and his kit's `steadfast()` returns true, so a blow takes its HP with no knockback, flinch or combo reset. The blow still forfeits the debt.
- After Frenzy ends it waits 2.0 s; its tab shows the run and the wait as one recharge, and I casts the next ready ability meanwhile.
- A parry's Blood Answer starts it for free, whatever its recharge.
- Look while Frenzied: a 1 px crimson outline pulses on his sprite and his breath shows as red steam from the mouth every 0.4 s.
- Kit event `frenzy` with `on`.

## Abilities on I (HP), switch on O

Frenzy (above), War Cry and Red Crescent from the start, then his spell skills, each with its own recharge on the shared ability bar.
All cost HP into the debt and emit the shared `cast` with their ability id; Frenzy emits `frenzy` instead.

- War Cry: 8% max HP, 10 s recharge. 0.3 s roar with the head thrown back. Minions and elites within 64 px take 0.5x AP + 0.2x AD and are staggered 0.5 s; every foe within 64 px is marked (`markFoe`, +20% from all sources, 6 s). Mini bosses and bosses take the damage and the mark only. Look: three expanding crimson arcs from his mouth and a 1 px screen shake.
- War Cry held: 12% max HP, it reaches 1.6 times as far.
- Red Crescent: 10% max HP, 4 s recharge. An overhead swing throws a crimson crescent 150 px along the floor at 280 px/s that passes through foes, 0.9x AD + 0.6x AP to each. Each foe it strikes repays the debt like a blow. Look: a 14 px tall crescent in `PAL.rage[3]` with a `[5]` core and a trail of drips.
- Red Crescent held: 15% max HP, a crescent each way.
- Held with HP for the plain form only, the plain form goes.

The shared ability tabs (FRENZY, CRY, CRESCENT, GEYSER, AXE and PACT) show the selected one with its HP cost as a share of max HP ("CRY 8%"), each one's recharge, and strike a tab through while his HP cannot pay for it.

## U: Berserk

Shared charge levels and MP costs.

- On release: a 0.35 s roar with arms wide and the axe raised, a 48 px crimson ring that pushes minions out to 56 px, and the scene edges tint crimson (15%). He is untouchable through the roar.
- Then Berserk for 3, 4, 5 or 7 s by charge level: Deathless (a blow can leave him at 1 HP but never below, and Last Light is not spent), no flinch (`steadfast`), +40% attack rate, repays doubled, and the debt does not fade.
- When it ends: Last Cleave, an automatic full spin, a ring of 60, 80, 100 or 130 px for the level's power x 0.3 x (AD + AP), knocking minions down and elites over, screen shake 4 px. Untouchable through the spin.
- New shared seam: an optional kit hook `hpFloor?(): number` in `HeroKit`. `hurtHero` clamps HP to it before `lastLight()`. Left out it is 0, so every other hero is unchanged.
- The ultimate skill Berserk (`b_berserk`) upgrades it through `ultimateValues()`: kills make it last longer, Last Cleave strikes harder, wider and up to three times, the roar stuns, repays grow, and the last strike wins back the whole debt. Evolved, World Ender splits the floor across the stage on every strike.

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
| b_hunt | Long Hunt | movement, timed, J held | the Hunt's chop 2.4x AD | power from distance; chop launches; hunted foe marked; two Hunts in a row; 6 MP | Wolf's Road (b_wolves): each Hunt sends a red wolf down the lane |
| b_headlong | Headlong | movement, easy, J held | the Hunt's landing strikes foes within 30 px, 0.5x AD | staggers minions; drags them in front of him; reaches 45 px; drags elites; the hurled axe cuts what it passes | Juggernaut (b_reaver): the landing reaches 60 px and throws minions up |
| b_bloodTrail | Blood Trail | movement, timed, J held | the Hunt leaves a 2 s trail from where he threw to where he lands, 0.2x AD every 0.5 s | slows; longer; bleeds; repays on kills | River of Red (b_hemorrhage): the trail spreads to 3 s and bursts at its end |
| b_geyser | Blood Geyser | spell, easy, I, 8% HP | a pillar erupts under the nearest foe within 120 px, 1.0x AP + 0.4x AD, launches | a second pillar; wider; marks; repays per foe | Blood Fountain (b_pact): three pillars, each repays the debt |
| b_axeThrow | Hurled Axe | spell, easy, I, 10% HP | a hand axe flies 160 px and returns, 0.7x AD each way | pierces; bleeds; a second axe; returns through him repaying debt | Twin Fangs (b_spinningReap): two axes orbit him for 3 s |
| b_pact | Blood Pact | spell, precise, I, 20% HP | 5 s: crit +25%, crits repay double | the first Bloodied blow is a sure crit at 2x; longer; Fury +0.1; no fade | Oathbound (b_executioner): every kill in the pact extends it 1 s |
| b_bleed | Open Wounds | dot, easy, auto | string blows stack a bleed, 0.08x AD a second per stack, 5 max | 8 stacks; spreads on death; faster ticks; Cleave adds 2 | Bleed Dry (b_sunder): Cleave consumes every stack as one hit |
| b_rend | Rend | dot, timed, J | Cleave rends: 3 heavy stacks | Hew rends; longer; stacks slow; wider | Flay (b_heavyHew): rended foes take +30% from Hew |
| b_hemorrhage | Haemorrhage | dot, precise, auto | Bloodied blows plant a mark that bursts after 2 s for 1.5x the damage stored | repays on burst; spreads; shorter fuse; mini bosses | Red Bloom (b_redEdge): bursts chain to the next foe |
| b_wolves | Blood Wolves | summon, easy, on kill | 15%: a red wolf spirit lunges at the nearest foe, 0.8x AD | two wolves; bites bleed; 30%; wolves stay 3 s | Blood Pack (b_ravens): every kill while Bloodied calls a wolf |
| b_ancestor | Forebear | summon, timed, K (and Frenzy) | a ghostly forebear stands beside him through Frenzy and swings on every third blow and on each parry, 1.0x AD | every second blow; cleaves both sides; Blood Answer 2 s longer; staggers and marks; outlasts Frenzy 2 s | Host of Forebears (b_berserk): three forebears through Berserk |
| b_ravens | Carrion Ravens | summon, timed, on hurt | 40%: two ravens strike the foe that hurt him, 0.6x AD | blind it 1 s; four ravens; 60%; they repay on hit | Carrion Storm (b_axeThrow): a cloud that circles him for 4 s |
| b_scarred | Scarred Hide | passive, easy | debt cap +10% of max HP | fades 25% slower; Bloodied at 40%; Fury +0.1; Bloodthirst heals 4% | Thousand Scars (b_ancestor): a blow forfeits only half the debt |
| b_berserk | Berserk | ultimate, timed, U | Last Cleave 1.3x; each kill in Berserk adds 0.5 s | strikes twice; wider; the roar stuns; repays triple; wins back the whole debt; strikes three times | World Ender (b_bloodTrail): every strike splits the floor across the stage |

Ultimate budgets follow the skill design rule (level 8 about 6x the special, evolved about 15x).
Every skill and evolution gets a code-drawn icon on a dark crimson disc with a bone rim, the axe and blood shapes bold enough to read at card size.

Kit events declared in `src/types/brannoc.ts`: `debt`, `frenzy`, `hunt` (his warp landed), `bloodied` (with `on`) and `berserk` (with `on` and `level`). The shared `cast`, `jump`, `warp`, `dash`, `parry` and `hurt` come from the shared moves.

## Look

Shared rig, heavy build, his own skin in `src/constants/characters/brannoc/look.ts`.

- Pale weathered skin, a wild ash-blond mane in ragged, streaked locks with two thick braids on the ponytail rope, a short braided beard, and a bone-white war paint band across both eyes.
- Bare scarred chest under a dark wolf-fur mantle on the shoulders and a short ragged wolf pelt hung from the back of the belt in place of coat tails (`src/game/hero/draw/furTails.ts`), so the legs stay clear, iron bracers bound in bone-coloured cord, a wide leather belt with an iron buckle, dark trousers and fur-wrapped boots.
- The great axe (`src/game/hero/draw/greatAxe.ts`): a long dark ash haft wrapped in bone cord at both grips, a wide bearded iron head with a pale edge and a crimson glint along it for two frames after each blow lands. Held two-handed at the clip's blade angle; in walk and run it rests on the near shoulder so it never cuts through the body.
- Bloodied: the war paint glows `PAL.rage[4]`, his eyes become two crimson pixels, and red steam rises from his shoulders every 0.5 s.

New ramp in `src/constants/palette.ts`: `PAL.rage` (`#1a0508`, `#4a0c14`, `#8e1424`, `#d0283a`, `#ff6a5a`, `#ffd8c8`) and `SPARKS.rage` from it (`#ffd8c8`, `#ff6a5a`, `#d0283a`, `#8e1424`). `SPARKS.blood` stays for the shared hurt.
His own clips in `src/constants/clips/brannoc/`: the stance, the idle and the Bloodied idle, every blow, Frenzy, the Hunt's throw and its wait, his guard, War Cry, Red Crescent, the spell cast, the charge, the Berserk roar and Last Cleave. Walk, run, jump, fall, the dodge, hurt and death use the shared clips through the motion layer.

## Achievements

- `heroTrial("brannoc", "Brannoc")`: clear wave 10 with him, 40 coins.
- On the Edge (Skill, 60 coins): "As Brannoc, defeat 30 foes while Bloodied in one run." Tracked stat `bloodiedKills`, the best of a run, through `src/utils/trackedStats.ts`.
- Achievements go from 33 worth 2,470 coins to 35 worth 2,570; update `docs/achievements.md`.

## Shop items (docs/meta-progress.md)

Vitality: his HP, which is also his resource pool. Honed Edge: every axe blow, the Hunt chop, Hatchet Drop, Red Crescent and Last Cleave. Arcana: War Cry, Red Crescent, his spells, the ability power dots and Last Cleave. Wellspring: MP for the Hunt and Berserk. Precision: every hit, and crits repay double. Light Boots: walk, run and the dodge. Endurance: the dodge and his guard. Aftershock: every Hunt landing. Lodestone, Head Start and Last Light work in shared code (Berserk's Deathless keeps Last Light unspent).
Add his paragraph to `docs/meta-progress.md` and his Aftershock line to the shop list.

## Co-op

The debt, its fade timer, Frenzy and its wait, Berserk and his abilities' recharges live in his seat memory (`rememberPerSeat(objectMemory(...))`), so a guest's debt segment and tabs read his own; the selected ability is the shared bar's, per seat too. Fury reads each seat's own HP. His rings, crescents and summons are host-side effects.

## What stays unchanged

The other nine heroes' kits, numbers and clips. `PACE`, the combo layer and the beat clock.
Shared seams added for him, each a no-op for every other hero: the `hpFloor` kit hook and the HP bar's debt segment and 35% tick (hidden for other kits).
Saves: coins, shop levels, unlocked heroes and options load as before; `bloodiedKills` starts at 0 in an old save; Brannoc appears locked at 2450 coins.
The playtest folder is untouched.

## How it fits a run

Early, he plays as a slow heavy hitter who gets stronger as foes chip him. A skilled player spends HP on Frenzy and War Cry before a crowd, sweeps it with Reave and Cleave to win the debt back, parries into Blood Answer to win it all back at once, and lives Bloodied on purpose for the double Cleave, Bloodthirst and the precise skills. Berserk is his answer to the Rift Warden and the Abyss Sovereign: seven seconds where he cannot fall.

## Where the build differs from the plan

- Slows: the cards that slow (Reaver, Rend, Blood Trail) use the shared chill, which halves a foe's pace, so they say "slowed for N s" and give no percentage.
- Reaver level 1 also adds 20% to Reave, so its first card is worth taking on its own.
- Forebear's sixth level makes its swing stagger and mark minions: foes in this game have no taunt to aim them at a summon.
- Forebear sits on K: a parry's Blood Answer starts a Frenzy, which calls it, and each parry makes it swing. Frenzy on I calls it too. Blood Wolves and Carrion Ravens are automatic.

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

### On the shared moveset

From wave 1, one run each, on the core branch before his rework and on his branch after it.

| Policy | Before | After |
| --- | --- | --- |
| Mash | wave 5, level 5, 14 kills, 102.2 s | wave 5, level 5, 14 kills, 102.2 s |
| Skilled | wave 5, level 6, 16 kills, 91.3 s | wave 5, level 6, 18 kills, 106 s |

The mash bot only walks and presses J, so it plays him the same way on both.
The skilled bot uses the Hunt, the dodge, his abilities and Berserk, kills more and lasts longer, and still falls on wave 5, as every hero's bot does there; it never guards, so Blood Answer is not in its numbers.

## Note for the owner

A skilled bot policy for Brannoc would press I for Frenzy before a crowd, string J into it, hold J at a foe out of reach, tap K into a wind-up for Blood Answer, and press U when Bloodied.
The mash bot never spends HP, so it measures him as a plain heavy hitter with Fury from the HP foes take.
