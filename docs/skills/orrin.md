# Orrin's skills

Orrin's 20 skills, written from the skill data in `src/constants/characters/orrin/skills/`, which is the source of truth.
His kit, Momentum and the hook are in `docs/orrin-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) for his spells and Whirlwall.
At the start of a run AD is 11 and AP is 8.
Every hit he deals is also multiplied by Momentum, up to 1.4 at a full bar (1.6 with Perpetual Motion).
Distances are art pixels, times are seconds, speeds are pixels a second.

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `o_sweetspot` | Sweet Spot | attack | precise | J | `o_perpetual` |
| `o_ironweight` | Iron Weight | attack | easy | J | `o_reelsnap` |
| `o_skylash` | Sky Lash | attack | timed | J | `o_pump` |
| `o_pendulumkick` | Pendulum Kick | attack | timed | auto | `o_skylash` |
| `o_gaff` | Gaff | attack | precise | J | `o_sweetspot` |
| `o_pump` | Pendulum Pump | movement | easy | J | `o_friction` |
| `o_reelsnap` | Reel Snap | movement | timed | J | `o_ironweight` |
| `o_undertow` | Undertow | attack | precise | K | `o_anchorfall` |
| `o_plumbdrop` | Plumb Drop | movement | precise | J | `o_gaff` |
| `o_chainfence` | Chain Fence | spell | easy | I | `o_barbs` |
| `o_tether` | Tether | spell | timed | I | `o_bell` |
| `o_anchorfall` | Anchor Fall | spell | timed | I | `o_tether` |
| `o_barbs` | Barbed Links | dot | easy | J | `o_chainfence` |
| `o_rust` | Rust Bite | dot | timed | J | `o_gaff` |
| `o_friction` | Friction Burn | dot | timed | J | `o_pendulumkick` |
| `o_kite` | Brass Kite | summon | easy | auto | `o_pump` |
| `o_bell` | Rift Bell | summon | timed | auto | `o_tether` |
| `o_twin` | Twin Chain | summon | precise | auto | `o_sweetspot` |
| `o_perpetual` | Perpetual Motion | passive | easy | auto | `o_kite` |
| `o_grandpendulum` | Grand Pendulum | ultimate | timed | U | `o_pump` |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 5, easy 6, timed 9.

Kit events he emits through the shared function: `latch` (the swing hook bit a crystal, a platform or the air), `release` (he let go of a swing), `tip` (a chain hit at the tip) and `swingKick`, declared in `src/types/orrin.ts`; and the shared `cast`, `dash` and `perfectDodge`.
The shared warp and guard emit `warp` and `parry` for him.

### o_sweetspot: Sweet Spot

attack, precise, J. Hits at the chain's tip deal much more.

Values: tip: share more a tip hit deals; band: pixels the tip band grows; mark: share more a tip-marked foe takes, for markTime seconds; circleCrit: 1 Full Circle tips always crit; refund: stamina a tip hit gives back; perfect: 1 at 50+ Momentum tip hits deal double and send a shock (evolution); shock: the shock's reach in pixels, shockPower its share of attack damage

| Lv | Change | Card |
| --- | --- | --- |
| 1 | tip 0.25, markTime 2 | Tip hits deal 25% more. |
| 2 | tip 0.25 to 0.35, band 0 to 4 | Tip hits +35%, the tip reaches in 4 px. |
| 3 | mark 0 to 0.1 | A tip hit marks the foe: +10% for 2 s. |
| 4 | tip 0.35 to 0.45 | Tip hits +45%. |
| 5 | circleCrit 0 to 1 | Full Circle tips always crit. |
| 6 | refund 0 to 4 | A tip hit gives back 4 stamina. |
| 7 | mark 0.1 to 0.2 | Marked foes take +20%. |
| 8 | tip 0.45 to 0.7 | Tip hits +70%. |
| Evolved | perfect 0 to 1, shock 0 to 20, shockPower 0 to 0.6 | At 50+ Momentum, tips deal double and shock. |

Evolution: **Perfect Arc** (partner `o_perpetual`). At 50 Momentum or more every tip hit deals double and sends a shock through the foes behind it.

### o_ironweight: Iron Weight

attack, easy, J. A heavier hook: the string hits harder and Full Circle grows.

Values: power: share more the string deals; radius: pixels Full Circle reaches further; lift: share higher Rising Arc launches; turns: times Full Circle turns (each after the first at half); knock: attack damage a foe knocked into another deals to it; ball: 1 the hook is a spiked ball (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.15, turns 1 | The string deals 15% more. |
| 2 | power 0.15 to 0.2, radius 0 to 6 | +20%, Full Circle reaches 6 px further. |
| 3 | lift 0 to 0.4 | Rising Arc launches higher. |
| 4 | power 0.2 to 0.3 | The string deals 30% more. |
| 5 | turns 1 to 2 | Full Circle turns twice, the second at half. |
| 6 | power 0.3 to 0.4 | The string deals 40% more. |
| 7 | knock 0 to 0.5 | Foes knocked into others hit them. |
| 8 | power 0.4 to 0.6 | The string deals 60% more. |
| Evolved | radius 6 to 14, turns 2 to 3, ball 0 to 1 | A spiked ball: three turns at radius 74. |

Evolution: **Wrecking Ball** (partner `o_reelsnap`). The hook becomes a spiked iron ball, and Full Circle turns three times at radius 74.

### o_skylash: Sky Lash

attack, timed, J. More Hanging Arcs in the air, stronger when you fly fast.

Values: arcs: Hanging Arcs per airtime; power: share more they deal; fast: share more above 160 px/s; spike: 1 air arcs spike minions so they bounce; splash: attack damage a spiked foe deals to foes it lands on; crescent: attack damage of the brass crescent thrown 60 px on; pierce: 1 crescents pierce (evolution); second: 1 at 100 Momentum a second crescent follows (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | arcs 2 | Two Hanging Arcs per airtime. |
| 2 | power 0 to 0.2 | Hanging Arcs deal 20% more. |
| 3 | fast 0 to 0.5 | +50% above 160 px/s. |
| 4 | spike 0 to 1 | Air arcs spike minions into the floor. |
| 5 | arcs 2 to 3 | Three Hanging Arcs per airtime. |
| 6 | splash 0 to 0.5 | A spiked foe hits the foes it lands on. |
| 7 | crescent 0 to 0.6 | The arc throws a brass crescent on. |
| 8 | power 0.2 to 0.5, crescent 0.6 to 0.9 | Arcs +50%, crescents stronger. |
| Evolved | pierce 0 to 1, second 0 to 1 | Crescents pierce; full Momentum adds one. |

Evolution: **Falling Star** (partner `o_pump`). Every air arc throws a crescent that pierces, and at 100 Momentum a second one follows.

### o_pendulumkick: Pendulum Kick

attack, timed, auto. Your swing kicks come sooner and hit harder.

Values: from: swing speed in px/s the kick starts at; power: share more it deals; launch: 1 kicks launch minions; hook: 1 a pass that kicks 2 or more foes gives a hook back; stun: seconds kicked foes are stunned; twice: 1 each foe can be kicked going and coming back; echo: 1 at top speed an afterimage kicks again 0.2 s later; comet: 1 kicks leave a burning comet trail (evolution); echoAll: 1 the afterimage kicks on every pass (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | from 110, power 0.25 | Swing kicks from 110 px/s, +25%. |
| 2 | launch 0 to 1 | Kicks launch minions. |
| 3 | power 0.25 to 0.45 | Kicks deal 45% more. |
| 4 | hook 0 to 1 | Kicking 2 foes in a pass gives a hook back. |
| 5 | stun 0 to 0.5 | Kicks stun for 0.5 s. |
| 6 | twice 0 to 1 | Kick each foe going and coming back. |
| 7 | power 0.45 to 0.7 | Kicks deal 70% more. |
| 8 | power 0.7 to 1, echo 0 to 1 | +100%; at top speed an afterimage kicks. |
| Evolved | comet 0 to 1, echoAll 0 to 1 | Comet trails; the afterimage always kicks. |

Evolution: **Comet Heel** (partner `o_skylash`). Kicks leave a brass comet trail that burns foes under it, and the afterimage kicks on every pass.

### o_gaff: Gaff

attack, precise, J. The warp kick hits harder, costs less and comes back sooner, and catches a foe winding up.

Values: cost: MP a warp costs; recharge: seconds; charges: warps in a row; strike: the warp kick's power as attack damage; windup: 1 a foe winding up reels 1.2 s and the kick crits; path: attack damage the thrown hook deals to foes on its way; ring: pixels round the kick every foe takes it; momentum: Momentum a crit kick gives; harpoon: pixels round the hooked foe from which foes are dragged in to it first (evolution); sure: 1 the kick always crits (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | cost 6, recharge 1.5, charges 1, strike 2.4 | The warp kick deals 2.4x, costs 6 MP and recharges in 1.5 s. |
| 2 | windup 1 | New: a foe winding up reels 1.2 s and the kick crits. |
| 3 | path 1 | New: the thrown hook cuts every foe on its way. |
| 4 | charges 1 to 2 | New: two warp charges. |
| 5 | ring 26 | New: the kick hits every foe within 26 px. |
| 6 | recharge 1.5 to 1.1 | Recharge 1.5 to 1.1 s. |
| 7 | momentum 20 | New: a crit kick gives 20 Momentum. |
| 8 | strike 2.4 to 6.5, path 1 to 2 | Warp kick 2.4 to 6.5; the hook's cut hits harder. |
| Evolved | harpoon 80, sure 1 | Drag the foes round it in; the kick always crits. |

Evolution: **Harpoon** (partner `o_sweetspot`). Every foe within 80 px of the hooked one is dragged in to it before the kick, and the kick always crits.

### o_pump: Pendulum Pump

movement, easy, J. The swing hook (J held with Up) flies further, and you swing higher.

Values: pump: share harder Left and Right pump the swing; bite: seconds an air bite holds; range: pixels more the hook flies; fling: share more a fling adds; cost: stamina less a hook costs; hooks: air hooks more per airtime; skyline: 1 at 50+ Momentum hooks are not limited per airtime (evolution); cut: attack damage the chain deals to foes it sweeps through in a swing (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | pump 0.3, bite 1.6 | Pump 30% harder; air bites hold 1.6 s. |
| 2 | range 0 to 12 | The hook flies 12 px further. |
| 3 | fling 0 to 0.15 | Flings carry 15% more. |
| 4 | cost 0 to 4 | A hook costs 4 less stamina. |
| 5 | hooks 0 to 1 | A third hook per airtime. |
| 6 | bite 1.6 to 2.2 | Air bites hold 2.2 s. |
| 7 | range 12 to 24 | The hook flies 24 px further. |
| 8 | pump 0.3 to 0.6, fling 0.15 to 0.3 | Pump 60% harder, flings 30% more. |
| Evolved | skyline 0 to 1, cut 0 to 0.5 | Endless hooks at 50+ Momentum; the chain cuts. |

Evolution: **Skyline** (partner `o_friction`). With 50 Momentum or more hooks are not limited per airtime, and the chain cuts foes it sweeps through.

### o_reelsnap: Reel Snap

movement, timed, J. Hold J while swinging to reel in: a reel that speeds you up enough snaps the chain at foes near you.

Values: power: attack damage of the snap; at: share of the reel's starting speed it must reach; reel: reel speed in px/s; radius: the snap's reach; stun: seconds it stuns; arc: 1 the snap gives the Hanging Arc back; shock: 1 a snap at the bottom of the arc sends a shock along the floor; whiplash: 1 every snap is a Full Circle at the swing point (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.8, at 1.3, reel 160, radius 30 | A fast reel snaps 0.8x at foes within 30 px. |
| 2 | reel 160 to 220 | Reel at 220 px/s. |
| 3 | stun 0 to 0.4 | The snap stuns for 0.4 s. |
| 4 | arc 0 to 1 | The snap gives the Hanging Arc back. |
| 5 | power 0.8 to 1.2, radius 30 to 44 | The snap reaches 44 px and deals 1.2x. |
| 6 | shock 0 to 1 | A snap low in the arc shocks the floor. |
| 7 | power 1.2 to 1.6 | The snap deals 1.6x. |
| 8 | power 1.6 to 2.2 | The snap deals 2.2x. |
| Evolved | whiplash 0 to 1 | Every snap is a Full Circle. |

Evolution: **Whiplash** (partner `o_ironweight`). Every snap is a Full Circle round the swing point.

### o_undertow: Undertow

attack, precise, K. Chain Bind holds longer, its yank hits hard, and it drags more foes in with the one that struck.

Values: bind: seconds Chain Bind holds a minion; power: attack damage of the yank on the bound foe; drag: foes beside the bound one yanked in and bound with it; big: 1 mini bosses and bosses are yanked in and held too; trip: seconds the chain line left on the floor trips foes; tripPower: its attack damage; mark: share more the bound foe takes from every source while bound; riptide: pixels round the bound foe within which every foe is yanked in and bound (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | bind 1.6, power 1 | Chain Bind holds 1.6 s; the yank deals 1.0x. |
| 2 | drag 1 | New: the foe nearest the bound one is yanked in too. |
| 3 | power 1 to 1.8 | The yank deals 1.8x. |
| 4 | big 1 | New: mini bosses and bosses are yanked in and held. |
| 5 | trip 0.6, tripPower 0.6 | New: the yank leaves a chain on the floor that trips. |
| 6 | bind 1.6 to 2.2, power 1.8 to 2.6 | Chain Bind holds 2.2 s; the yank deals 2.6x. |
| 7 | mark 0.3 | New: the bound foe takes 30% more while bound. |
| 8 | power 2.6 to 4, drag 1 to 2 | The yank deals 4.0x; two foes come in with it. |
| Evolved | riptide 60 | Every foe round it is yanked in and bound. |

Evolution: **Riptide** (partner `o_anchorfall`). A parry yanks in every foe within 60 px of the one that struck, and binds them all.

### o_plumbdrop: Plumb Drop

movement, precise, J. Hold Down while swinging to let go and drop straight down onto foes.

Values: power: attack damage in the ring; ring: its radius; launch: 1 foes in it are launched; momentum: 1 Momentum adds up to +50% to the drop; head: 1 a drop on a foe's head crits; hook: 1 a drop gives a hook back; quake: the evolved quake's radius; root: seconds it roots (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.2, ring 28 | Down in a swing drops for 1.2x in 28 px. |
| 2 | ring 28 to 40 | The drop's ring reaches 40 px. |
| 3 | launch 0 to 1 | Foes in the ring are launched. |
| 4 | power 1.2 to 1.8 | The drop deals 1.8x. |
| 5 | momentum 0 to 1 | Momentum adds to the drop's damage. |
| 6 | head 0 to 1 | A drop on a foe's head crits. |
| 7 | hook 0 to 1 | A drop gives a hook back. |
| 8 | power 1.8 to 3 | The drop deals 3.0x. |
| Evolved | power 3 to 3.5, quake 0 to 64, root 0 to 1 | A 64 px quake that roots for 1 s. |

Evolution: **Meteor Anchor** (partner `o_gaff`). The drop drives the hook into the floor for a 64 px quake that roots foes for 1 s.

### o_chainfence: Chain Fence

spell, easy, I. Set two posts with a chain between them that trips foes crossing it.

Values: mp: MP a cast costs; cooldown: seconds; power: ability power a crossing deals; length: pixels between the posts; stumble: seconds a crossing foe stumbles; count: fences up at once; slow: 1 crossing foes are slowed; spark: ability power the chain's sparks deal every 0.5 s; life: seconds a fence stands; razor: bleed stacks a crossing adds, and the fence follows you (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 18, cooldown 6, power 1.2, length 60, stumble 0.4, count 1, life 5 | A fence 60 px long: 1.2x a crossing. |
| 2 | length 60 to 80 | The fence is 80 px long. |
| 3 | count 1 to 2 | Two fences at once. |
| 4 | slow 0 to 1 | Crossing foes are slowed. |
| 5 | power 1.2 to 1.8 | A crossing deals 1.8x. |
| 6 | spark 0 to 0.3 | The chain sparks at foes near it. |
| 7 | life 5 to 8 | Fences stand 8 s. |
| 8 | power 1.8 to 2.6, spark 0.3 to 0.5 | 2.6x a crossing; stronger sparks. |
| Evolved | razor 0 to 3 | Barbed: crossings bleed; it follows you. |

Evolution: **Razor Fence** (partner `o_barbs`). The chain is barbed: every crossing adds 3 bleed stacks, and the fence follows you.

### o_tether: Tether

spell, timed, I. Chain the nearest foes together so damage to one hurts the others.

Values: mp, cooldown; count: foes chained; share: share of the damage one takes passed to the others; life: seconds; yank: ability power two foes pulled more than 70 px apart deal each other as they are yanked together; burst: ability power the others take when a chained foe dies; gang: 1 every foe on screen is chained (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 22, cooldown 8, count 2, share 0.3, life 4 | Chain 2 foes: 30% of damage is shared. |
| 2 | count 2 to 3 | Chain 3 foes. |
| 3 | share 0.3 to 0.45 | 45% of damage is shared. |
| 4 | yank 0 to 1.5 | Foes pulled apart are yanked together. |
| 5 | life 4 to 6 | The tether lasts 6 s. |
| 6 | burst 0 to 2 | A chained foe's death hurts the others. |
| 7 | share 0.45 to 0.6 | 60% of damage is shared. |
| 8 | yank 1.5 to 2.5, burst 2 to 3 | Harder yanks and bursts. |
| Evolved | gang 0 to 1 | Every foe on screen is chained. |

Evolution: **Chain Gang** (partner `o_bell`). Every foe on screen is chained together.

### o_anchorfall: Anchor Fall

spell, timed, I. An iron anchor drops from a rift onto the foes ahead.

Values: mp, cooldown; power: ability power in the ring; ring: its radius; stun: seconds; count: anchors; root: seconds the chain between anchors roots; pull: pixels foes are pulled in first; rain: 1 five anchors fall across the screen (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 26, cooldown 7, power 3, ring 26, stun 0.6, count 1 | An anchor falls 50 px ahead for 3.0x. |
| 2 | count 1 to 2 | A second anchor 30 px further. |
| 3 | root 0 to 0.8 | The chain between anchors roots for 0.8 s. |
| 4 | ring 26 to 36 | The ring reaches 36 px. |
| 5 | pull 0 to 20 | The drop pulls foes in first. |
| 6 | power 3 to 4.2 | Anchors deal 4.2x. |
| 7 | count 2 to 3 | Three anchors. |
| 8 | power 4.2 to 5.5 | Anchors deal 5.5x. |
| Evolved | power 5.5 to 6, count 3 to 5, rain 0 to 1 | Five anchors across the screen, 6x each. |

Evolution: **Iron Rain** (partner `o_tether`). Five anchors fall across the screen, each for 6x.

### o_barbs: Barbed Links

dot, easy, J. Chain hits leave bleeding cuts.

Values: stacks: bleed stacks a chain hit adds; tipStacks: stacks a tip hit adds; max: most stacks; damage: attack damage a stack deals a second; life: seconds; kick: 1 swing kicks add stacks; bonus: share more bleeding foes take from the chain; flay: attack damage each stack deals when a Full Circle tip consumes them (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 1, tipStacks 1, max 6, damage 0.12, life 3 | Chain hits add a bleed stack. |
| 2 | tipStacks 1 to 2 | Tip hits add 2 stacks. |
| 3 | max 6 to 10 | Up to 10 stacks. |
| 4 | kick 0 to 1 | Swing kicks add stacks. |
| 5 | damage 0.12 to 0.18 | Bleeds hurt more. |
| 6 | bonus 0 to 0.1 | Bleeding foes take 10% more from the chain. |
| 7 | damage 0.18 to 0.24 | Bleeds hurt more. |
| 8 | damage 0.24 to 0.3 | Bleeds hurt far more. |
| Evolved | flay 0 to 1.2 | Full Circle tips flay every stack. |

Evolution: **Flay** (partner `o_chainfence`). A Full Circle tip consumes the stacks for 1.2x each.

### o_rust: Rust Bite

dot, timed, J. A foe your warp kick or Chain Bind catches rusts and keeps hurting.

Values: damage: attack damage of rust a second; life: seconds; taken: share more rusted foes take from every source; spread: 1 rust spreads to one foe it touches; pin: 1 Anchor Pin rusts; slow: 1 rusted foes are slowed; corrode: attack damage a rusted foe bursts for when it dies, rusting every foe within 40 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | damage 0.2, life 4 | A foe your warp kick or Chain Bind catches rusts. |
| 2 | taken 0 to 0.15 | Rusted foes take 15% more. |
| 3 | spread 0 to 1 | Rust spreads to a foe it touches. |
| 4 | pin 0 to 1 | Anchor Pin rusts. |
| 5 | damage 0.2 to 0.3 | Rust bites harder. |
| 6 | damage 0.3 to 0.45 | Rust bites far harder. |
| 7 | slow 0 to 1 | Rusted foes are slowed. |
| 8 | damage 0.45 to 0.6, life 4 to 6 | Rust bites hardest, 6 s. |
| Evolved | corrode 0 to 3 | Rusted foes burst when they die. |

Evolution: **Corrode** (partner `o_gaff`). A rusted foe that dies bursts for 3x and rusts every foe within 40 px.

### o_friction: Friction Burn

dot, timed, J. Foes the chain sweeps in a swing or a Full Circle catch fire.

Values: burn: seconds foes burn; damage: attack damage a second of the chain's own burn; spread: 1 the burn spreads on a kill; kick: share more burning foes take from the swing kick; trail: 1 a flame trail on the chain at 100 Momentum; scorch: 1 every swing leaves a burning arc in the air (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | burn 2, damage 0.15 | Swept foes burn for 2 s. |
| 2 | burn 2 to 3 | Burns last 3 s. |
| 3 | spread 0 to 1 | The burn spreads on a kill. |
| 4 | kick 0 to 0.2 | Burning foes take 20% more from kicks. |
| 5 | damage 0.15 to 0.25 | Burns grow stronger. |
| 6 | burn 3 to 4, damage 0.25 to 0.35 | Burns last 4 s and grow stronger. |
| 7 | trail 0 to 1 | A flame trail on the chain at full Momentum. |
| 8 | damage 0.35 to 0.5 | Burns are far stronger. |
| Evolved | scorch 0 to 1 | Swings leave burning arcs in the air. |

Evolution: **Scorched Arc** (partner `o_pendulumkick`). Every swing leaves a burning arc in the air that hurts foes passing through.

### o_kite: Brass Kite

summon, easy, auto. Letting go of a swing may launch a brass kite that dives at foes.

Values: chance: chance a release launches one; count: most kites out; life: seconds; power: attack damage a dive; every: seconds between dives; pairs: 1 kites dive in pairs; chill: 1 a dive chills; armada: 1 four kites circle all the time and dive with every swing kick (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.2, count 1, life 6, power 0.6, every 1 | 20% on a release: a kite dives for 0.6x. |
| 2 | chance 0.2 to 0.35 | 35% chance. |
| 3 | count 1 to 2 | Two kites. |
| 4 | pairs 0 to 1 | Kites dive in pairs. |
| 5 | power 0.6 to 0.9 | Dives deal 0.9x. |
| 6 | chill 0 to 1 | A dive chills. |
| 7 | life 6 to 10 | Kites stay 10 s. |
| 8 | power 0.9 to 1.3 | Dives deal 1.3x. |
| Evolved | count 2 to 4, armada 0 to 1 | Four kites, always out, dive on kicks. |

Evolution: **Sky Armada** (partner `o_pump`). Four kites circle you all the time and dive with every swing kick.

### o_bell: Rift Bell

summon, timed, auto. A tip hit may drop a bronze bell from a rift that swings through the foe.

Values: chance: chance a tip hit drops one; cooldown: seconds between bells; power: attack damage a swing; swings: swings a bell makes; stun: 1 the first swing stuns; wide: 1 a swing also hits the foes beside; toll: ability power of the toll ring; count: bells at once; great: 1 the bell is twice the size and its toll stuns everything on screen (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.12, cooldown 2, power 0.8, swings 2, count 1 | 12% on a tip hit: a bell swings 0.8x twice. |
| 2 | stun 0 to 1 | The first swing stuns. |
| 3 | wide 0 to 1 | Swings hit the foes beside it too. |
| 4 | toll 0 to 0.4 | The bell tolls a ring for 0.4x. |
| 5 | power 0.8 to 1.2 | Swings deal 1.2x. |
| 6 | count 1 to 2 | Two bells at once. |
| 7 | swings 2 to 3 | Bells swing 3 times. |
| 8 | power 1.2 to 1.8 | Swings deal 1.8x. |
| Evolved | toll 0.4 to 0.8, great 0 to 1 | A great bell; its toll stuns the screen. |

Evolution: **Great Bell** (partner `o_tether`). The bell is twice the size, and its toll stuns everything on screen for 0.5 s.

### o_twin: Twin Chain

summon, precise, auto. A Slip or a perfect dodge calls a shade of you that spins a Full Circle.

Values: power: the shade's Full Circle as a multiple of yours; momentum: Momentum a shade gives; count: shades a Slip calls; swing: 1 the shade swings and spins again; copy: 1 the shade copies your next Hanging Arc; mirror: 1 a Slip calls three shades whose tips all crit (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, count 1 | A Slip or perfect dodge calls a shade's Full Circle. |
| 2 | momentum 0 to 10 | A shade gives 10 Momentum. |
| 3 | count 1 to 2 | Two shades. |
| 4 | swing 0 to 1 | The shade swings and spins again. |
| 5 | copy 0 to 1 | The shade copies your next Hanging Arc. |
| 6 | power 1 to 1.4 | Shades hit 1.4x as hard. |
| 7 | power 1.4 to 1.7 | Shades hit 1.7x as hard. |
| 8 | power 1.7 to 2 | Shades hit 2x as hard. |
| Evolved | count 2 to 3, mirror 0 to 1 | Three shades; their tips always crit. |

Evolution: **Mirror Dance** (partner `o_sweetspot`). Every Slip calls three shades whose tip hits all crit.

### o_perpetual: Perpetual Motion

passive, easy, auto. Momentum lasts longer and does more.

Values: drain: Momentum drains at this share of its usual rate; bonus: Momentum's bonus at full; walk: Momentum a second while walking on the floor; start: Momentum never falls below this; hurt: Momentum a blow costs; endless: 1 Momentum never drains while a Brass Kite is out (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | drain 0.5, bonus 0.4, hurt 30 | Momentum drains half as fast. |
| 2 | bonus 0.4 to 0.5 | Momentum's bonus reaches +50%. |
| 3 | walk 0 to 5 | Walking gives 5 Momentum a second. |
| 4 | start 0 to 30 | Momentum never falls below 30. |
| 5 | hurt 30 to 15 | A blow costs only 15 Momentum. |
| 6 | drain 0.5 to 0.35 | Momentum drains a third as fast. |
| 7 | bonus 0.5 to 0.6 | Momentum's bonus reaches +60%. |
| 8 | drain 0.35 to 0.25 | Momentum drains a quarter as fast. |
| Evolved | endless 0 to 1 | No drain while a kite is out. |

Evolution: **Endless Motion** (partner `o_kite`). Momentum never drains while a Brass Kite is out.

### o_grandpendulum: Grand Pendulum

ultimate, timed, U. Grand Pendulum swings more passes, drags foes under the tear, and ends in full turns round it.

Values: passes: wide passes under the tear; power: share of the level's power each pass and turn deals each foe; pull: 1 a pass drags the foes it meets under the tear; radius: the chain's length in pixels; shards: share of the level's power the chain shards of each pass and turn deal foes on the floor beneath; crash: share of the level's power of the crash ring; stun: seconds the crash stuns; turns: full turns round the tear after the passes; burst: share of the level's power the foes drawn in under the tear burst for together at the end (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | passes 3, power 0.6, crash 1 | Three passes, each 0.6x the level's power. |
| 2 | pull 1 | New: each pass drags the foes it meets under the tear. |
| 3 | power 0.6 to 0.8, radius 110 | A longer chain, radius 110; passes deal 0.8x. |
| 4 | shards 0.5 | New: each pass sprays chain shards on the floor, 0.5x. |
| 5 | crash 1 to 2, stun 1 | New: the crash deals 2x and stuns for 1 s. |
| 6 | turns 1 | New: after the passes he loops a full turn round the tear. |
| 7 | power 0.8 to 1.2 | Passes and turns deal 1.2x. |
| 8 | power 1.2 to 1.4, crash 2 to 3, turns 1 to 2 | Two full turns; passes 1.4x, the crash 3x. |
| Evolved | power 1.4 to 2.2, radius 110 to 140, turns 2 to 4, burst 8 | Four turns, a giant circle, a final burst. |

Evolution: **Maelstrom** (partner `o_pump`). Four full turns in a circle as tall as the screen, and the foes drawn in under the tear burst together at the end.
