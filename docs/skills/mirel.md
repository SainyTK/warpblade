# Mirel's skills

Mirel's 20 skills, written from the skill data in `src/constants/characters/mirel/skills/`, which is the source of truth.
Her kit, Sand, the Stillfield, Rewind and the echo are in `docs/mirel-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) from `progress.stats.ap` where a skill's values say so.
At the start of a run AD is 9 and AP is 12.
Every blow of her string lands again 0.5 s later as an echo at 0.5x, or at 1.0x on a foe inside her Stillfield or stopped.
A still foe is one inside a Stillfield or stopped by Stopped Clock, Hour of Stillness or Eternal Noon.
Distances are art pixels, times are seconds, speeds are pixels a second.

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `m_echo` | Long Echo | attack | easy | J | `m_patience` |
| `m_toll` | Great Toll | attack | timed | J | `m_handsweep` |
| `m_stillpoint` | Still Point | attack | precise | J | `m_foretell` |
| `m_fallinghour` | Falling Hour | attack | timed | J | `m_suspend` |
| `m_backswing` | Backswing | attack | precise | J | `m_longrewind` |
| `m_suspend` | Suspended | movement | easy | jump | `m_sandstorm` |
| `m_longrewind` | Long Rewind | movement | timed | L | `m_pastself` |
| `m_quicken` | Quickened | movement | timed | L | `m_echo` |
| `m_pace` | Steady Pace | movement | easy | K | `m_patience` |
| `m_sundial` | Sundial | spell | easy | I | `m_patience` |
| `m_foretell` | Foretell | spell | timed | I | `m_stillpoint` |
| `m_handsweep` | Hour Hand | spell | timed | I | `m_toll` |
| `m_wither` | Wither | dot | easy | J | `m_echo` |
| `m_sandstorm` | Grinding Sand | dot | timed | K | `m_sundial` |
| `m_entropy` | Entropy | dot | timed | auto | `m_foretell` |
| `m_pastself` | Past Self | summon | timed | auto | `m_quicken` |
| `m_wren` | Clockwork Wren | summon | easy | auto | `m_wither` |
| `m_orrery` | Orrery | summon | easy | auto | `m_handsweep` |
| `m_patience` | Patience | passive | easy | auto | `m_pastself` |
| `m_noon` | Eternal Noon | ultimate | timed | U | `m_patience` |

Counts: attack 5, movement 4, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 2, easy 8, timed 10.

Kit events she emits through the shared function: `echo` (an echo of a blow struck a foe), `field` (her Stillfield opened or closed) and `rewind` (a Rewind ended, with the HP it gave back), declared in `src/types/mirel.ts`; and the shared `cast`, `jump`, `dash` (each Rewind) and `perfectDodge`.

### m_echo: Long Echo

attack, easy, J. Her echoes hit harder, land sooner and reach further.

Values: power: share more every echo deals; reach: pixels the echo's hit shape grows; second: share of the blow's power a second echo deals 1.0 s after the blow; delay: seconds after the blow the echo lands; stun: seconds Toll's echo stuns; pull: pixels an echo pulls the foes it hits toward the strike point; choir: 1 every blow echoes three times, the last at full power (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.3, delay 0.5 | Echoes deal 30% more. |
| 2 | reach 0 to 6 | The echo's shape grows 6 px. |
| 3 | second 0 to 0.3 | A second echo at 1.0 s for 0.3x. |
| 4 | power 0.3 to 0.6 | Echoes deal 60% more. |
| 5 | delay 0.5 to 0.35 | Echoes land 0.35 s after the blow. |
| 6 | stun 0 to 0.3 | Toll's echo stuns for 0.3 s. |
| 7 | pull 0 to 8 | Echoes pull foes 8 px to the strike point. |
| 8 | power 0.6 to 1.2 | Echoes deal 120% more. |
| Evolved | choir 0 to 1 | Three echoes; the last at full power. |

Evolution: **Choir of Hours** (partner `m_patience`). Every blow echoes three times, and the last echo hits at full power.

### m_toll: Great Toll

attack, timed, J. Toll, the third blow of her string, rings harder and wider.

Values: power: share more Toll deals; ring: pixels Toll's ring grows; launch: 1 Toll launches minions; sand: Sand Toll gives for each foe it hits; guard: 1 Toll breaks guards; field: 1 Toll also rings at the centre of her Stillfield; midnight: 1 Toll rings twelve times over 1.2 s, 0.4x of Toll each and the twelfth 3x (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.25, ring 6 | Toll deals 25% more; its ring grows 6 px. |
| 2 | launch 0 to 1 | Toll launches minions. |
| 3 | power 0.25 to 0.6 | Toll deals 60% more. |
| 4 | sand 0 to 5 | Toll gives 5 Sand for each foe hit. |
| 5 | guard 0 to 1 | Toll breaks guards. |
| 6 | power 0.6 to 1 | Toll deals 100% more. |
| 7 | field 0 to 1 | Toll also rings at your Stillfield. |
| 8 | power 1 to 1.8, ring 6 to 10 | Toll deals 180% more; its ring grows 10 px. |
| Evolved | midnight 0 to 1 | Toll rings twelve times. |

Evolution: **Midnight** (partner `m_handsweep`). Toll rings twelve times over 1.2 s, each for 0.4x, and the twelfth for 3x.

### m_stillpoint: Still Point

attack, precise, J. Her blows hit much harder on a foe in a Stillfield or stopped.

Values: power: share more her blows deal to a foe inside a Stillfield or stopped; crit: 1 such hits always crit; sand: Sand such a hit gives back; mark: share more a foe hit this way takes from every source, for markTime seconds; instant: 1 the hit's echo lands at once; twice: 1 a hit on a stopped foe is stored twice for the restart (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.4 | Blows on still foes deal 40% more. |
| 2 | crit 0 to 1 | Blows on still foes always crit. |
| 3 | sand 0 to 3 | A blow on a still foe gives back 3 Sand. |
| 4 | power 0.4 to 0.8 | Blows on still foes deal 80% more. |
| 5 | mark 0 to 0.15, markTime 0 to 2 | A still foe you hit is marked: +15% for 2 s. |
| 6 | instant 0 to 1 | The blow's echo lands at once. |
| 7 | power 0.8 to 1.2 | Blows on still foes deal 120% more. |
| 8 | power 1.2 to 1.8 | Blows on still foes deal 180% more. |
| Evolved | twice 0 to 1 | Hits on stopped foes are stored twice. |

Evolution: **Frozen Instant** (partner `m_foretell`). A hit on a stopped foe is stored twice for the restart.

### m_fallinghour: Falling Hour

attack, timed, J. Pendant Strike becomes a dive that strikes a ring where she lands.

Values: power: attack damage in the dive's ring; ring: its radius; hover: share more the dive deals out of a hover; refresh: 1 the dive gives the hover back; launch: 1 foes in the ring are launched; echo: 1 the dive's ring echoes; field: seconds a free Stillfield stands where the dive lands (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1.1, ring 24 | Pendant Strike dives for 1.1x in 24 px. |
| 2 | hover 0 to 0.4 | A dive from a hover deals 40% more. |
| 3 | ring 24 to 34 | The ring reaches 34 px. |
| 4 | power 1.1 to 1.8 | The dive deals 1.8x. |
| 5 | refresh 0 to 1 | The dive gives the hover back. |
| 6 | launch 0 to 1 | Foes in the ring are launched. |
| 7 | echo 0 to 1 | The dive's ring echoes. |
| 8 | power 1.8 to 3.2 | The dive deals 3.2x. |
| Evolved | field 0 to 1.5 | The dive opens a free field for 1.5 s. |

Evolution: **Sky Clock** (partner `m_suspend`). The dive opens a free Stillfield for 1.5 s where it lands.

### m_backswing: Backswing

attack, precise, J. A blow just after a Rewind hits much harder, and its echo lands at once.

Values: power: share more the first blow after a Rewind deals; window: seconds after a Rewind ends the blow counts; crit: 1 the blow always crits; heal: share of max HP the blow heals; stagger: seconds it staggers the foe; undone: 1 the blow replays on its foe, at full power, every blow she landed in the rewound 1.2 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.6, window 0.4 | A blow 0.4 s after a Rewind deals 60% more. |
| 2 | crit 0 to 1 | The blow always crits. |
| 3 | window 0.4 to 0.6 | The window grows to 0.6 s. |
| 4 | heal 0 to 0.03 | The blow heals 3% HP. |
| 5 | power 0.6 to 1 | The blow deals 100% more. |
| 6 | stagger 0 to 1 | The blow staggers for 1 s. |
| 7 | power 1 to 1.6 | The blow deals 160% more. |
| 8 | power 1.6 to 2.6 | The blow deals 260% more. |
| Evolved | undone 0 to 1 | Replay every rewound blow on the foe. |

Evolution: **Undone** (partner `m_longrewind`). The first blow after a Rewind replays on its foe, at full power, every blow she landed in the rewound 1.2 s.

### m_suspend: Suspended

movement, easy, jump. Her hover lasts longer and costs less.

Values: time: seconds of hover per airtime; cost: share less stamina the hover spends; drift: air drift in px/s while hovering; hovers: hovers per airtime; slow: share foes under her are slowed; free: 1 the hover costs no stamina while over a foe; grind: attack damage a second of grinding sand on foes below, and at 50+ Sand the hover has no limit (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | time 2, cost 0.25, drift 60, hovers 1 | Hover 2 s for 25% less stamina. |
| 2 | drift 60 to 80 | Drift 80 px/s while hovering. |
| 3 | hovers 1 to 2 | A second hover per airtime. |
| 4 | cost 0.25 to 0.4 | The hover costs 40% less stamina. |
| 5 | slow 0 to 0.3 | Foes under you are slowed 30%. |
| 6 | time 2 to 3 | Hover 3 s. |
| 7 | free 0 to 1 | No stamina cost while over a foe. |
| 8 | cost 0.4 to 0.6, slow 0.3 to 0.45 | 60% less stamina; foes below slowed 45%. |
| Evolved | grind 0 to 0.4 | Endless hover at 50+ Sand; grinding sand. |

Evolution: **Hanging Hour** (partner `m_sandstorm`). At 50 Sand or more the hover has no limit and drops grinding sand on foes below for 0.4x a second.

### m_longrewind: Long Rewind

movement, timed, L. Rewind looks further back, heals more and hurts foes on the path.

Values: back: seconds of path Rewind plays back; heal: share of the HP lost in them she gets back; cost: Sand a Rewind costs; power: attack damage foes on the path take; dodge: seconds at the start that count as a perfect dodge; field: radius of a free Stillfield where the Rewind began; fieldLife: seconds it stands; secondChance: 1 once per wave a fatal blow rewinds her 2 s and restores all HP lost in them (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | back 1.6, heal 0.5, cost 40, dodge 0.12 | Rewind looks back 1.6 s and heals 50%. |
| 2 | cost 40 to 30 | Rewind costs 30 Sand. |
| 3 | power 0 to 0.6 | Foes on the path take 0.6x. |
| 4 | dodge 0.12 to 0.2 | The perfect dodge window grows to 0.2 s. |
| 5 | power 0.6 to 1 | Foes on the path take 1.0x. |
| 6 | field 0 to 24, fieldLife 0 to 1 | A free 24 px field stands 1 s where it began. |
| 7 | heal 0.5 to 0.65 | Rewind heals 65%. |
| 8 | power 1 to 1.6 | Foes on the path take 1.6x. |
| Evolved | secondChance 0 to 1 | Once a wave, a fatal blow is undone. |

Evolution: **Second Chance** (partner `m_pastself`). Once per wave a fatal blow rewinds her 2 s and restores all HP lost in them.

### m_quicken: Quickened

movement, timed, L. After a Rewind she moves and attacks faster for a while.

Values: speed: share more move and attack speed after a Rewind; life: seconds it lasts; refill: share faster Sand refills while it lasts (1 is double); sooner: seconds sooner her echoes land while it lasts; overclock: 1 while Quickened every echo lands at once at full power (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | speed 0.15, life 2 | After a Rewind: 15% faster for 2 s. |
| 2 | life 2 to 3 | Quickened lasts 3 s. |
| 3 | speed 0.15 to 0.25 | 25% faster. |
| 4 | refill 0 to 1 | Sand refills double while Quickened. |
| 5 | sooner 0 to 0.2 | Echoes land 0.2 s sooner. |
| 6 | speed 0.25 to 0.35 | 35% faster. |
| 7 | life 3 to 4 | Quickened lasts 4 s. |
| 8 | speed 0.35 to 0.5 | 50% faster. |
| Evolved | overclock 0 to 1 | Quickened echoes land at once, at full. |

Evolution: **Overclock** (partner `m_echo`). While Quickened every echo lands at once at full power.

### m_pace: Steady Pace

movement, easy, K. She walks faster inside her own Stillfield, and the field shelters her.

Values: walk: share faster she walks inside her own Stillfield; contact: share less contact damage foes inside deal; refill: share of the usual Sand refill she gets while the field stands; follow: px/s the field follows her; radius: pixels the field's radius grows; eye: 1 the field centres on her and moves with her (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | walk 0.3 | Walk 30% faster in your Stillfield. |
| 2 | contact 0 to 0.25 | Foes inside deal 25% less contact damage. |
| 3 | refill 0 to 0.5 | Sand refills at half rate while it stands. |
| 4 | walk 0.3 to 0.45 | Walk 45% faster in your Stillfield. |
| 5 | follow 0 to 20 | The field follows you at 20 px/s. |
| 6 | radius 0 to 10 | The field's radius grows 10 px. |
| 7 | contact 0.25 to 0.4 | Foes inside deal 40% less contact damage. |
| 8 | walk 0.45 to 0.6, follow 20 to 30 | Walk 60% faster; it follows at 30 px/s. |
| Evolved | eye 0 to 1 | The field moves with you. |

Evolution: **Calm Eye** (partner `m_patience`). The field centres on her and moves with her.

### m_sundial: Sundial

spell, easy, I. Lay a dial on the floor that slows and wears down foes on it.

Values: mp: MP a cast costs; cooldown: seconds; power: ability power every 0.5 s to foes on the dial; width: the dial's width in pixels; life: seconds it stands; slow: share foes on it are slowed; gnomon: ability power of the gnomon's shadow, sweeping once a second; count: dials at once; court: 1 the dial follows her and covers 140 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 20, cooldown 6, power 0.4, width 70, life 5, slow 0.3, count 1 | A 70 px dial for 5 s: slow 30%, 0.4x. |
| 2 | width 70 to 90 | The dial is 90 px wide. |
| 3 | gnomon 0 to 1.2 | The gnomon's shadow sweeps for 1.2x. |
| 4 | slow 0.3 to 0.45 | Foes on it are slowed 45%. |
| 5 | power 0.4 to 0.7 | The dial deals 0.7x. |
| 6 | life 5 to 8 | Dials stand 8 s. |
| 7 | count 1 to 2 | Two dials at once. |
| 8 | power 0.7 to 1, gnomon 1.2 to 2 | 1.0x a tick; the shadow 2.0x. |
| Evolved | width 90 to 140, court 0 to 1 | The dial follows you, 140 px wide. |

Evolution: **Solar Court** (partner `m_patience`). The dial follows her and covers 140 px.

### m_foretell: Foretell

spell, timed, I. Mark the nearest foes; a blade falls on each where it stands a moment later.

Values: mp: MP a cast costs; cooldown: seconds; count: foes marked; delay: seconds before the blades fall; power: ability power of a blade; stun: seconds a blade stuns; ring: radius of a blade's ring; splash: ability power the ring deals to other foes; prophecy: 1 every foe on screen is marked and blades land twice on still foes (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 18, cooldown 6, count 3, delay 1.2, power 2 | Mark 3 foes; blades fall 1.2 s later for 2.0x. |
| 2 | count 3 to 5 | Mark 5 foes. |
| 3 | stun 0 to 0.5 | Blades stun for 0.5 s. |
| 4 | delay 1.2 to 0.8 | Blades fall after 0.8 s. |
| 5 | power 2 to 3 | Blades deal 3.0x. |
| 6 | ring 0 to 20, splash 0 to 1 | A 20 px ring hits other foes for 1.0x. |
| 7 | power 3 to 4.2 | Blades deal 4.2x. |
| 8 | power 4.2 to 6, splash 1 to 1.5 | Blades deal 6.0x, the ring 1.5x. |
| Evolved | prophecy 0 to 1 | Mark the screen; still foes take two blades. |

Evolution: **Prophecy** (partner `m_stillpoint`). Every foe on screen is marked, and blades land twice on still foes.

### m_handsweep: Hour Hand

spell, timed, I. A giant clock hand sweeps a half circle ahead, knocking foes along.

Values: mp: MP a cast costs; cooldown: seconds; power: ability power of the sweep; radius: the hand's length; back: ability power of the sweep back; stun: seconds the sweep stuns; full: 1 the hand sweeps a full circle; clockwork: 1 two hands sweep full circles for 1.2 s (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 26, cooldown 8, power 2.4, radius 70 | A hand sweeps a 70 px half circle for 2.4x. |
| 2 | radius 70 to 84 | The hand is 84 px long. |
| 3 | back 0 to 1.2 | It sweeps back for 1.2x. |
| 4 | stun 0 to 0.4 | The sweep stuns for 0.4 s. |
| 5 | power 2.4 to 3.5 | The sweep deals 3.5x. |
| 6 | full 0 to 1 | The hand sweeps a full circle. |
| 7 | power 3.5 to 4.5, back 1.2 to 2 | 4.5x; the sweep back 2.0x. |
| 8 | power 4.5 to 6, back 2 to 3 | 6.0x; the sweep back 3.0x. |
| Evolved | clockwork 0 to 1 | Two hands sweep for 1.2 s. |

Evolution: **Clockwork** (partner `m_toll`). Two hands sweep full circles for 1.2 s.

### m_wither: Wither

dot, easy, J. Her blows age foes, and age keeps hurting.

Values: stacks: Age stacks a blow adds; damage: attack damage a stack deals a second; max: most stacks; life: seconds; echo: 1 echoes add stacks; slow: share aged foes are slowed; dust: attack damage each stack deals when a foe at max stacks crumbles and consumes them (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 1, damage 0.12, max 6, life 3 | Blows add an Age stack. |
| 2 | echo 0 to 1 | Echoes add stacks too. |
| 3 | max 6 to 10 | Up to 10 stacks. |
| 4 | slow 0 to 0.1 | Aged foes are slowed 10%. |
| 5 | damage 0.12 to 0.18 | Age hurts more. |
| 6 | damage 0.18 to 0.25 | Age hurts far more. |
| 7 | life 3 to 5 | Age lasts 5 s. |
| 8 | damage 0.25 to 0.4 | Age hurts most. |
| Evolved | dust 0 to 1.5 | Foes at max Age crumble. |

Evolution: **Dust to Dust** (partner `m_echo`). A foe at max stacks crumbles, consuming them for 1.5x each.

### m_sandstorm: Grinding Sand

dot, timed, K. Foes inside her Stillfield are ground by sand.

Values: stacks: grind stacks a foe gains each second inside her Stillfield; damage: ability power a stack deals a second; max: most stacks; linger: seconds stacks last after the field closes; taken: share more ground foes take from every source; spread: 1 the grind spreads on a kill; storm: ability power a stack deals when the closing field bursts in 80 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 1, damage 0.2, max 5 | Foes in your field gain a grind stack a second. |
| 2 | linger 0 to 1 | Stacks last 1 s after the field. |
| 3 | taken 0 to 0.1 | Ground foes take 10% more. |
| 4 | damage 0.2 to 0.3 | Sand grinds harder. |
| 5 | damage 0.3 to 0.4 | Sand grinds far harder. |
| 6 | spread 0 to 1 | The grind spreads on a kill. |
| 7 | max 5 to 8 | Up to 8 stacks. |
| 8 | damage 0.4 to 0.6 | Sand grinds hardest. |
| Evolved | storm 0 to 1 | The closing field bursts per stack. |

Evolution: **Sandstorm** (partner `m_sundial`). The closing field bursts in 80 px for 1.0x for each stack.

### m_entropy: Entropy

dot, timed, auto. A foe restarting from a stop or a field snap decays.

Values: damage: ability power of decay a second; life: seconds; max: decay stacks a foe can hold, a snap on a decaying foe adding one; taken: share more decaying foes take from every source; spread: 1 decay spreads on a kill; stop: seconds every foe within 50 px stops when a decaying foe dies (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | damage 0.25, life 3, max 1 | A restarting foe decays for 3 s. |
| 2 | life 3 to 5 | Decay lasts 5 s. |
| 3 | taken 0 to 0.15 | Decaying foes take 15% more. |
| 4 | damage 0.25 to 0.35 | Decay hurts more. |
| 5 | spread 0 to 1 | Decay spreads on a kill. |
| 6 | damage 0.35 to 0.5 | Decay hurts far more. |
| 7 | max 1 to 2 | A snap on a decaying foe adds a stack. |
| 8 | damage 0.5 to 0.8 | Decay hurts most. |
| Evolved | stop 0 to 1 | A decaying death stops foes near it. |

Evolution: **Heat Death** (partner `m_foretell`). A decaying foe that dies stops every foe within 50 px for 1 s.

### m_pastself: Past Self

summon, timed, auto. A Rewind may leave a ghost of her that replays her last blows.

Values: chance: chance a Rewind leaves a ghost; cooldown: seconds between ghosts; power: share of her blows' power the ghost's replays deal; taunt: seconds the ghost draws foes; replays: times it replays her blows of the last 1.2 s; many: 1 every Rewind leaves a ghost and its blows echo (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.3, cooldown 1.5, power 0.8, replays 1 | 30% on a Rewind: a ghost replays at 0.8x. |
| 2 | chance 0.3 to 0.45 | 45% chance. |
| 3 | taunt 0 to 1 | The ghost draws foes for 1 s. |
| 4 | power 0.8 to 1.2 | Replays deal 1.2x. |
| 5 | replays 1 to 2 | The ghost replays twice. |
| 6 | chance 0.45 to 0.6 | 60% chance. |
| 7 | power 1.2 to 1.6 | Replays deal 1.6x. |
| 8 | power 1.6 to 2.2 | Replays deal 2.2x. |
| Evolved | many 0 to 1 | Every Rewind leaves a ghost; its blows echo. |

Evolution: **Many Selves** (partner `m_quicken`). Every Rewind leaves a ghost, and its blows echo.

### m_wren: Clockwork Wren

summon, easy, auto. A Toll that hits may wind up a clockwork bird that pecks foes.

Values: chance: chance a Toll hit sends one; cooldown: seconds between wrens; power: attack damage a peck; pecks: pecks before it leaves; count: wrens it sends; chill: 1 pecks chill; life: seconds a wren stays, pecking once a second (0: it leaves after its pecks); chorus: 1 every Toll sends four wrens whose pecks add Age (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.15, cooldown 2, power 0.4, pecks 3, count 1 | 15% on a Toll hit: a wren pecks 0.4x 3 times. |
| 2 | chance 0.15 to 0.25 | 25% chance. |
| 3 | count 1 to 2 | Two wrens. |
| 4 | chill 0 to 1 | Pecks chill. |
| 5 | power 0.4 to 0.6 | Pecks deal 0.6x. |
| 6 | life 0 to 6 | Wrens stay 6 s. |
| 7 | chance 0.25 to 0.35 | 35% chance. |
| 8 | power 0.6 to 0.8 | Pecks deal 0.8x. |
| Evolved | count 2 to 4, chorus 0 to 1 | Four wrens every Toll; pecks add Age. |

Evolution: **Cuckoo Chorus** (partner `m_wither`). Every Toll sends four wrens whose pecks add Age.

### m_orrery: Orrery

summon, easy, auto. A cast may set gear planets orbiting her that grind foes they touch.

Values: chance: chance a cast calls them; cooldown: seconds between orreries; count: gears; radius: their orbit; life: seconds; power: ability power a gear deals every 0.3 s; slow: 1 gears slow foes; celestial: 1 gears orbit all the time and spin out at foes on each cast (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.25, cooldown 2, count 3, radius 28, life 5, power 0.3 | 25% on a cast: three gears orbit for 5 s. |
| 2 | chance 0.25 to 0.4 | 40% chance. |
| 3 | radius 28 to 36 | Gears orbit at 36 px. |
| 4 | count 3 to 4 | Four gears. |
| 5 | power 0.3 to 0.45 | Gears deal 0.45x. |
| 6 | life 5 to 8 | Gears orbit 8 s. |
| 7 | slow 0 to 1 | Gears slow foes. |
| 8 | power 0.45 to 0.7 | Gears deal 0.7x. |
| Evolved | celestial 0 to 1 | Gears always out; they spin out on casts. |

Evolution: **Celestial Clock** (partner `m_handsweep`). The gears orbit her all the time and spin out at foes on each cast.

### m_patience: Patience

passive, easy, auto. Sand refills faster and goes further.

Values: refill: share faster Sand refills; max: Sand above 100 she can hold; field: share less the Stillfield costs; rewind: Sand less a Rewind costs; echo: share more her echoes deal to still foes; timeless: 1 Sand keeps refilling while a Stillfield stands (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | refill 0.25 | Sand refills 25% faster. |
| 2 | max 0 to 20 | Hold 20 more Sand. |
| 3 | refill 0.25 to 0.4 | Sand refills 40% faster. |
| 4 | field 0 to 0.2 | The Stillfield costs 20% less. |
| 5 | rewind 0 to 5 | Rewind costs 5 less Sand. |
| 6 | echo 0 to 0.15 | Echoes on still foes deal 15% more. |
| 7 | max 20 to 30 | Hold 30 more Sand. |
| 8 | refill 0.4 to 0.6 | Sand refills 60% faster. |
| Evolved | timeless 0 to 1 | Sand refills while a field stands. |

Evolution: **Timeless** (partner `m_pastself`). Sand keeps refilling while a Stillfield stands.

### m_noon: Eternal Noon

ultimate, timed, U. Replaces Hour of Stillness: every foe on screen stops, and the damage it takes while stopped returns.

Values: stop: seconds every foe on screen stops; returns: share of the damage a foe took while stopped that lands again when it restarts; power: share of the level's power each foe takes at the toll; echoes: 1 her echoes on stopped foes hit at full; stun: seconds the toll stuns; endless: 1 the stored damage has no cap (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stop 1.6, returns 0.4, power 0.8 | Stop the screen 1.6 s; 40% returns, 0.8x. |
| 2 | stop 1.6 to 2 | Foes stop for 2.0 s. |
| 3 | returns 0.4 to 0.6 | 60% of stored damage returns. |
| 4 | power 0.8 to 1.6 | The toll deals 1.6x. |
| 5 | echoes 0 to 1 | Echoes on stopped foes hit at full. |
| 6 | stop 2 to 2.6 | Foes stop for 2.6 s. |
| 7 | stun 0 to 1 | The toll stuns for 1 s. |
| 8 | power 1.6 to 4 | The toll deals 4x. |
| Evolved | stop 2.6 to 3.5, returns 0.6 to 1, power 4 to 6, endless 0 to 1 | Stop 3.5 s; all stored damage returns. |

Evolution: **Endless Noon** (partner `m_patience`). Foes stop for 3.5 s, and the damage they take while stopped returns in full with no cap.
