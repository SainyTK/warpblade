# Hulda's skills

Hulda's part of the skill rework (`docs/skill-design.md`).
Working design: numbers are starting values for the constants files.
Her identity stays: slow, short reach, no dodge, armour plates, grabs and throws, Grit earned by fighting.

## Units and rates

Damage is written as a multiple of attack damage (x AD), the way her kit already deals it from `progress.stats.ad`.
At the start of a run AD is 12, so 1 AD/s is 12 damage a second.
Bellow keeps ability power.
Her new spells use AD, because her AP is 6 and her spells are physical (see Contract points).

Rates of ordinary play used in every number below, at attack speed 1:

| Event | Rate | Basis |
| --- | --- | --- |
| J blow landed, one foe | 1.8 a second | The 3-blow string runs 35 frames (1.17 s); with walking back in after the haymaker's knockback about 70% of blows land. |
| J foe-hits, crowd of 6 | 3.6 a second | Her box is 14 px wide, so a blow catches about 2 foes in a crowd. |
| Haymaker landed | 0.6 a second | One per string. |
| Grab and throw | 0.3 a second | A grab, three knees and a throw take about 1.6 s, plus the walk in. |
| Bull Rush | 0.4 a second | 25 of 120 stamina, 0.4 s cooldown; her only travel move. |
| Casts of one spell | 0.3 a second | MP income about 5.6 a second (2 regen, 2 per landed blow), shared over the rotation. |
| Precise trigger (counter grab, Skyfall catch, Iron Wall release, armoured counter) | 0.2 a second | A skilled player, with foes winding up and fliers around. |
| Ultimate | one per 20 s | Charge level 2 (4.5x AD). |
| Fury | +x% on a build dealing 6 AD/s | The shared buff of her precise skills, counted with its uptime. |

Budget at level 8, one foe: `easy` about 2.4 AD/s, `timed` about 3.8, `precise` about 6 to 7.
Crowd of 6: `easy` about 7 to 8, `timed` about 10 to 11, `precise` about 8 to 10 (precise skills aim at one foe).

## Base kit with no skill

Combo length: **3** (`comboHits: 3`).
Her blows knock foes back and her armour already lets her stay in, so the grab is her extender.
Air limit: **1** hammer fist and **1** Skyfall Grab per airtime.
Skyfall Breaker level 6 is the one skill that gives a second Skyfall after a catch.

| Key | Base kit |
| --- | --- |
| J | Fist string: jab 0.9x, body hook 1.3x (breaks guards), haymaker 2.8x (armoured wind-up, stun 0.5 s); short pushes so she stays in reach; the first blow faces the held direction or turns to a foe only behind her. In the air one hammer fist 0.9x that spikes. While holding a foe, a knee 0.5x (up to 3). |
| K | Grab: holds a minion, crushes a mini or boss for 1.3x. While holding, the throw, picked by the situation (below). In the air, Skyfall Grab (catch, ride, slam 2.0x, ring 0.8x). |
| L | Bull Rush: armoured shoulder charge the way she is pushed, 0.6x, a short shove and stun 0.4 s to each foe, 25 stamina. Once she has run into a foe and none waits ahead, it stops at the next stride and she wheels round to the foe, so a lone foe stays in reach. Still allowed out of a landed blow's recovery. |
| Up | One low jump. Down with Up drops through a ledge. |
| I | The ability in the rotation: Bellow (20 MP, 4x AP, pulls foes in, drags fliers down) or Taunt (free, 3 s cooldown, 24 Grit over two slaps). |
| O | Switches the I rotation. With no skill it switches between Bellow and Taunt. |
| U | Quake Drop. |

The throw picks itself.
She suplexes (2.2x, 30 px ring 0.8x behind her) unless a foe stands within 100 px ahead and more foes stand ahead than within 40 px behind; then she throws forward (1.2x, the body strikes each foe it meets for 1.0x and lands for 0.6x).
Alone with one foe she suplexes it for the most damage; facing a crowd she bowls the foe into it; surrounded from behind she slams it into them.
The hold still runs out into a throw on its own.

Base DPS (string only): 1.8 AD/s on one foe, 3.6 AD/s on a crowd.
Grab and throw cycles add about 1.1 AD/s on one foe (3.7x every 3.3 s).

The string drops the cross. Balance round 2 (`docs/skills/balance.md`) made the hook break guards and shortened the pushes.
Its raise of the blows to 8.1x a string made up for contact the room's player lost; once the rush stopped carrying her past a lone foe they came back to 5.0x a string (round 3 in the balance file).

## What goes away and where it went

| Today | Why it goes | Where the useful part went |
| --- | --- | --- |
| Cross, the 4th blow | Combo length 3 | Its damage is folded into jab 0.55 to 0.6 and hook 0.85 to 0.9. |
| Uppercut, a 5th blow (`b_uppercut`) | No skill adds hits | Its launch is Wrecking Haymaker level 4 and Tremor Stomp level 3. |
| Knuckle Rush, J held as the haymaker ends (`b_knuckles`) | Extended combo input, extra hits | Its burst of damage after the haymaker is Knuckle Wave; the extra punches are gone. |
| Suplex, the side behind with K | Directional input in the hold | The base throw picks forward or suplex by where the foes stand. |
| Sky Toss, Up with K | Directional input in the hold | Dropped; with a 3-blow string a juggle has little to catch. Launches come from skills. |
| Giant Swing, Down with K (`h_swing`) | Directional input in the hold | Giant Swing skill: the throw becomes a swing on its own when foes crowd her. |
| Taunt on O | O switches abilities in the contract | Taunt is the second base ability in the I rotation. |
| Heavy Hands (`b_hands`) | Flat stat node | The Might charm. |
| Thick Hide, Iron Plates, Second Wind (`i_hide`, `i_plates`, `i_wind`) | Tree nodes | Iron Hide passive. |
| Bull Horns (`i_horns`) | Tree node | Bull Horns skill, now carrying up to three foes. |
| Iron Grip (`h_grip`) | Tree node | Crushing Grip levels 1 and 2. |
| Wrecking Throw (`h_wreck`), Aftershock Suplex (`x_aftershock`) | Tree nodes | Wrecking Throw skill, level 1 and level 4. |
| Rush Grab (`x_rushGrab`) | Fusion node | Iron Chain: a ranged way to bring a foe into her hands. |
| Bellow (`t_bellow`, rank 1 from the start) | Rank gate | Base kit, no rank check. |
| Titan Throw (`b_titan`) | Tree node | Titan Throw ultimate skill. |
| Quake Drop (`b_quake`) | Tree node | Base special. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `h_knuckleWave` | Knuckle Wave | attack | easy | J | `h_bruise` |
| `h_haymaker` | Wrecking Haymaker | attack | timed | J | `h_knuckleWave` |
| `h_counterGrab` | Iron Counter | attack | precise | K | `h_ironWall` |
| `h_wreckingThrow` | Wrecking Throw | attack | timed | K | `h_giantSwing` |
| `h_giantSwing` | Giant Swing | attack | easy | K | `h_ironChain` |
| `h_bullHorns` | Bull Horns | movement | timed | L | `h_ironHide` |
| `h_stampede` | Stampede | movement | easy | L | `h_shieldSister` |
| `h_skyfall` | Skyfall Breaker | movement | precise | K (air) | `h_counterGrab` |
| `h_ironHide` | Iron Hide | passive | easy | auto | `h_rustShards` |
| `h_ironChain` | Iron Chain | spell | timed | I | `h_tremorStomp` |
| `h_tremorStomp` | Tremor Stomp | spell | easy | I | `h_stampede` |
| `h_ironWall` | Iron Wall | spell | precise | I | `h_ancestorFist` |
| `h_bruise` | Bruising Knuckles | dot | easy | J | `h_haymaker` |
| `h_fracture` | Crushing Grip | dot | timed | K | `h_wreckingThrow` |
| `h_rustShards` | Rust Shards | dot | easy | auto | `h_ironHide` |
| `h_shieldSister` | Shield-Sister | summon | easy | auto | `h_stampede` |
| `h_spiritBear` | Spirit Bear | summon | timed | auto | `h_bullHorns` |
| `h_ancestorFist` | Ancestor's Fist | summon | precise | auto | `h_skyfall` |
| `h_titanThrow` | Titan Throw | ultimate | easy | U | `h_giantSwing` |
| `h_unbroken` | Unbroken | ultimate | timed | U | `h_ironHide` |

Counts: attack 5, movement 3, spell 3, dot 3, summon 3, ultimate 2, passive 1.
Risk: easy 9, timed 7, precise 4.

Kit events she emits through the shared function: `grab`, `throw` (when a thrown or slammed foe lands), `armour` (a blow taken on a plate, in the rush, in the haymaker's wind-up or in Iron Wall), `counter` (Iron Counter, Iron Wall release, armoured counter).
An armoured counter is a blow taken in the haymaker's wind-up, in the rush or in Iron Wall: her parry.

Fury is the buff of her precise skills: all her damage up by the given share for 4 s; the highest share wins and a new one refreshes the time.
One owner in `src/game/skills/hulda/fury.ts`.

### h_knuckleWave: Knuckle Wave

attack, easy, J. Blows push a pressure wave ahead that reaches past her short fist.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Haymaker sends a wave 30 px, 0.4x, stops at the first foe | The haymaker pushes a wave ahead. |
| 2 | 0.6x | Wave damage +50%. |
| 3 | The hook sends a wave too | The hook sends a wave too. |
| 4 | Waves pierce every foe in their path | Waves pass through every foe. |
| 5 | 50 px, 0.8x | Waves reach further and hit harder. |
| 6 | The jab sends a wave too | Every blow sends a wave. |
| 7 | Waves stagger 0.3 s | Waves stagger. |
| 8 | 60 px, 2.6x | Wave damage doubled, longer reach. |

Evolution: **Thunder Knuckles** (partner `h_bruise`). Every wave runs 120 px both ways and bursts in a 30 px ring at its end, at 1.8x. An easy evolution: area and reliability.

Build: new `effects/knuckleWave.ts` from `effects/echo.ts` (crescent flight, rust ramp); fired from `land()` in `hero/hulda/fists.ts` on a skill check. Source `attacks` (it rides her press).

### h_haymaker: Wrecking Haymaker

attack, timed, J. The string's last blow becomes her big hit.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Haymaker +0.6x | The haymaker hits harder. |
| 2 | On hit, a crack 24 px ahead: 0.5x to foes on the floor there | The haymaker cracks the floor ahead. |
| 3 | +1.2x total, stun 0.9 s | Harder haymaker, longer stun. |
| 4 | Throws minions up (launch -260) | The haymaker throws minions up. |
| 5 | +2.0x total, crack 48 px, 0.8x | Wider, harder crack. |
| 6 | The crack also runs behind her | The crack runs both ways. |
| 7 | Foes within 30 px of the struck foe are knocked down, 0.6x | The blow knocks down foes beside it. |
| 8 | +5.0x total, crack 1.2x | Haymaker +3x, crack +50%. |

Evolution: **Meteor Haymaker** (partner `h_knuckleWave`). The haymaker spikes its foe into the floor for a second impact of 3x, and the crack becomes a quake 60 px each way that launches minions. Haymaker +8x total.

Build: `FISTS.haymaker` power read through `skillValues`; crack with `effects/floorCrack.ts`; the knock-down from `slamRing` in `hero/hulda/slam.ts`; the spike from the hammer fist's `spike` option.

### h_counterGrab: Iron Counter

attack, precise, K. A grab that catches a foe winding up a blow (`wind` or `charge`) is a counter.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Counter catch 2x and a plate of Grit | Grab a foe winding up: 2x and a plate. |
| 2 | 3.5x | Counter damage up. |
| 3 | Also a counter within the 0.8 s after a plate breaks | Counter right after a plate breaks. |
| 4 | On a mini or boss the counter crush deals 1.5 times and stuns 1.2 s | Counters crush big foes. |
| 5 | A counter gives Fury +25% | A counter gives Fury. |
| 6 | 6x; the throw after a counter deals double | Counter 6x, its throw doubled. |
| 7 | A counter roars: other foes within 50 px reel 0.8 s | A counter makes foes nearby reel. |
| 8 | 70x, Fury +50%, refills every plate | Huge counter, more Fury, full plates. |

Evolution: **Executioner's Grip** (partner `h_ironWall`). Every counter deals 160x, and a counter on a mini or boss holds it for 1 s and suplexes it for 120x. Fury +80%, and while it lasts no blow breaks a plate.

Build: `pressGrab`/`runGrab` in `hero/hulda/grab.ts` read the foe's state at the catch; crush from `runCrush`; new `fury.ts`; emits `counter`. Pose: the grab clip with a two-frame hit-stop flash; the evolution's big-foe hold needs a heavy hold pose (the suplex lift clip at arm's length).

### h_wreckingThrow: Wrecking Throw

attack, timed, K. Thrown foes become bombs.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | A thrown body bursts on landing, 24 px, 0.6x | A thrown foe bursts where it lands. |
| 2 | The body strikes foes in its path for 1.5x | Thrown foes hit harder. |
| 3 | The body bounces once and bursts again | Thrown foes bounce and burst twice. |
| 4 | Suplex and Skyfall rings 50% wider and launch minions | The suplex ring is wider and throws foes up. |
| 5 | Burst 36 px, 1.2x | Bigger burst. |
| 6 | Foes the body strikes fly on as bodies too | Struck foes are flung along. |
| 7 | Bursts stun 1.0 s | Bursts stun. |
| 8 | Path 2.5x, burst 3.0x | Path +1x, burst +1.8x. |

Evolution: **Human Cannonball** (partner `h_giantSwing`). The body flies until it meets a wall, bursting on every foe it meets for 3x, and its crash is a 60 px blast of 4x.

Build: `effects/thrownBody.ts` (it already has `THROWN.wreckRing`), `slamRing`, `AFTERSHOCK_SUPLEX`. Chained bodies reuse `hurl()` from `throws.ts`.

### h_giantSwing: Giant Swing

attack, easy, K. With two or more other foes within 40 px when she throws, the throw is a Giant Swing on its own.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Two turns, 0.6x to each foe near per turn, then a forward throw | Throw into a crowd: swing the foe round you. |
| 2 | 0.9x a turn | Swing damage up. |
| 3 | The held foe takes each turn's hit too | The swung foe takes the hits too. |
| 4 | Three turns | One more turn. |
| 5 | Reach 26 to 40 px | Wider swing. |
| 6 | Foes struck are dragged 12 px toward her | The swing drags foes in. |
| 7 | The release knocks down foes within 30 px, 1.0x | The release knocks foes down. |
| 8 | 1.2x a turn, reach 48 px | Swing +33%, wider. |

Evolution: **Cyclone** (partner `h_ironChain`). The swing lasts 2 s and she walks while it spins, reach 60 px, a hit every 0.25 s at 1.2x, pulling foes in. An easy evolution: area.

Build: `runSwing` in `hero/hulda/throws.ts`; the situational pick goes in the new throw chooser. The Cyclone walk needs the swing clip looped with her stride (`HULDA_STRIDE`).

### h_bullHorns: Bull Horns

movement, timed, L. The rush picks foes up on her shoulder and slams them at the end.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | First minion rides her shoulder, slammed at the end for 1.0x | The rush lifts a foe and slams it. |
| 2 | 1.6x | Harder slam. |
| 3 | Carries up to 2 | Carry two foes. |
| 4 | The slam rings 30 px, 0.8x, knocking foes down | The slam knocks down foes near it. |
| 5 | Rush 0.32 to 0.4 s | Longer rush. |
| 6 | Carries 3; minis and bosses are shoved along and take the slam | Carry three, shove big foes. |
| 7 | The slam throws minions up | The slam throws foes up. |
| 8 | Slam 6x, ring 40 px 2.5x | Slam +4.4x, bigger ring. |

Evolution: **Juggernaut** (partner `h_ironHide`). No cap on foes carried, the rush runs twice as far and takes no damage, and the slam is a 60 px crater of 8x.

Build: `hulda.carried` in `hero/hulda/rush.ts` becomes a list; `slamCarried` plus `slamRing`. The stacked carry needs a pose offset per carried foe; the shove reuses `pin` with the big foe at arm's length.

### h_stampede: Stampede

movement, easy, L. The rush gets cheaper, longer and cracks the floor behind her.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | A cracked trail hits foes on it 0.3 s later for 0.3x | The rush leaves a cracked trail. |
| 2 | Cost 25 to 15 stamina | Cheaper rush. |
| 3 | The trail cracks a second time 0.4 s later | The trail strikes twice. |
| 4 | Rush 40% further | Longer rush. |
| 5 | Foes she passes are dragged 20 px along in her wake | The rush drags foes along. |
| 6 | L in the skid starts a second rush, free | Press L again in the skid for a free rush. |
| 7 | The trail throws minions up | The trail throws foes up. |
| 8 | Shoulder 1.5x, trail 1.2x | Shoulder and trail hit far harder. |

Evolution: **Thundering Herd** (partner `h_shieldSister`). The trail stays 3 s and keeps cracking every 0.5 s, and two shield-sisters charge beside each rush. An easy evolution: area and uptime.

Build: `runRush`; trail from `effects/quakeLine.ts` segments laid each ghost tick. Level 6 reads L during the skid (`runEnd` to `RUSH.recover`); it is a second press of the same travel move and no combo input.

### h_skyfall: Skyfall Breaker

movement, precise, K in the air. Catching a foe from the air is a hard read; it pays big.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Slam 2.5x, lunge 30% further | Longer lunge, harder slam. |
| 2 | Slam 4x | Slam damage up. |
| 3 | Catches a mini or boss: she rides its back 1 s, pounds twice for 2x, leaps off | Ride big foes and pound them. |
| 4 | The ride drags foes under her path into the slam | The dive drags foes into the slam. |
| 5 | Ring 50 px, 1.5x | Bigger ring. |
| 6 | A catch gives one more Skyfall before she lands | Catch again before you land. |
| 7 | A catch gives Fury +30% and makes her blows break guards for 4 s | A catch gives Fury. |
| 8 | Slam 20x, pounds 3x and three of them | Slam 20x, three pounds. |

Evolution: **Comet Grab** (partner `h_counterGrab`). K on the floor with no foe in reach leaps her into a Skyfall. The slam is 40x, and a catch gives Fury +60% and a full plate.

Data since balance round 3: level 8 slam 46x, Comet Grab 65x. The slam and pounds strike only the caught foe, which is the precise payoff; dragged foes take only the ring, the skill's own area.

Build: `hero/hulda/skyfall.ts`; the ride needs a new pose (kneeling on the foe's back, both fists overhead, reusing the hammer fist keys) and a `ride` state.

### h_ironHide: Iron Hide

passive, easy, auto. Her plates get thicker.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Runs start with 2 plates; a plate cuts a blow to 45% | Start with two plates. |
| 2 | Max HP +10% | More HP. |
| 3 | A broken plate heals 3% of max HP | Broken plates heal you. |
| 4 | A fifth plate (Grit 125) | A fifth plate. |
| 5 | Plates cut to 35% | Plates take more. |
| 6 | Grit drains at half speed; J blows give 6 Grit | Grit lasts longer. |
| 7 | A broken plate knocks down foes within 24 px | Breaking plates knock foes down. |
| 8 | Plates cut to 25%, heal 6% | Plates take far more. |

Evolution: **Living Fortress** (partner `h_rustShards`). Six plates, one plate regrows every 6 s while foes are near, and each break throws three Rust stacks onto foes within 40 px.

Build: `armour.ts`, `grit.ts` (`GRIT.ironPlated` and `secondWind` exist); `ui/gritBar.ts` draws 5 and 6 plates.

### h_ironChain: Iron Chain

spell, timed, I (18 MP, 5 s). Her gauntlet flies out on a chain and drags a foe into her hands.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Hooks the first foe within 100 px, 0.6x; a minion arrives held | Chain a foe into your hands. |
| 2 | 1.0x | Chain damage up. |
| 3 | Drags up to 3 foes on the line into a heap at her feet, stunned 0.8 s; the first is held | The chain drags three. |
| 4 | On a mini or boss she is yanked to it and crushes it for 2x | Yank yourself to big foes. |
| 5 | Range 160 px, 4 s | Longer chain, faster recharge. |
| 6 | Fires ahead and behind | The chain fires both ways. |
| 7 | Dragged foes collide: 1.0x each per other dragged foe, up to 3 | Dragged foes crash together. |
| 8 | 3.0x | Chain damage +2x. |

Evolution: **Hell Chains** (partner `h_tremorStomp`). Four chains fan out over 200 px, every foe they meet is dragged into the heap, and the heap's landing stomps for 2x in a 50 px ring.

Build: new `skills/hulda/ironChain.ts` and `effects/chainHook.ts`, drawn like Titan Throw's tethers (`ultimates/titanThrow.ts`); `take()` from `hold.ts`. Pose: a new straight-arm thrust and haul clip in `constants/clips/hulda/`.

### h_tremorStomp: Tremor Stomp

spell, easy, I (15 MP, 3 s). A stomp sends a tremor along the floor round her.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Foes on the floor within 50 px, 0.6x, minions reel 0.4 s | Stomp the floor round you. |
| 2 | 0.9x | Stomp damage up. |
| 3 | Throws minions up | The stomp throws foes up. |
| 4 | A second tremor 0.4 s later out to 80 px | A second, wider tremor. |
| 5 | 70 px and 110 px | Wider tremors. |
| 6 | Fliers within reach are shaken down 40 px and reel | The stomp shakes fliers down. |
| 7 | Each stomp gives 15 Grit | The stomp gives Grit. |
| 8 | 2.0x each tremor, 2.5 s | Stomp +1.1x, faster recharge. |

Evolution: **Earthbreaker** (partner `h_stampede`). Each tremor runs wall to wall along every floor she stands on at 2.0x. An easy evolution: area.

Build: new `skills/hulda/tremorStomp.ts`; rings from `effects/floorRing.ts` and `effects/shockwave.ts`; the flier drag from `bellow.ts`. Pose: a stomp clip from the Quake Drop hop without the fists raised.

### h_ironWall: Iron Wall

spell, precise, I (10 MP, 4 s). She braces 0.6 s; blows taken in the brace break no plate and load a counter blow she lets go at the end.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Release 30 px ahead: 7x if a blow was taken, else 0.5x | Brace and answer a blow. |
| 2 | 8x | Release damage up. |
| 3 | A blow taken refills a plate | A blow in the brace gives a plate. |
| 4 | The release is a ring round her | The release strikes both sides. |
| 5 | Brace 0.8 s, 10x | Longer brace, harder release. |
| 6 | Each blow taken adds to the release, up to 3 | Every blow taken adds to the release. |
| 7 | A loaded release gives Fury +30% | A loaded release gives Fury. |
| 8 | 12x per blow | A shattering release. |

Evolution: **Unbreakable Wall** (partner `h_ancestorFist`). Brace 1.2 s, every blow taken calls an Ancestor's Fist on its attacker at once, the release is 15x per blow, and Fury +60%.

Build: new `skills/hulda/ironWall.ts`; `steadfast()` in `armour.ts` gets a brace branch; release with `effects/shockwave.ts`. Pose: a new brace clip (wide stance, gauntlets crossed) that loops while held, plus the release punch from the haymaker's hit keys.

### h_bruise: Bruising Knuckles

dot, easy, J. Studs on her knuckles leave bruises that keep hurting.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Each blow adds a Bruise, up to 3, 0.08x a second each for 3 s | Blows leave bruises. |
| 2 | 0.1x a second | Bruises hurt more. |
| 3 | The haymaker adds 3 stacks | The haymaker bruises deep. |
| 4 | Knees and throws add 2 stacks | Knees and throws bruise. |
| 5 | Up to 8 stacks, 5 s | More bruises, lasting longer. |
| 6 | A foe that dies bruised passes half its stacks to foes within 30 px | Bruises spread on a kill. |
| 7 | 0.22x a second; bruised foes take 10% more from blows | Bruised foes take more. |
| 8 | Up to 12, 0.5x a second | Up to 12 bruises, far stronger. |

Evolution: **Shatter** (partner `h_haymaker`). A haymaker, slam or throw on a bruised foe shatters every stack at once for 2x each and gives half the stacks to foes within 40 px.

Build: a per-foe stack store (see Contract points), ticked in `skills/hulda/bruise.ts`; added from `land()` and the knee and throw hits. Source `h_bruise`. Purple-red mark under the foe's health pip.

### h_fracture: Crushing Grip

dot, timed, K. Her grip breaks bones: held foes are crushed, and they leave fractured.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | A held foe takes 0.3x a second; hold 1.4 to 1.8 s | Held foes are crushed. |
| 2 | Knees 0.75x | Knees hit harder. |
| 3 | A thrown or dropped foe keeps a Fracture: 0.3x a second for 4 s | Thrown foes stay fractured. |
| 4 | Fracture passes to every foe the thrown body or ring strikes | Fractures spread to struck foes. |
| 5 | 0.6x a second, hold 2.2 s | Stronger crush, longer hold. |
| 6 | Fractures stack up to 3; a crush on a big foe gives 3 | Fractures stack. |
| 7 | Fractured foes take 20% more from throws and slams | Fractured foes take more from throws. |
| 8 | 1.2x a second a stack | Fractures far stronger. |

Evolution: **Bonebreaker** (partner `h_wreckingThrow`). A throw on a foe with 3 Fractures snaps it: all remaining Fracture damage at once times 3, and every foe within 40 px gets 2 stacks.

Build: `holdTime()` and `KNEE` in `hold.ts` and `throws.ts`; the same stack store; spread from `thrownBody.ts` and `slamRing`.

### h_rustShards: Rust Shards

dot, easy, auto. Blows on her armour spray rust that eats the attacker.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | A broken plate throws shards on foes within 30 px: Rust 0.1x a second for 4 s | Broken plates spray rust. |
| 2 | Every blow her armour takes sprays shards | Every armoured blow sprays rust. |
| 3 | Rust stacks up to 3 | Rust stacks. |
| 4 | 0.2x a second a stack | Rust hurts more. |
| 5 | Rusted foes deal 15% less damage | Rusted foes hit softer. |
| 6 | Her J blows on a rusted foe add a stack | Blows spread rust. |
| 7 | 50 px, 6 s, up to 5 stacks | More rust, wider spray. |
| 8 | 0.6x a second a stack | Rust far stronger. |

Evolution: **Rust Reckoning** (partner `h_ironHide`). Every `counter` and every broken plate consumes all Rust on foes within 60 px for 4x per stack, then sprays fresh shards.

Build: `effects/plateShards.ts` thrown outward; trigger from the `armour` event; the same stack store. Source `h_rustShards`.

### h_shieldSister: Shield-Sister

summon, easy, auto (on a landed J blow, own cooldown). A spectral shield-sister of her clan charges through foes.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 15% on a blow, 2.5 s cooldown; she charges 80 px, 1.2x to each foe | A blow may call a shield-sister. |
| 2 | 20%, 1.5x | More often, harder. |
| 3 | She charges back the other way | She charges twice. |
| 4 | 25%, 1.8 s cooldown | More often. |
| 5 | Her shield bash stuns 0.6 s and breaks guards | Her bash stuns. |
| 6 | She stays 4 s, charging the nearest crowd every second | She stays and keeps charging. |
| 7 | Two sisters | Two sisters. |
| 8 | 30%, each pass 1.2x, charge 120 px | Longer charges, more often. |

Evolution: **Shieldwall** (partner `h_stampede`). Four sisters stay, charging every 0.5 s from both sides of the screen across the floor she stands on at 1.2x. An easy evolution: area.

Build: new `skills/hulda/shieldSister.ts`; drawn as a pale tinted copy of the rig in the Bull Rush pose (the afterimage path, `dropMoveGhost`) with a round shield; hit box logic from `runRush`.

### h_spiritBear: Spirit Bear

summon, timed, auto (on `throw`, own cooldown). A spirit bear crashes down where her thrown foe lands.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 35% on a throw, 3 s cooldown; the bear drops for 3x in 30 px | A throw may call a spirit bear. |
| 2 | 4x | The bear hits harder. |
| 3 | The bear stays 3 s and mauls the nearest foe, 0.5x every 0.5 s | The bear stays and mauls. |
| 4 | 50%, 2.5 s cooldown | More often. |
| 5 | The bear roars as it lands, dragging foes within 50 px to it | The bear's roar drags foes in. |
| 6 | Mauls swipe every foe within 24 px | Mauls hit every foe near. |
| 7 | Stays 5 s; suplex, Skyfall and Bull Horns slams also call it | Slams call the bear too. |
| 8 | Drop 5x, mauls 1.2x | The bear hits far harder. |

Evolution: **Bear Clan** (partner `h_bullHorns`). Two bears stay at her side for good, mauling at 1.5x, and each throw makes both drop on the landing.

Build: new `skills/hulda/spiritBear.ts`; a new code-drawn bear (the largest art cost on her list: idle, drop, swipe and roar clips); the roar drag from `bellow.ts`.

### h_ancestorFist: Ancestor's Fist

summon, precise, auto (on an armoured counter, own cooldown). A giant spectral gauntlet answers a blow she took on purpose.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 50% on an armoured counter, 3 s cooldown; the fist slams the attacker for 6x | An armoured counter may call a giant fist. |
| 2 | 10x | The fist hits harder. |
| 3 | The fist grabs the attacker and throws it at the nearest crowd | The fist throws the attacker. |
| 4 | 75%, 2 s cooldown | More often. |
| 5 | The slam rings 24 px at half its damage | The slam strikes foes near. |
| 6 | 100%; it gives Fury +25% | Every armoured counter calls it, with Fury. |
| 7 | A second fist slams the nearest other foe 0.3 s later | A second fist. |
| 8 | 100x | The fist hits far harder. |

Evolution: **Hand of the Mountain** (partner `h_skyfall`). The fist is twice the size, slams for 250x, and pins every foe within 40 px for 1.5 s, taking 50% more from her.

Build: new `skills/hulda/ancestorFist.ts`; drawn by scaling `hero/draw/gauntlets.ts` with a pale ramp; slam with `slamRing`; throw with `hurl()`.

### h_titanThrow: Titan Throw

ultimate, easy, U. Replaces Quake Drop: tethers pull minions into a heap she hurls.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | Replaces Quake Drop; reach 80 px; path 0.6x, burst 1.0x of the level's power | Heap the minions and hurl them. |
| 2 | Tethers drag fliers down too | Tethers catch fliers. |
| 3 | Minis and bosses are dragged to the landing spot | Big foes are dragged to the landing. |
| 4 | Burst 1.3x, reach 120 px | Bigger burst, longer tethers. |
| 5 | The heap bounces once and bursts again | The heap bursts twice. |
| 6 | Cooldown 20 to 16 s | Faster recharge. |
| 7 | The heap scatters into bodies that each strike foes they meet for 1.0x | The heap scatters. |
| 8 | Burst 5x, path 1.5x | Burst far harder. |

Evolution: **Mountain Hurl** (partner `h_giantSwing`). She swings the heap round twice first, striking everything within 60 px each turn for 1.0x, then hurls it wall to wall; burst 9x, path 1.5x.

Build: `ultimates/titanThrow.ts` and `TITAN` constants; the swing reuses the Giant Swing keys with the heap pinned.

### h_unbroken: Unbroken

ultimate, timed, U. Replaces Quake Drop: an iron form for a few seconds; the charge level adds time.

| Lv | Change | Card |
| --- | --- | --- |
| 1 | 4 s (+1 s a charge level): no blow breaks a plate or flinches her; her damage +20% | Turn to iron for a few seconds. |
| 2 | +35% | More damage in iron. |
| 3 | Every blow she lands quakes the floor 40 px each way, 1.0x (one quake each 0.2 s) | Blows quake the floor. |
| 4 | Fills Grit at the start and ends in a level 1 Quake Drop | Start full, end with a quake. |
| 5 | 6 s, +50% | Longer and stronger. |
| 6 | Full walk speed while holding; throws +50% | Hold and throw at full strength. |
| 7 | Foes that strike her are knocked down 0.8 s | Foes that hit you fall. |
| 8 | +100%, quakes 9x | Far stronger iron. |

Evolution: **Iron Titan** (partner `h_ironHide`). 10 s; her blows quake for 20x, every step she takes quakes the floor 30 px for 0.6x, and her grab holds minis and bosses.

Build: new `ultimates/unbroken.ts`; armour through `steadfast()`; quakes from `effects/quakeLine.ts`; a steel tint over her skin ramp and lit plates on the pauldron. No new clip apart from a chest-slam start (the taunt slap held).

## Balance

DPS in AD per second (multiply by 12 for damage at the start of a run), the skill's own damage only, at the rates above.
"Fury" adds the buff's share times its uptime on a build dealing 6 AD/s.

| Skill | Risk | One foe L1 | L8 | Evolved | Crowd of 6 L1 | L8 | Evolved | Assumption |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Knuckle Wave | easy | 0.24 | 2.3 | 2.6 | 0.24 | 7.0 | 13 | L1 0.4x at 0.6 haymakers/s; L8 1.3x at 1.8 blows/s; crowd waves pierce about 3 foes. |
| Wrecking Haymaker | timed | 0.36 | 3.4 | 6.6 | 0.5 | 9.2 | 17 | 0.6 haymakers/s; L8 +5x plus half the crack on the same foe; crowd 1.5 foes in the box, crack 3 ahead and 2 behind, knock-down 3. |
| Iron Counter | precise | 0.4 | 6.0 | 9.8 | 0.4 | 6.5 | 10 | Big foe, 0.2 counters/s; L8 18x (12x times 1.5) = 3.6, Fury +50% at 80% uptime = 2.4. |
| Wrecking Throw | timed | 0.18 | 1.8 | 3.6 | 0.36 | 10.4 | 18 | 0.3 throws/s; L8 crowd 2 bursts on 4 foes at 3x, path on 3, chained bodies about 6x. |
| Giant Swing | easy | 0 | 1.1 | 1.5 | 0.9 | 8.0 | 14 | 0.3 throws/s; needs 2 foes near; L8 3 turns at 1.2x on 5 foes plus the held one and the release ring. |
| Bull Horns | timed | 0.4 | 2.4 | 4.0 | 0.4 | 10.2 | 18 | 0.4 rushes/s; L8 three carried at 6x and a 2.5x ring on 3. |
| Stampede | easy | 0.1 | 2.0 | 2.6 | 0.5 | 7.9 | 14 | 0.4 rushes/s, 0.6 from L6; L8 shoulder +0.9x and trail 2 x 1.2x on 4 foes in the path. |
| Skyfall Breaker | precise | 0.1 | 6.0 | 10 | 0.2 | 7.5 | 13 | Big foe or flier, 0.2 catches/s; L8 +18x slam, 9x pounds = 5.4, Fury 0.6. |
| Iron Hide | passive | 0 | 0 | 0.5 | 0 | 0 | 2 | Defence: L8 a blow on a plate takes 25%, five plates, 6% heal a break. |
| Iron Chain | timed | 0.12 | 2.1 | 3.0 | 0.12 | 11 | 18 | 0.25 casts/s; one foe counts the 2x yank crush on a big foe; crowd 6 dragged at 3x plus 3 collisions, plus the throw it sets up. |
| Tremor Stomp | easy | 0.15 | 1.4 | 2.0 | 0.5 | 8.4 | 15 | 0.35 casts/s; L8 two tremors at 2x; crowd all 6 on the floor in reach. |
| Iron Wall | precise | 0.6 | 6.2 | 10 | 0.6 | 8.0 | 16 | 0.2 loaded releases/s, one blow each; L8 24x = 4.8, Fury 1.4; crowd adds the ring on 2 more foes. |
| Bruising Knuckles | easy dot | 0.24 | 3.8 | 6.0 | 0.3 | 9.6 | 20 | 1.8 blows/s keeps stacks at cap; L8 12 stacks at 0.3x and +10% on blows; crowd 4 foes at about 8 stacks. |
| Crushing Grip | timed dot | 0.13 | 4.6 | 7.0 | 0.2 | 8.0 | 22 | 0.3 grabs/s; held 40% of the time; L8 3 stacks at 1.2x at full uptime; crowd stacks spread to about 4 foes. |
| Rust Shards | easy dot | 0.04 | 2.5 | 4.5 | 0.15 | 10 | 18 | 0.1 armoured blows/s on one foe, 0.3 in a crowd; L8 5 stacks at 0.5x kept up by blows; crowd 5 foes at 4 stacks. |
| Shield-Sister | easy | 0.26 | 2.4 | 3.0 | 0.5 | 7.2 | 14 | L1 0.27 calls/s, 80% hit; L8 two sisters charging each second, two passes at 1.2x, half land on a lone foe; crowd 3 a pass. |
| Spirit Bear | timed | 0.32 | 3.7 | 5.5 | 0.6 | 11 | 18 | L1 0.1 calls/s at 3x; L8 0.25 calls/s at 5x plus mauls at 2.4/s near full uptime; crowd drop on 4, swipe on 2.5. |
| Ancestor's Fist | precise | 0.6 | 6.7 | 11 | 0.8 | 9.0 | 16 | 0.2 armoured counters/s; L8 30x = 6.0, Fury 0.7. |
| Titan Throw | easy ult | 0.23 | 1.1 | 1.6 | 1.4 | 8.4 | 14 | One a 20 s (16 s from L6) at 4.5x; crowd 6 in the heap. |
| Unbroken | timed ult | 0.43 | 1.9 | 3.0 | 0.8 | 4.5 | 7 | One a 20 s; L1 4 s of +20% on 2 AD/s base; L8 8 s at +80% plus quakes. |

Checks against the contract:

- Easy at L8, one foe: 1.1 to 2.4 (the area ones sit low on one foe and reach 7 to 8.4 on a crowd).
- Timed at L8, one foe: 1.8 to 3.7, about 1.5 times easy; crowd 9.2 to 11, about 1.4 times easy.
  Wrecking Throw and Bull Horns sit low on one foe on purpose: their target is a crowd.
- Precise at L8, one foe: 6.0 to 6.7, 2.5 to 2.8 times easy. Each needs Fury in the count; without a build they sit near 2 times.
- Dot below attack at L1 to L4: Bruising Knuckles L4 0.5 against Knuckle Wave L4 0.72; Crushing Grip L4 0.43 against Wrecking Haymaker L4 0.87; Rust Shards L4 0.12. Above at L7 and L8: 3.8, 4.6 and 2.5 against 2.3 and 3.4.
- L8 against L1, on the intended target: Knuckle Wave, Wrecking Haymaker, Wrecking Throw, Bull Horns, Tremor Stomp, Iron Wall and Iron Counter without Fury land at 6 to 10 times.
  Skills whose level 1 is a small add-on to a base move run higher on the add-on alone (Skyfall Breaker, Stampede, Iron Chain, Giant Swing); measured on the whole move they are 8 to 12 times.
  Dots and summons run 10 to 60 times, because the early level is weak on purpose and chance and count grow together (see Contract points).
  The two ultimates run 4 to 5 times, since the base special already deals most of their damage.

## Builds

Three example builds of 8 and the three each would evolve.

**Brawler** (J and the floor; easy to play): Knuckle Wave, Wrecking Haymaker, Bruising Knuckles, Shield-Sister, Stampede, Tremor Stomp, Iron Hide, Unbroken.
Evolve Knuckle Wave (Bruising Knuckles), Bruising Knuckles (Wrecking Haymaker) and Shield-Sister (Stampede).
Thunder Knuckles spreads bruises down the floor, Shatter turns them into haymaker bursts, Shieldwall keeps the crowd moving into her fists.

**Grappler** (grabs and throws): Wrecking Throw, Giant Swing, Crushing Grip, Iron Chain, Bull Horns, Spirit Bear, Titan Throw, Iron Hide.
Evolve Wrecking Throw (Giant Swing), Crushing Grip (Wrecking Throw) and Giant Swing (Iron Chain).
Iron Chain fills her hands, Cyclone gathers the crowd, Bonebreaker and Human Cannonball turn every throw into a blast. Spirit Bear and Titan Throw are the next ready ones, which is where skips and banishes decide.

**Iron Wall** (precise; armour as a parry): Iron Counter, Iron Wall, Ancestor's Fist, Skyfall Breaker, Rust Shards, Iron Hide, Wrecking Haymaker, Unbroken.
Evolve Iron Counter (Iron Wall), Iron Wall (Ancestor's Fist) and Ancestor's Fist (Skyfall Breaker).
She walks into blows on purpose: every absorbed blow calls a fist, loads a wall and keeps Fury lit; Rust Shards and Iron Hide pay for the hits she takes. Highest damage on bosses, hard to play.

The partner graph keeps each theme in a chain (Knuckle Wave, Bruising Knuckles, Wrecking Haymaker; Wrecking Throw, Giant Swing, Iron Chain, Tremor Stomp, Stampede, Shield-Sister; Iron Counter, Iron Wall, Ancestor's Fist, Skyfall Breaker), so a focused build has more ready evolutions than it can take, and Iron Hide links the armour skills across themes.

## Contract points

Points where Hulda's design needs the contract or the framework to move; not changed here.

- O is Hulda's Taunt today, and the contract makes O the ability switch. This design moves Taunt into the I rotation as her second base ability, so O switches between Bellow and Taunt from the first second. The framework's rotation needs to accept kit abilities that cost no MP.
- Spell damage stat: her AP is 6 against AD 12, so AP spells would be half strength. Her new spells deal AD; Bellow stays AP. `SkillDef` should let a skill name the stat it scales from.
- Per-foe stacks: three dots (Bruise, Fracture, Rust) need stacks stored on each foe. `progress.build.memory[id]` is per hero; the framework should offer one shared per-foe stack store (keyed by skill id and seat) so dots of every hero share it.
- Events: she needs `grab`, `throw`, `armour` and `counter` added to the event list, or confirmation that kit-only names are allowed through the shared emit function.
- The 6 to 10 times rule from level 1 to level 8 clashes with dots that are weak early by design and with summons whose chance, count and damage all grow. Suggest the rule applies to attack, movement, spell and passive skills, and dots and summons are judged at level 4 and level 8 only.
- Precise budgets per second need rare, very large hits (12x to 30x AD) or a buff like Fury to reach 2.5 to 3 times easy. Confirm buffs count toward the budget; without them her precise skills sit near 2 times.
- Bull Rush out of a landed blow's recovery stays: L starts the same rush it always does and ends the string. Confirm the owner does not count this as an extended combo input.
- The base throw now picks itself (forward or suplex by where foes stand), which removes all directional input from the hold. This is a base kit change in the kit code, done in the build phase.

## As built

The skill data in `src/constants/characters/hulda/skills/` is the source of truth for numbers; the tables above are the first design.
Changes made while building:

- Balance review must-changes are in the data: Wrecking Haymaker L8 +10x (crack 3x, knock-down 2x); Iron Counter L1 8x and L8 45x, Executioner's Grip 120x; Skyfall Breaker L1 8x and L8 45x with 6x pounds, Comet Grab 120x; Iron Wall L1 7x and L8 50x a blow, Unbreakable Wall 130x with at most 3 fists a brace on Ancestor's Fist's cooldown; Ancestor's Fist L8 55x and Hand of the Mountain 150x; Bull Horns L8 slam 3.5x and ring 1.5x; Stampede L8 shoulder 0.8x and trail 0.6x; Crushing Grip L8 2.5x a second a stack for 8 s; Rust Shards L8 0.3x; Shield-Sister L8 0.8x a pass; Giant Swing gained a level 2 property (swung foes reel).
- Suggestions taken: Wrecking Throw L8 path 3.5x and burst 4x; Titan Throw L8 burst 3x; Unbroken L8 +100%. Per-cast totals against Quake Drop are in the ultimates' code comments.
- Loops closed: flung bodies fling no further and emit no `throw` event; a broken plate heals at most once in 2 s whatever refills it; summons and ticks pass their skill id as source, so they emit no events.
- Iron Hide's start Grit fills when the skill is taken, so a card taken mid-run still gives the plates.
- Rust Shards' weaken softens blows on her while a rusted foe stands within 40 px of her.
- Executioner's Grip's suplex skips the counter's throw doubling, so it stays at 120x.
- Unbroken's start pose is the taunt's chest slap.
