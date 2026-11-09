# Wenna, the lamplighter

The seventh hero and the fourth one built in the hero sprint (patch 0.7.0).
Id `wenna`, kit `wenna`, name Wenna, title "The lamplighter".
Blurb: "She walks the rift's dark roads with a hooked lamp and a satchel of candles. Every candle she lights stands up and fights for her. Weak alone, never alone."
Price: 1000 coins in `src/constants/heroUnlocks.ts`, the fifth price by the rule written there.
Accent `#b48cff` (lamp violet). No other hero uses a violet accent.

Code layout follows Mirel and Orrin: kit `src/game/hero/wenna/`, character `src/constants/characters/wenna/` (index, look, skills), numbers `src/constants/wenna/`, clips `src/constants/clips/wenna/`, types and kit events `src/types/wenna.ts`, skill behaviours `src/game/skills/wenna/`, icons `src/ui/skills/icons/wenna/`, touch icons `src/ui/touch/icons/wennaArt.ts`, Wax bar `src/ui/waxBar.ts`, design note `docs/wenna-design.md`, skill tables `docs/skills/wenna.md`.

## How she differs from every hero in the game

- Kael (warp swordsman): runs, double jumps, dashes through foes, teleports to a thrown pick and strikes. His summons are chance procs from skills. Wenna's minions are her base kit and most of her damage. Her one teleport needs a Wick at the far end and leaves that Wick where she stood, so it moves a body into danger to get her out.
- Ysra (planted glaive, brace and parry, Heat): defends from the front with her own weapon. Wenna cannot block or parry. Her Wicks stand in front of her and take the blow.
- Sable (ranged hunter, ammo and reload): deals her damage herself from 250 px with aimed bolts. Wenna's damage comes from bodies spread across the stage, and she aims it by striking a foe up close with her lamp.
- Hulda (unarmed grappler, armour, grabs): walks into blows behind her own armour. Wenna has no armour. Her protection is outside her body and dies.
- Orrin (chain dancer, pendulum swing, Momentum): wants constant speed through the air. Wenna walks slowly, does not run, and stays behind a line of her Wicks.
- Mirel (time mage, Stillfield, echoes, Rewind, Sand refilled by waiting): controls how fast foes act. Wenna controls where foes stand by holding them with bodies. Her resource is earned from kills and collected, the opposite of Mirel's waiting.

Axes that differ:
- Movement: slow walk with no run, one jump, and Swap, a trade of places with a Wick.
- Defence: Wicks hold ground foes in place and intercept blows aimed at her.
- Resource: Wax, which drips from foes that die and flies to her when she is close. A slow trickle keeps her from ever being stuck.
- Range: her lamp is short (30 px), her reach is wherever her Wicks stand.
- Attack shape: indirect. Her own blows mark a Quarry and every Wick converges on it.

## Stats

`base: { ad: 6, ap: 11, hp: 92, mp: 100, stamina: 100, crit: 0.05, move: 0.9, aspd: 1, haste: 1 }`, `growth: { ad: 0, ap: 0, hp: 1.0, mp: 0.3 }`, `comboHits: 3`, `special: "greatWick"`.
Her own AD is the lowest in the roster on purpose. Her damage per second with two or three Wicks out should match Mirel's.

## Controls

| Key | Wenna |
| --- | --- |
| A / D | Walk, about 60 px/s. No run; a double tap does nothing |
| W | One jump of 48 px. No double jump |
| S | With W, drop through a ledge. Held with K, lights the Wick at her feet |
| J | Lamp string: Tap, Swing, Flare. In the air: Lamp Drop, one per airtime |
| K | Light a Wick (Wax) |
| L | Swap with a Wick |
| I | Selected ability: Kindle, Beckon, or a spell skill (MP) |
| O | Switch ability |
| U | Special: Great Wick (shared charge and MP rules) |

Touch buttons read Lamp, Jump, Light, Swap, Ability, Switch and Special, with icons in `wennaArt.ts`. The stick held down while pressing Light lights the Wick at her feet, like S. The Controls screen lists every key above.

## Wicks, her minions

A Wick is a wax figure about 12 px tall with a violet flame for a head.

- HP: 30% of her max HP, so about 28 at the start and more with Vitality. A health pip row of 3 px shows above a Wick only after it is hurt.
- Life: 18 s. The flame and the wax body visibly shrink over the last 6 s so the timer reads without a number.
- Cap: 4 Wicks per Wenna at base.
- Bite: every 0.8 s the Wick bites the foe it is after if the foe is within 24 px ahead and up to 30 px above (a small hop). 0.4x AP, knockback 20, can crit through `dealDamage`. Wick bites count as source `abilities` and give no Flow, so a crowd of Wicks cannot farm Flow. If the shared damage options have no switch for Flow, add one optional flag.
- Target: the Quarry if she has one and a Wick can reach it, else the nearest foe within 140 px of the Wick, else it stands guard 12 to 24 px in front of her, on the side of her nearest foe.
  With two or more Wicks out, the one nearest her is her guard: it only goes after ground foes within 40 px of her, and bites fliers from its post.
- Walk: 55 px/s, scaled by her move stat. A Wick walks on the floor or platform it stands on and hops up to a platform or floor up to 50 px above toward its target, or drops down to any lower one. With no route it goes back to her.
- Hold: a ground foe of rank minion that walks into a Wick stops at the Wick's front edge. While held, the foe burns the Wick for the foe's own contact damage once a second. Elites, mini bosses and the Rift Warden push through: the Wick is knocked back 20 px and takes double that contact damage. Fliers pass over Wicks.
- Intercept: through `absorbHurt(dmg, fromX)`. When a blow or shot is about to land on her and a Wick stands within 20 px of her on the `fromX` side, the Wick takes the full damage after her `hurtScale` and she takes nothing (return true). A shot that lands from straight above (its `fromX` within 4 px of her) may be taken by a Wick on either side. The nearest such Wick takes it. One Wick intercepts at most once each 0.3 s so a fast flurry still reaches her through a single Wick.
- End: at 0 HP or when its life runs out, the Wick melts into a puddle with a curl of smoke over 0.4 s and emits the kit event `wick` with `lit: false`.
- Wave start: if she has no Wick at the start of a wave, two light for free at her side, so every wave opens with bodies in front of her.
- A new run clears every Wick. A downed or departed Wenna's Wicks melt at once.

## Wax (WX bar)

Second bar under stamina, label WX, same HUD slot as MO, GR, QV and SD (`src/ui/waxBar.ts`, called from `hud.ts`), filled in the wax ramp with a violet edge.
- 0 to 100, a run starts at 60.
- Trickle: 3 Wax a second, always.
- Drips: a foe killed by her or by any of her Wicks or skills leaves a wax drip: 10 Wax for a minion, 20 for an elite, 40 for a mini boss. A drip flies to her when she is within 80 px and lies on the floor for 6 s otherwise, blinking for the last 1.5 s. Lodestone pulls drips like it pulls other pickups if the shared pickup code makes that simple; otherwise leave it.
- No skill or charm turns Wax into damage directly; skills change costs, refill and drip value.

## K: Light a Wick

- Cost 25 Wax. With under 25 the press is denied with the shared deny cue.
- On the floor: a 0.25 s cast. She swings the lamp forward and a drop of violet flame arcs to the floor 20 px ahead (at her feet with S held). On landing, wax pools and the Wick rises over 0.35 s; it cannot be hit and does not bite while rising.
- In the air: the drop falls straight down to the floor under her.
- At the cap, K relights the weakest Wick instead: back to full HP and full life for 10 Wax, with a flame burst on it.
- Emits the kit event `wick` with `lit: true`, `x`, `y`.

## J: the lamp string

Clips at 30 fps like every hero. Each blow carries on within 0.35 s of the last.

| Blow | Frames | Hit on | Reach | Power | Knockback | Extra |
| --- | --- | --- | --- | --- | --- | --- |
| Tap | 9 | 4 | a straight jab of the lamp pole 8 to 30 px, 10 px tall | 0.8x AD | 40 | stagger 0.25 s |
| Swing | 11 | 5 | an arc of radius 30 from low ahead to level | 0.9x AD | 60 | |
| Flare | 15 | 7 | she opens the lamp's shutter: a violet flame cone 12 to 46 px ahead, 30 degree half angle | 0.6x AD + 0.6x AP | 90 | hit-stop 0.04 s; every Wick within 100 px of the Flare's first foe bites it at once, outside its own timer |
| Lamp Drop (air) | 10 | 4 | a downward swing ahead, radius 26 | 0.8x AD | 70 down | one per airtime |

Quarry: the last foe any of her J blows hit becomes her Quarry for 4 s. A small violet lamplight ring hangs over its head and pulses. Every Wick that can reach it goes for it, and Wicks bite the Quarry every 0.55 s instead of 0.8 s. A new J hit moves the Quarry. When the Quarry dies the mark ends.

Animation beats (to `docs/motion-standard.md`):
- Tap: 2 calm frames drawing the pole back at the hip with the lamp swaying behind, snap to full extension on frame 4, 3 frames of follow-through as the lamp swings past the pole tip on its chain, settle.
- Swing: crouch with the pole low behind, one sweep with a 3 frame violet arc smear, the lamp keeps swinging 2 frames after the pole stops.
- Flare: 4 calm frames bringing the lamp to chest height two-handed, shutter open on frame 7 with a flash and the cone, 2 px shake, a ring of violet sparks, 4 frames as the shutter closes and the lamp dims.

## L: Swap

- She trades places with the Wick farthest ahead in her facing within 160 px. With none ahead, the nearest Wick in any direction within 160 px. With no Wick in reach the press is denied.
- 15 stamina, 1.0 s cooldown.
- Both vanish in a puff of violet smoke and appear at the other's spot after 0.08 s. A thread of flame joins the two spots for 3 frames. She cannot be hit from the press until 0.15 s after arrival.
- The Wick arrives where she stood with a flare: 0.6x AP to every foe within 24 px, knockback 60 away from it.
- A blow or shot that would have reached her in the first 0.1 s counts as a perfect dodge (`rewardPerfectDodge()`, once per Swap).
- It calls `travelEnded()` and emits `dash` with `dir` the direction she moved, plus the kit event `swap` with `from`, `to` and the Wick.
- Look: her sprite and the Wick each leave a 2 frame afterimage in the violet ramp; the lamp leaves a short streak.

## Abilities on I (MP), rotation on O

Kindle: 16 MP, 3 s recharge.
- The Wick nearest her within 120 px bursts: 2.0x AP to every foe within 36 px, knockback 100 outward and up 60, 3 px shake, 0.05 s hit-stop.
- The Wick is spent. She gets back half its cost (12 Wax).
- With no Wick in reach it fizzles and costs half.
- Look: the Wick's flame swells over 0.15 s (anticipation), the body cracks, a violet and gold burst with wax droplets flying, a scorch ring on the floor.

Beckon: 12 MP, 6 s recharge.
- Every Wick within 200 px drops what it is doing and hops to stand in a ring around her for 2 s, taking 50% less damage. Wicks keep biting foes that come within reach.
- Use it to pull a screen of bodies to her when she is swarmed.

Both emit `cast` with ability `kindle` and `beckon`. The HUD ability tab and the touch Ability button show the selected one and its recharge, as for Mirel and Orrin.

## U: Great Wick

Shared charge levels.
- 0.3 s anticipation: she plants the lamp pole, wax pools outward from its foot, the flame inside the lamp roars.
- A giant Wick, about 48 px tall, rises out of the pool over 0.3 s.
- At 0.6 s it swings one great arm in an arc across the level's reach: every foe in reach takes the level's power as a multiple of AP, knockback 160 and up 120, 5 px shake, 0.08 s hit-stop.
- It then melts over 0.4 s into new Wicks: 1, 2, 3 or 4 by charge level, allowed up to 2 past her cap; these extra Wicks live 8 s.
The ultimate skill `w_thousand` replaces it.

## The 20 skills

Ids prefixed `w_`. Budgets follow `docs/skill-design.md` as Mirel's did. Kinds: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
The developer sets level tables to the contract (four or more new properties across the seven level ups, level 8 about 6 to 12 times level 1, dot and summon up to 25 times) and records them in `docs/skills/wenna.md`.

| Id | Name | Kind, risk, button | Level 1 | Properties added along the levels | Evolution (partner) |
| --- | --- | --- | --- | --- | --- |
| w_quarry | Hunting Call | attack, easy, J | Quarry lasts 6 s, bites on it +10% | her blows chill the Quarry; a Quarry's death passes the mark to the nearest foe; Wicks walk 30% faster toward it; two Quarries at once; bites on it +60% | Pack Law (w_tallow): every foe she hits becomes a Quarry, Wicks split between them, bites on Quarries +100% |
| w_fangs | Bright Fangs | attack, easy, auto | Wick bites +30% | bite reach +8 px; bites knock minions back; every third bite of a Wick hits twice; bite every 0.6 s; +90% | Blue Flame (w_singe): every bite also strikes the next foe behind its target and adds 2 Singe |
| w_flare | Open Shutter | attack, timed, J third blow | Flare +30%, cone +8 px | Flare ignites (shared `ignite`); a kill by the Flare lights a free Wick; cone 60 px; each Wick within 100 px repeats the Flare from where it stands at 0.4x; +80% | Lighthouse (w_lampVolley): the Flare becomes a 160 px beam and every Wick fires one too |
| w_packLunge | Pack Lunge | attack, precise, J on a Quarry with 3 or more Wicks within 40 px of it | the blow sends every Wick near it lunging at the Quarry, 1.2x AP each, payoff on the Quarry only | lunges stun 0.4 s; lunges crit; works with 2 Wicks; lunging Wicks heal 20%; 2.4x | Feeding Frenzy (w_quarry): each lunge strikes three times and a kill by a lunge relights every Wick |
| w_gutter | Guttering | attack, timed, a Wick ends | a Wick that dies or burns out bursts for 0.4x AP in 24 px | 32 px; the burst launches minions; each burst leaves 5 Wax; burst chills; 1.6x | Wildfire (w_kindle): bursts at 2.5x leave a 2 s fire on the floor |
| w_kindle | Chain Kindle | attack, timed, I Kindle | Kindle +25% and refunds all of the Wick's Wax | Kindle radius +10 px; Kindle chains to one more Wick within 40 px at 0.6x; Kindle stuns 0.5 s; the next Wick lit after a Kindle costs nothing; +100% | Bonfire (w_gutter): Kindle leaves a bonfire for 3 s where Wicks bite twice as fast |
| w_swap | Changeling Step | movement, timed, L | Swap range 220 px, the arriving Wick's flare +50% | a second Swap charge; untouchable 0.3 s; foes on the line between take 0.6x AD; perfect-dodge window 0.2 s; the swapped Wick heals full | Mirror Wick (w_procession): every Swap also lights a free Wick where she arrives, if under the cap |
| w_hop | Wick Hop | movement, timed, W | in the air above a Wick, W jumps again off its head, once per airtime | the hopped Wick flares for 0.6x AP; two hops; higher hops; Lamp Drop after a hop +60% | Candle Stair (w_fangs): no hop limit while over Wicks and each hop makes that Wick bite at once |
| w_procession | Procession | movement, easy, walk | she walks 5% faster for each Wick lit | idle Wicks walk beside her; Wicks walk 30% faster; Wicks lose life at half rate while she walks; Wick cap +1 | Vigil March (w_waxPool): Wicks walking beside her leave wax that chills foes |
| w_lampVolley | Lamp Volley | spell, easy, I | 18 MP, 6 s: every Wick spits a flame bolt at the Quarry or its nearest foe, 1.0x AP | two bolts each; bolts pierce one foe; bolts ignite; 6 s to 4 s; 1.8x | Starfire (w_flare): bolts curve to foes and burst for 24 px |
| w_waxPool | Wax Pool | spell, timed, I | 20 MP, 8 s: a pool 70 px wide on the floor ahead for 5 s; foes on it chilled; Wicks on it heal 4 HP a second | 90 px; foes on it take 0.3x AP each 0.5 s; Wicks on it bite 25% faster; 8 s; two pools | Hearth (w_procession): the pool follows her and covers 140 px |
| w_effigy | Wax Effigy | spell, timed, I | 24 MP, 10 s: a tall effigy 40 px ahead lures ground minions within 90 px (reuse Sable's `lure`), stands 4 s, then bursts 0.8x AP in 40 px | lure 130 px; Wicks near the effigy bite 30% faster; the effigy holds foes like a Wick; burst ignites; 3.0x | Martyr's Light (w_gutter): the effigy's burst lights two free Wicks |
| w_singe | Singe | dot, easy, auto | Wick bites add 1 Singe (0.05x AP a second, 6 max, 3 s) through `addStacks` | her own blows add stacks; 10 max; Singed foes take 10% more from Wicks; 0.22x; 5 s | Ashfall (w_hotWax): a foe at max stacks bursts, consuming them for 1.2x AP each to foes within 30 px |
| w_hotWax | Hot Wax | dot, timed, K | a Wick landing splashes foes within 24 px with 2 Hot Wax stacks (0.15x AP a second, 4 s) | splash 32 px; splashed foes chilled; relights also splash; Swap arrivals splash; 0.35x | Candlemaker (w_singe): splashed foes that die drip double Wax |
| w_smoulder | Smoulder | dot, timed, L | both ends of a Swap burn for 2 s, foes there gain Smoulder (0.2x AP a second, 3 s) | 3 s; the flame thread between the ends burns too; burn 32 px wide; spreads on kill; 0.45x | Pyre Path (w_swap): each Swap leaves a burning trail along the thread for 4 s |
| w_lampflies | Lampflies | summon, easy, on a J hit | 15%, cooldown 2 s: three lampflies dart at foes, 0.3x AP each | 25%; five lampflies; they chill; they stay 5 s circling her; 0.8x | Lantern Swarm (w_lampVolley): every cast on I sends a swarm too |
| w_twinWick | Twin Wick | summon, timed, on K | 20%: a second Wick lights beside the first, allowed past the cap, lives 6 s | 35%; the twin bites 30% faster; twin lives 10 s; two twins; 55% | Candelabra (w_tallow): every K lights three Wicks |
| w_ghost | Remembrance | summon, timed, on a Wick's end | 25%, cooldown 2 s: a ghost candle rises for 4 s, firing a bolt every 0.6 s at 0.5x AP | 40%; bolts pierce; 6 s; two ghosts; 1.2x | Vigil of the Lost (w_hotWax): every ended Wick leaves a ghost whose bolts add Hot Wax |
| w_tallow | Deep Tallow | passive, easy | Wax max +20, trickle +25% | Wick cap +1; Wick HP +25%; Wicks cost 5 less; Wick cap +2 in total; trickle +60% | Eternal Flame (w_twinWick): Wicks never burn out on their own |
| w_thousand | Thousand Candles | ultimate, timed, U | replaces Great Wick: a field of candles rises across the reach, each foe takes the level's power, then every Wick she has flares for 0.5x of it | every Wick becomes a Great Wick for 3 s; candles knock up; leaves 4 Wicks; 1.5x | Night of Lamps (w_tallow): the whole stage fills with candles, every foe takes the hit three times, about 15 times the special |

Ultimate budget: level 8 about 6 times Great Wick, evolved about 15 times.
Kit events declared in `src/types/wenna.ts`: `wick: { x; y; lit; cause }`, `swap: { from; to }`, `quarry: { foe }`, `kindle: { x; y; foes }`. The shared `cast`, `jump`, `dash` and `perfectDodge` are emitted as for Mirel.

## Look

Shared rig with her own skin in `src/constants/characters/wenna/look.ts`:
- olive skin, short dark auburn hair under a deep hood;
- a long ash-grey cloak with violet lining and pale wax drips along the hem, its tails drawn with the existing coat tails code;
- a satchel of candles at her hip with three candle tips showing;
- dark trousers, wrapped shins, soft boots;
- the lamp pole: dark wood, 30 px, with an iron hook at the top and a small square lantern (5 px) hanging on a 3 px chain that swings with her motion. New drawer `src/game/hero/draw/lampPole.ts`. The lantern's light is a small `lights.add` that follows it, brighter while a Flare is open.
Every colour runs deep shadow to glint like the other skins.

New `PAL.wick`: `#1a0f2e`, `#3a1f5c`, `#6a3aa0`, `#a46ae0`, `#d8b4ff`, `#f8eeff`, and `SPARKS.wick` from it, for the Wick flames, the Flare, Swap, Kindle, the Quarry ring and the WX bar edge.
Wax colour `WAX` (in the palette file beside `SAND`): `#5a4a3a`, `#a8947a`, `#e8dcc4`, `#fff8e8`, for Wick bodies, drips and the WX bar fill.
Wick sprite: ivory wax body with a darker base, two stubby arms, two dark dot eyes under a flame head that flickers between three shapes with a gold core pixel. Walk: a 2 frame waddle. Bite: lean in, the flame stretches forward and flashes. Hurt: the flame gutters sideways for 3 frames. Death: melts into a puddle with a smoke curl.
Own clips in `src/constants/clips/wenna/`: idle (lamp swaying, cloak breathing), every blow, the K cast pose, Swap, both ability poses, the charge pose and both ultimates. Walk, jump, fall, hurt and death use the shared clips through the motion layer with a 20 px stride, carrying the pole upright so the lantern never sinks into the floor (the lesson from Mirel's staff).

## Achievements

- `heroTrial("wenna", "Wenna")`: clear wave 10 with her, 40 coins.
- Many Hands (group Skill, 60 coins): "As Wenna, let your Wicks defeat 40 foes in one run." Counted by a best-of-run stat `wickKills` in `src/utils/trackedStats.ts`, listed in `docs/achievements.md`. Kills by Wick bites, Kindle, Guttering bursts and Great Wick's melted Wicks count; kills by her own lamp do not.

## Shop items (docs/meta-progress.md)

Vitality: her HP, and Wick HP since it is a share of her max HP. Honed Edge: her lamp string and Lamp Drop scale with `progress.stats.ad`. Arcana: Wick bites, the Flare's AP part, Swap's flare, Kindle, the spells and the special scale with `progress.stats.ap`. Wellspring: abilities and the ultimate spend MP. Precision: every hit, Wick bites included, goes through `dealDamage`. Light Boots: her walk and her Wicks' walk scale with `progress.stats.move`. Endurance: Swap spends stamina.
Aftershock: each Swap arrival calls `travelEnded()`; add Wenna to the Aftershock line.
Lodestone, Head Start and Last Light work in shared code.

## Co-op

Wicks, Wax, the Quarry, the Swap cooldown and the selected ability live in kit seat memory (`rememberPerSeat(objectMemory(...))`); the Wick list is host-only data, the Wax value and Wick count are what a guest's HUD reads.
Each Wenna has her own Wicks and cap. Any Wenna's Wicks hold foes for every hero. A Wick intercepts blows only for the Wenna who lit it.
Wax drips go to the Wenna whose blow or Wick made the kill.

## What stays unchanged

The other six heroes' kits, numbers and clips. Shared foe behaviour outside the Wick hold. Saves: coins, shop levels, unlocked heroes and options load as before, and the new hero appears locked at 1000 coins. The playtest folder is untouched.

## Balance target

Run the playtest bots on this build from wave 1, one run each. Wenna's mash death wave must be within two waves of the others (they fall on 4 and 5). If she falls earlier, raise the free Wick at wave start to two before touching any number. Record both bot tables in the design note. The other six heroes must fall on the same waves with the same kills as the baseline.

## Note for the owner

The playtest bots have no Wenna entry. A skilled policy for her would press K whenever Wax allows, strike the nearest foe with J to set the Quarry, press I with Kindle when a Wick stands beside a crowd, and press L when a foe winds up in front of her with a Wick behind the foe.

## Bot balance check

Mash bot (`npm run playtest -- bot --hero all --policy mash`), one run each from wave 1, on this build.
The other six heroes fall on the same waves with the same kills as the 0.6.0 baseline.

| Hero | Baseline wave | Wave | Kills | Level |
| --- | --- | --- | --- | --- |
| Kael | 4 | 4 | 11 | 5 |
| Ysra | 5 | 5 | 18 | 6 |
| Sable | 5 | 5 | 18 | 6 |
| Hulda | 4 | 4 | 11 | 5 |
| Orrin | 5 | 5 | 18 | 6 |
| Mirel | 5 | 5 | 16 | 5 |
| Wenna, one free Wick at wave start | none | 3 | 6 | 3 |
| Wenna, two free Wicks at wave start | none | 3 | 9 | 4 |
| Wenna, after the QA fixes (Wicks guard in front of her) | none | 3 | 8 | 3 |

The mash bot only walks and presses J, so it never lights a Wick and fights with her lamp, the weakest blow in the roster, plus the free Wicks.
She falls one wave before Kael and Hulda, within the two-wave rule.
As the plan asks, the free Wicks at wave start went from one to two before any other number moved; that raised her kills from 6 to 9.
After the QA fixes her Wicks stand guard in front of her instead of chasing every foe, and the bot run ends on wave 3 with 8 kills; the other six heroes still match the baseline.
A stress run at wave 6, level 30, with all 20 skills at level 8 and then evolved, mashing every key, reached waves 9 and 10 with no page errors.

## As built

- A held foe burns its Wick for 7 times its wave power once a second, twice that for an elite, mini boss or the Warden, since foes have no shared contact damage value.
  A heavy foe's shove moves the Wick back 20 px and adds no damage of its own.
- Idle Wicks stand guard in front of her toward her nearest foe, and the Wick nearest her stays her guard, after QA measured that Wicks standing behind her took 2 of 12 blows in waves 3 to 5. With the change they took 13 of 21.
- She, her lantern and the Wick are hidden for the 0.08 s of a Swap while their violet copies hold the old spots, and the copies fade over two frames after both arrive; her lantern leaves a streak. The kit interface has a new optional hook, `heroAlpha`, for hiding the hero's sprite.
- The Quarry ring is 16 px wide, two pixels thick with a dark rim and a marker, and draws over the damage numbers through a new optional kit hook, `drawOver`, called after the numbers.
- Standing still against Glimmer Moths in wave 2 (QA's s3), she took 1 hit instead of 5 once the guard Wick stopped chasing fliers.
- A foe felled by the chip damage of a blocked blow now counts for the source of that blow, so its kill drips Wax and reaches skills as any other kill.
- Foes stop at Wicks through a new shared seam, `src/game/enemies/holds.ts`, applied after each foe's own step; a thornback charging into a Wick ends its charge there, as on a pin.
- Every Wenna's Wicks live in one world list (`src/game/hero/wenna/wickWorld.ts`), so foes meet any Wenna's Wicks in a room; a Wick its owner stops tending (she fell or left) holds nothing and melts when she rises.
- Wick bites count for `abilities` and pass a new `noFlow` option to `dealDamage`.
- Kills drop Wax through a new optional kit hook, `onKill`, called from `killEnemy` with the killer swapped in.
- Beckon hops each Wick in an arc to its place in the ring, so the ring forms within its 2 s.
- Hunting Call, Guttering, Wax Effigy and Singe start lower than the plan's table (see `docs/skills/wenna.md`), so each grows 6 to 8.5 times by level 8.

