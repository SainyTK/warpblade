# Vesper skills

Vesper's 20 skills, to the contract in `docs/skill-design.md`.
The rows are in `src/heroes/vesper/constants/skills/`, the code in `src/heroes/vesper/game/` (kit hooks) and `src/heroes/vesper/game/skills/` (skills that act on their own), and the icons in `src/heroes/vesper/ui/icons/`.
AD and AP mean her attack damage and ability power (10 and 9 at hero level 1).
Her kit and numbers are in `docs/heroes/vesper.md`.

## Identity

Vesper is the twin blade: a string of paired blows that grows faster with Tempo, the longest air string of the nine, a parry that opens the foes, and abilities she weaves into the string.
Her skills lean on what is hers: Tempo, launches and the air string, the short blade's quick cuts, the warp of the thrown long blade, and the parry's opening.
Every skill is on a single press or runs on its own; nothing asks for a direction, a dash or a double tap during or after the string.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | Four presses of two blows: dusk cross (0.7 + 0.5 AD), rising pair (0.7 + 0.5), scissor turn (0.75 + 0.55), moonrise (0.6, then 1.6 that throws the foe up as she leaps). |
| J (air) | Four presses: swallow cut (0.9), wing cut (0.8), twin wheel (0.65 + 0.6, throws up), nightfall (1.0 spike, landing 1.2 both sides). |
| J (Keen) | The shared Keen timing; a Keen press that lands adds 2 Tempo. |
| J held | The shared warp; she lands with both blades in a cross cut and gains 2 Tempo. |
| K | Crossed blades: 25% through, 14 stamina. Parry: a short-blade cut (0.9 AD, sure crit), 3 Tempo, and for 1.4 s every blow counts as from behind and breaks guards. |
| L | The shared dodge. |
| I | Twin Crescent (10 MP, 3.5 s, two crossing waves of 1.3 AP) or Stitch (12 MP, 5 s, 1.1 AP on up to 3 foes, back to where she started), and the spells below. After a blow has landed, the cast goes off at once and the string goes on. |
| I held | Wide forms for 1.5 times the MP: four waves; a stitch of 5 foes within 110 px. Spells: twice the moons, a gale each way, two more foes on the thread. |
| U | Dusk Waltz, charged in four levels. |
| Up | Jump and double jump. |

Tempo (TP): 0 to 10 stacks, one per blow of the string that lands; each stack plays her moves 3% faster and her walk 1.5% faster; it falls a stack every 0.3 s after 1.3 s without a blow; a blow taken costs half; at the top each short-blade blow sends a 0.35 AD echo cut.

## Air string limit

Four presses in the base kit; Ascending Step adds one at level 1 and another at level 8.
The last press is always the nightfall.
The air presses keep their own count, so the ground string never caps them.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `ve_edge` | Rising Edge | attack | timed | J | `ve_rhythm` | Crescendo |
| `ve_keen` | Twin Keen | attack | precise | J | `ve_turn` | Perfect Pair |
| `ve_sky` | Sky Ribbon | attack | timed | J | `ve_ascend` | Heaven's Ribbon |
| `ve_storm` | Crossing Storm | attack | easy | J | `ve_shade` | Thousand Crossings |
| `ve_turn` | Turning Blade | attack | precise | K | `ve_keen` | Whirling Mirror |
| `ve_ascend` | Ascending Step | movement | timed | jump | `ve_sky` | Moonlit Steps |
| `ve_warp` | Thrown Dusk | movement | timed | J held | `ve_thread` | Twin Throw |
| `ve_slip` | Slipstream | movement | timed | L | `ve_rhythm` | Dusk Current |
| `ve_moon` | Falling Moon | spell | easy | I | `ve_hex` | Eclipse |
| `ve_gale` | Dusk Gale | spell | timed | I | `ve_sky` | Twilight Cyclone |
| `ve_thread` | Dusk Thread | spell | timed | I | `ve_warp` | Fate Thread |
| `ve_hex` | Dusk Sigil | dot | easy | auto (short blows) | `ve_moon` | Sigil Bloom |
| `ve_night` | Falling Night | dot | timed | auto (air blows) | `ve_sky` | Starless Night |
| `ve_glow` | Afterglow | dot | timed | auto (high Tempo) | `ve_edge` | Dusk Fire |
| `ve_shade` | Dusk Shade | summon | easy | auto (blow landed) | `ve_storm` | Shade Troupe |
| `ve_swallow` | Night Swallows | summon | easy | auto (launch) | `ve_night` | Swallow Storm |
| `ve_twin` | Twin Phantom | summon | precise | auto (parry or perfect dodge) | `ve_turn` | Mirror Dance |
| `ve_waltz` | Dusk Waltz | ultimate | easy | U | `ve_rhythm` | Endless Waltz |
| `ve_rhythm` | Unbroken Rhythm | passive | easy | auto | `ve_slip` | Perpetual Tempo |
| `ve_grace` | Wanderer's Grace | passive | easy | auto | `ve_twin` | Dusk Ward |

Kinds: attack 5, movement 3, spell 3, dot 3, summon 3, ultimate 1, passive 2.
Every skill has at least four level ups that add a new property (marked New on the card).

## Each skill

The card line of each level; every row carries the numbers before it.

### Rising Edge (`ve_edge`)

Your string blows hit harder for every Tempo stack you hold.

| Level | Card |
| --- | --- |
| 1 | Each Tempo stack adds 2% to your string blows. |
| 2 | 3% a stack. |
| 3 | New: at the top of Tempo the long blade reaches 8 px farther. |
| 4 | 4% a stack. |
| 5 | New: the moonrise sends a dusk wave ahead. |
| 6 | New: echo cuts hit 50% harder. |
| 7 | 5% a stack; the wave 1.2 to 1.8. |
| 8 | New: blows at the top of Tempo break guards; 6% a stack. |
| Evolved | Crescendo, with `ve_rhythm` at level 4 or more: At the top of Tempo the long blade's blows echo too, and each stack adds 7%. |

### Twin Keen (`ve_keen`)

Keen blows, pressed just as a blow lands, hit much harder on their foe.

| Level | Card |
| --- | --- |
| 1 | A Keen blow deals 40% more. |
| 2 | Keen window 0.10 to 0.14 s. |
| 3 | New: each Keen move in a row adds 10% more, up to 40%. |
| 4 | Keen bonus 40% to 70%. |
| 5 | New: a Keen move sends an echo cut at its foe. |
| 6 | New: a Keen moonrise fills Tempo to the top. |
| 7 | Keen bonus 70% to 100%; the streak up to 60%. |
| 8 | New: a Keen move gives back 3 MP. |
| Evolved | Perfect Pair, with `ve_turn` at level 4 or more: A Keen move cuts its foe again at once with both blades in gold, 3 times attack damage. |

### Sky Ribbon (`ve_sky`)

Your air string hits harder and keeps foes up longer.

| Level | Card |
| --- | --- |
| 1 | Air blows deal 20% more. |
| 2 | 30% more. |
| 3 | New: foes you strike in the air keep rising. |
| 4 | 40% more. |
| 5 | New: the nightfall's landing sends a wave along the floor each way. |
| 6 | New: air blows at the top of Tempo throw a dusk feather at one more foe. |
| 7 | 55% more; waves 1 to 1.6. |
| 8 | New: the nightfall hits 50% harder. |
| Evolved | Heaven's Ribbon, with `ve_ascend` at level 4 or more: Every air blow sends a ribbon of night both ways that cuts every foe on its line. |

### Crossing Storm (`ve_storm`)

Your string cuts behind you and sends small waves into the crowd.

| Level | Card |
| --- | --- |
| 1 | Short-blade blows also cut behind you. |
| 2 | Short blows deal 25% more. |
| 3 | New: long-blade blows send a small wave ahead. |
| 4 | Wave 0.4 to 0.6. |
| 5 | New: the scissor turn's long blow cuts all round you. |
| 6 | New: waves pierce on to a second foe. |
| 7 | Short blows deal 50% more; wave 0.6 to 0.8. |
| 8 | New: each foe a wave cuts adds a Tempo stack. |
| Evolved | Thousand Crossings, with `ve_shade` at level 4 or more: Every blow of the string sends a wave both ways. |

### Turning Blade (`ve_turn`)

Your parry cuts harder and leaves the foes open longer.

| Level | Card |
| --- | --- |
| 1 | A parry adds a cut for 2 times attack damage. |
| 2 | The foes stay opened 1.4 to 2 s. |
| 3 | New: opened foes take 30% more from your blows. |
| 4 | The parry's cut 2 to 4. |
| 5 | New: a parry fills Tempo to the top. |
| 6 | New: the parry's cut sweeps both sides. |
| 7 | Opened foes take 30% to 60% more. |
| 8 | New: a block cuts back too. |
| Evolved | Whirling Mirror, with `ve_keen` at level 4 or more: A parry sends both blades spinning round you: 6 cuts on every foe close by. |

### Ascending Step (`ve_ascend`)

A longer air string, and jumps that cut.

| Level | Card |
| --- | --- |
| 1 | One more air blow before you land. |
| 2 | New: the jump from the floor cuts foes beside you. |
| 3 | The jump cut 0.8 to 1.2, and it throws foes up. |
| 4 | New: the double jump cuts all round you. |
| 5 | New: you can dodge in the air. |
| 6 | The double jump's cut 1 to 1.6. |
| 7 | New: an air blow that lands gives the double jump back once. |
| 8 | Two more air blows in all. |
| Evolved | Moonlit Steps, with `ve_sky` at level 4 or more: Every jump cuts all round you for 2 times attack damage, and every air blow that lands gives the double jump back. |

### Thrown Dusk (`ve_warp`)

Your thrown blade cuts what it passes, and the warp comes back sooner.

| Level | Card |
| --- | --- |
| 1 | The thrown blade cuts every foe it passes for 0.8 times attack damage. |
| 2 | Warp recharge 2 to 1.6 s. |
| 3 | New: the arrival adds 2 more Tempo. |
| 4 | Path cut 0.8 to 1.4. |
| 5 | New: two warps in a row. |
| 6 | New: the arrival opens the foes as a parry does, for 0.8 s. |
| 7 | Arrival blow 1.8 to 2.4. |
| 8 | New: the short blade flies on from the arrival as a wave. |
| Evolved | Twin Throw, with `ve_thread` at level 4 or more: The arrival's cross cuts every foe close by for 2 times attack damage and fills Tempo. |

### Slipstream (`ve_slip`)

Your dodge cuts every foe you pass through.

| Level | Card |
| --- | --- |
| 1 | The dodge cuts every foe it passes for 0.8 times attack damage. |
| 2 | Cut 0.8 to 1.2. |
| 3 | New: each foe cut adds a Tempo stack. |
| 4 | New: Tempo holds 1 s longer after a dodge. |
| 5 | Cut 1.2 to 1.8. |
| 6 | New: the dodge ends in a cross cut ahead. |
| 7 | New: the dodge gives back 12 stamina. |
| 8 | Cut 1.8 to 2.4; the cross 1.4 to 2. |
| Evolved | Dusk Current, with `ve_rhythm` at level 4 or more: The dodge leaves a current of dusk on its path for 2 s that cuts foes in it four times a second. |

### Falling Moon (`ve_moon`)

An ability: crescent moons fall ahead of you and burst on the crowd.

| Level | Card |
| --- | --- |
| 1 | Learn Falling Moon: a crescent moon falls ahead and bursts. |
| 2 | Burst 2 to 3. |
| 3 | New: two moons fall. |
| 4 | New: the burst throws foes up; wider. |
| 5 | New: the burst leaves a glow that burns 3 s. |
| 6 | Burst 3 to 4.6; recharge 4.2 s. |
| 7 | New: three moons fall. |
| 8 | Burst 4.6 to 6; recharge 3.5 s. |
| Evolved | Eclipse, with `ve_hex` at level 4 or more: Five moons fall in a wider row, and each burst draws foes in to its middle. |

### Dusk Gale (`ve_gale`)

An ability: a whirl of dusk runs along the floor and throws foes into the air.

| Level | Card |
| --- | --- |
| 1 | Learn Dusk Gale: a whirl runs along the floor and throws foes up. |
| 2 | Power 1.6 to 2.6. |
| 3 | New: the gale turns back at the end of its run. |
| 4 | Power 2.6 to 3.4; recharge 3.8 s. |
| 5 | New: it cuts each foe three times and holds it up. |
| 6 | New: a gale runs each way. |
| 7 | Power 3.4 to 4.6. |
| 8 | New: it drags foes along with it. |
| Evolved | Twilight Cyclone, with `ve_sky` at level 4 or more: At the end of its run the gale stands for 2 s and keeps juggling every foe in it. |

### Dusk Thread (`ve_thread`)

An ability: a thread pulls a foe to you and throws it up for your air string.

| Level | Card |
| --- | --- |
| 1 | Learn Dusk Thread: pull the nearest foe ahead to you and throw it up. |
| 2 | Power 1.4 to 2.4. |
| 3 | New: caught foes take 15% more for 3 s. |
| 4 | New: the thread catches two foes. |
| 5 | Power 2.4 to 3.4; reaches 150 px. |
| 6 | New: each foe caught adds 2 Tempo. |
| 7 | New: three foes, thrown higher. |
| 8 | Power 3.4 to 4.6; the mark 15% to 25%. |
| Evolved | Fate Thread, with `ve_warp` at level 4 or more: The thread catches every foe ahead within 200 px and hits 30% harder. |

### Dusk Sigil (`ve_hex`)

Your short blade lays dusk sigils that keep cutting the foe.

| Level | Card |
| --- | --- |
| 1 | Short-blade blows lay a dusk sigil that cuts the foe as it burns. |
| 2 | Sigils 0.06 to 0.1. |
| 3 | New: long-blade blows lay sigils too. |
| 4 | Up to 5 sigils on a foe. |
| 5 | New: a fallen foe's sigils jump to the nearest foe. |
| 6 | Sigils 0.1 to 0.16; they last 4 s. |
| 7 | New: a foe with 5 sigils takes 15% more from you. |
| 8 | Sigils 0.16 to 0.24; up to 6. |
| Evolved | Sigil Bloom, with `ve_moon` at level 4 or more: The moonrise blooms every sigil on the foes it strikes, each a blow of 1 times attack damage at once. |

### Falling Night (`ve_night`)

Foes you strike in the air carry night that keeps cutting them.

| Level | Card |
| --- | --- |
| 1 | Blows on foes in the air lay night that cuts as it burns. |
| 2 | Night 0.08 to 0.12. |
| 3 | New: the nightfall's landing lays 2 night on each foe it cuts. |
| 4 | Up to 6 night on a foe. |
| 5 | New: a foe with night takes 20% more while in the air. |
| 6 | Night 0.12 to 0.2; it lasts 5 s. |
| 7 | New: a launch lays 2 night. |
| 8 | Night 0.2 to 0.3; up to 8. |
| Evolved | Starless Night, with `ve_sky` at level 4 or more: The nightfall's landing takes all the night on each foe it cuts, each stack a blow of 0.8 times attack damage. |

### Afterglow (`ve_glow`)

High Tempo makes your blows leave a violet afterglow that burns on.

| Level | Card |
| --- | --- |
| 1 | At the top of Tempo your blows leave an afterglow that burns. |
| 2 | Afterglow 0.1 to 0.15. |
| 3 | New: afterglow is laid from 7 Tempo. |
| 4 | Up to 5 on a foe. |
| 5 | New: a foe that falls with afterglow bursts on foes near it. |
| 6 | Afterglow 0.15 to 0.24; laid from 5 Tempo. |
| 7 | New: reaching the top of Tempo lays it on every foe near you. |
| 8 | Afterglow 0.24 to 0.34; burst 1 to 1.6. |
| Evolved | Dusk Fire, with `ve_edge` at level 4 or more: Every second you hold the top of Tempo, all afterglow on screen flares for three ticks at once. |

### Dusk Shade (`ve_shade`)

Your blows may call a shade of you that dashes through the foe.

| Level | Card |
| --- | --- |
| 1 | A blow may call a dusk shade that dashes through its foe. |
| 2 | Chance 15% to 25%. |
| 3 | New: the shade cuts every foe on its line. |
| 4 | Cut 1 to 1.5. |
| 5 | New: the shade turns and dashes back. |
| 6 | Chance 35%; a shade every 0.6 s at most. |
| 7 | New: shades come in pairs, one from each side. |
| 8 | Cut 1.5 to 2.2. |
| Evolved | Shade Troupe, with `ve_storm` at level 4 or more: At the top of Tempo every blow calls a shade, as often as its wait allows. |

### Night Swallows (`ve_swallow`)

Throwing a foe up may send dusk swallows diving at foes in the air.

| Level | Card |
| --- | --- |
| 1 | A launch may send 2 dusk swallows at foes in the air. |
| 2 | Chance 50% to 70%. |
| 3 | New: swallows pierce on to a second foe. |
| 4 | 3 swallows. |
| 5 | New: swallows dive at foes on the floor too and throw them up. |
| 6 | Swallows 0.6 to 0.75; every launch sends them. |
| 7 | New: an air blow at the top of Tempo sends a swallow. |
| 8 | 4 swallows; 0.75 to 0.9. |
| Evolved | Swallow Storm, with `ve_night` at level 4 or more: Six swallows circle you and dive at every launch. |

### Twin Phantom (`ve_twin`)

A parry or perfect dodge calls a phantom of you to cut the nearest foe.

| Level | Card |
| --- | --- |
| 1 | A parry or perfect dodge may call a phantom of you that cuts the nearest foe. |
| 2 | Chance 60% to 100%. |
| 3 | New: the phantom's last cut throws its foe up. |
| 4 | Cuts 0.8 to 1.2. |
| 5 | New: the phantom cuts from the foe's back. |
| 6 | 5 cuts. |
| 7 | New: the phantom stays 3 s and cuts any foe near it. |
| 8 | Cuts 1.2 to 1.5. |
| Evolved | Mirror Dance, with `ve_turn` at level 4 or more: Two phantoms come, and while one is out your blows deal 30% more. |

### Dusk Waltz (`ve_waltz`)

Dusk Waltz grows: more cuts on every foe, a launch, a closing cross, and Tempo filled. Grows with attack damage. The charge rule is the shared one.

| Level | Card |
| --- | --- |
| 1 | The waltz cuts 30% harder and fills Tempo. |
| 2 | Recharge 20 to 15 s; charges 30% faster. |
| 3 | New: each foe takes 2 more cuts. |
| 4 | Power +45% to +80%. |
| 5 | New: its cuts throw foes up. |
| 6 | New: it closes with a cross on every foe it struck. |
| 7 | New: you cannot be touched for 2 s after it. |
| 8 | Power +80% to +160%; 2 more cuts. |
| Evolved | Endless Waltz, with `ve_rhythm` at level 4 or more: The waltz dances twice, and the second dance reaches every foe on the screen. |

### Unbroken Rhythm (`ve_rhythm`)

Your Tempo lasts longer, rises higher and is harder to lose.

| Level | Card |
| --- | --- |
| 1 | Tempo holds 0.5 s longer before it falls. |
| 2 | A blow taken costs a quarter of your Tempo, not half. |
| 3 | New: Tempo's top is 12. |
| 4 | New: at the top of Tempo you move 10% faster. |
| 5 | Tempo holds 1 s longer. |
| 6 | New: reaching the top of Tempo gives back 6 MP. |
| 7 | New: a blow taken at the top of Tempo costs none. |
| 8 | Tempo's top 12 to 14. |
| Evolved | Perpetual Tempo, with `ve_slip` at level 4 or more: Your Tempo never falls below half its top. |

### Wanderer's Grace (`ve_grace`)

More HP and speed, and good timing keeps you whole.

| Level | Card |
| --- | --- |
| 1 | +10 HP. |
| 2 | New: a perfect dodge adds 3 Tempo. |
| 3 | +20 HP; you move 10% faster. |
| 4 | New: a parry or perfect dodge heals 4 HP. |
| 5 | +30 HP; +20 stamina. |
| 6 | New: above half Tempo foes deal you 10% less. |
| 7 | The heal 4 to 8. |
| 8 | +45 HP; foes deal 15% less above half Tempo. |
| Evolved | Dusk Ward, with `ve_twin` at level 4 or more: At the top of Tempo the first blow in every 4 s is turned aside by itself. |

## Balance

Measured on 15 November 2026 in a measuring room built to the method in `docs/skills/balance.md` (script kept outside the repo): wave 2, hero level 1, only the skill under test, the stream stopped, a crowd of four husks and two wisps or one husk at three times its HP, HP kept full, 5 s warm-up and 60 s measured.
The scripted player walks to the nearest foe and presses J, jumps every 6 s, dodges every 4 s, presses I every 1.5 s (a spell under test is selected and cast whenever it is ready), and casts the ultimate at charge level 3 every 10 s; a perfect dodge and a parry are fired through the game's own functions every 7 s, and 30% of presses are Keen.
Figures are the damage a second the skill adds over the base kit, on the sources it can change, raw at hero level 1 (AD 10, AP 9); one run per cell.

Base kit (mean of the base runs): crowd 97 attacks, 11 abilities a second; one foe 74 attacks, 6 abilities.
The base runs spread by about 25 a second on the crowd and far more on one foe, so any cell within about 30 of zero is noise.

| Skill | Kind | Risk | L1 one | L1 crowd | L8 one | L8 crowd | Evolved one | Evolved crowd |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `ve_turn` | attack | precise | 2 | 60 | 18 | 115 | 66 | 86 |
| `ve_twin` | summon | precise | 19 | 10 | 191 | 236 | 401 | 362 |
| `ve_moon` | spell | easy | -1 | 4 | 2 | 44 | 2 | 61 |
| `ve_keen` | attack | precise | -20 | -4 | -63 | -17 | 31 | 34 |
| `ve_sky` | attack | timed | 4 | -17 | 25 | 14 | 14 | -15 |
| `ve_rhythm` | passive | easy | 5 | 15 | -14 | -3 | -5 | -3 |
| `ve_ascend` | movement | timed | -7 | 7 | -29 | -10 | 3 | 18 |
| `ve_slip` | movement | timed | -4 | 11 | -31 | -9 | 9 | -23 |
| `ve_grace` | passive | easy | 2 | -30 | -9 | -3 | 18 | -23 |
| `ve_hex` | dot | easy | 24 | -1 | -43 | 42 | -3 | 56 |
| `ve_edge` | attack | timed | 2 | 1 | -9 | 25 | 30 | 65 |
| `ve_storm` | attack | easy | 3 | -1 | -0 | 46 | 14 | 87 |
| `ve_thread` | spell | timed | -1 | 0 | 8 | 33 | 2 | 89 |
| `ve_glow` | dot | timed | -10 | 35 | 4 | -36 | 15 | 39 |
| `ve_shade` | summon | easy | -6 | -55 | 85 | 35 | 88 | 76 |
| `ve_warp` | movement | timed | 6 | -27 | 19 | 16 | 1 | -40 |
| `ve_waltz` | ultimate | easy | 1.6x | 1.1x | 2.3x | 1.2x | 1.7x | 1.5x |
| `ve_swallow` | summon | easy | -6 | -2 | 180 | 3 | 52 | 44 |
| `ve_gale` | spell | timed | 0 | 7 | 4 | 24 | 16 | 191 |
| `ve_night` | dot | timed | -43 | -19 | 14 | -15 | 23 | 27 |

The ultimate's cells are its damage per cast against the base Dusk Waltz's.

### What changed from the first measurement

| Skill | Change | Why |
| --- | --- | --- |
| `ve_twin` | level 8 cut 1.8 to 1.5 AD | one foe 257 at level 8, over the precise band of 175 to 210; after: 191 |
| `ve_swallow` | level 6 0.9 to 0.75, level 8 1.2 to 0.9 AD | one foe 119 at level 8, over the easy band of 70 |
| `ve_waltz` | a cut whose foe has fallen goes to the next foe in the dance; level 8 power 2.1 to 2.6 | cuts were lost on fallen foes |
| `ve_moon`, `ve_gale`, `ve_thread` | power about 1.4 times at every level | level 8 on the crowd read 19, 29 and 30, far under their bands; after: 44, 24 and 33 |

### Still off

- The room cannot tell most skills from noise: Sky Ribbon, Ascending Step, Slipstream, Thrown Dusk, Unbroken Rhythm and Wanderer's Grace read within noise of zero, since the scripted player rarely plays the air string, rarely dodges through foes and never stops to lose Tempo. They need a scripted check that drives their own moves.
- Twin Keen reads under its precise band on one foe (31 evolved): the room's Keen presses are set by hand on 30% of presses, which may not match a real Keen press.
- Dusk Waltz reads only 1.2 to 2.3 times the base per cast, because the room's foes die to the base waltz already, so more power cannot show. It needs the late target (a lone foe at 12 times its HP).
- Night Swallows still read 180 on one foe at level 8 in its last run against 119 before the change, which says the one-foe room swings widely; it needs repeat runs.
- Spells stay under band (Falling Moon 44 against 70, Dusk Thread 33 and Dusk Gale 24 against 112 at level 8), held back by their recharge in a 60 s window.
