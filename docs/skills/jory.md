# Jory's skills

Jory's 20 skills, written from the skill data in `src/constants/characters/jory/skills/`, which is the source of truth.
His beat, Groove, the mallet string, Boom, Beat Step and Drumroll are in `docs/jory-design.md`; the rules every hero's skills follow are in `docs/skill-design.md`.

## Units

Damage is a multiple of attack damage (x AD) from `progress.stats.ad`, or of ability power (x AP) from `progress.stats.ap` where a skill's values say so.
At the start of a run AD is 12 and AP is 8.
His mallets, the Crash wave, Downstroke and Step Touch read AD; Boom, Thunder Skin, his spells and his damage over time read AP.
An Accent is a blow started by a press on the beat: it deals 1.4 times, 1.6 times at Crescendo.
"On each beat" means on each beat of his own clock, which runs faster as his Groove tier rises, so those skills speed up with Groove; they are budgeted at tier 2 (108 beats a minute), the tempo an ordinary player holds.
The damage over time skills lay their stacks through the shared `addStacks`, ticking once a beat at the tempo when the stack was laid.
Distances are art pixels, times are seconds, speeds are pixels a second.

## Base kit

Every button does something from the first second of a run.

| Key | With no skill |
| --- | --- |
| A / D | Walk at the shared speed; a double tap runs. |
| W | One jump of the shared height. No double jump. |
| J | The string Tap, Roll (two hits), Crash, the same wherever foes stand. On the beat each blow is an Accent and adds a pip of Groove; off it, Groove falls by 3. In the air, Downstroke, once per airtime. |
| K | Boom: 25 stamina. On the beat a 40 px ring that pushes minions out to 52 px, drowns foe shots within 48 px and makes him untouchable for 0.12 s; off it a 26 px ring. |
| L | Beat Step: 18 stamina, 34 to 52 px by tier. On the beat untouchable and through ground foes; off it he can be hit. |
| I | The selected ability: Steady Hand, Thunder Skin, or a spell skill. |
| O | Switch ability. |
| U | Drumroll, the base special, with the shared charge levels. |

## The 20 skills

| Id | Name | Kind | Risk | Button | Evolves with |
| --- | --- | --- | --- | --- | --- |
| `j_accent` | Heavy Accent | attack | precise | J | `j_metronome` |
| `j_paradiddle` | Paradiddle | attack | timed | J | `j_stepTouch` |
| `j_crashWave` | Crash Wave | attack | easy | J | `j_horn` |
| `j_rimshot` | Rimshot | attack | precise | J | `j_tuning` |
| `j_kickDrum` | Kick Drum | attack | timed | J | `j_leap` |
| `j_swell` | Swell | attack | easy | auto | `j_encore` |
| `j_stepTouch` | Step Touch | movement | timed | L | `j_paradiddle` |
| `j_march` | War March | movement | easy | auto | `j_drumCorps` |
| `j_leap` | Downbeat Leap | movement | timed | jump | `j_kickDrum` |
| `j_gong` | Gong | spell | easy | I | `j_resonance` |
| `j_tuning` | Tuning Fork | spell | precise | I | `j_rimshot` |
| `j_echo` | Echo Chamber | spell | timed | I | `j_eardrum` |
| `j_resonance` | Resonance | dot | easy | auto | `j_gong` |
| `j_eardrum` | Ringing Ears | dot | timed | K | `j_echo` |
| `j_dissonance` | Dissonance | dot | precise | J | `j_accent` |
| `j_drumCorps` | Drum Corps | summon | timed | auto | `j_march` |
| `j_horn` | War Horn | summon | easy | auto | `j_crashWave` |
| `j_metronome` | Iron Metronome | summon | precise | auto | `j_swell` |
| `j_encore` | Encore | passive | easy | auto | `j_dissonance` |
| `j_finale` | Grand Finale | ultimate | timed | U | `j_encore` |

Counts: attack 6, movement 3, spell 3, dot 3, summon 3, passive 1, ultimate 1.
Risk: precise 5, easy 7, timed 8.

Kit events he emits through the shared function, declared in `src/types/jory.ts`: `beat` (a judged press of J, K, L or I, on the beat or off it, with Groove after it), `accent` (an Accent landed on a foe), `boom` (a Boom struck, on the beat or not, with the foes in its ring), `tier` (his Groove tier changed) and `tick` (a beat of his clock went by); and the shared `cast`, `jump`, `dash` (each Beat Step) and `perfectDodge`.

### j_accent: Heavy Accent

attack, precise, J. His Accents, blows started on the beat, hit the first foe they reach much harder.

Values: power: share more an Accent deals to the first foe; crit: chance an Accent is a sure crit; stagger: seconds more an Accent staggers; ring: pixels of the ring an Accent sends onto the foes round its first; guard: 1 an Accent breaks a guard; stun: seconds an accented Crash stuns its first foe; thunderclap: 1 an Accent on a downbeat is a sure crit and splits a 50 px ring (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.3 | Accents deal 30% more to the first foe. |
| 2 | crit 0 to 0.15 | Accents crit 15% of the time. |
| 3 | power 0.3 to 0.6 | Accents deal 60% more. |
| 4 | stagger 0 to 0.3 | Accents stagger 0.3 s longer. |
| 5 | ring 0 to 20 | An Accent rings out 20 px onto the foes round it. |
| 6 | guard 0 to 1, power 0.6 to 1 | Accents break guards; 100% more. |
| 7 | stun 0 to 0.8 | An accented Crash stuns for 0.8 s. |
| 8 | power 1 to 1.5 | Accents deal 150% more. |
| Evolved | thunderclap 0 to 1, power 1.5 to 1.8 | A downbeat Accent crits and splits a 50 px ring. |

Evolution: **Thunderclap** (partner `j_metronome`). An Accent on a bar's downbeat is a sure crit and splits a 50 px thunderclap ring.

### j_paradiddle: Paradiddle

attack, timed, J. Roll, the second blow of his string, strikes more times.

Values: strikes: times Roll strikes; power: share more each Roll strike deals; chain: attack damage each strike deals to the next foe within 40 px; shred: 1 Roll breaks guards; crescendo: 1 Roll strikes six times at Crescendo; blast: 1 Roll is an eight strike flurry that draws minions in (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | strikes 3 | Roll strikes three times. |
| 2 | power 0 to 0.2 | Roll strikes deal 20% more. |
| 3 | chain 0 to 0.4 | Each Roll strike chains to a second foe, 0.4x. |
| 4 | strikes 3 to 4 | Roll strikes four times. |
| 5 | shred 0 to 1 | Roll breaks guards. |
| 6 | power 0.2 to 0.5 | Roll strikes deal 50% more. |
| 7 | crescendo 0 to 1 | At Crescendo Roll strikes six times. |
| 8 | power 0.5 to 0.9, chain 0.4 to 0.7 | Roll strikes 90% more; chains 0.7x. |
| Evolved | blast 0 to 1 | Roll is an 8 hit flurry that draws minions in. |

Evolution: **Blast Beat** (partner `j_stepTouch`). Roll is an eight hit flurry that draws minions within 30 px in.

### j_crashWave: Crash Wave

attack, easy, J. Crash sends its sound wave along the floor at any Groove.

Values: reach: pixels the wave runs; power: attack damage it deals; height: pixels it stands; pierce: 1 it passes through every foe; echo: 1 at tier 3 a second wave follows on the next beat; slow: seconds a foe it passes is slowed; bounce: 1 it bounces off the stage edge; wall: 1 it crosses the whole stage both ways and knocks minions down (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | reach 60, power 0.5, height 20 | Crash sends a 60 px wave at any Groove, 0.5x. |
| 2 | height 20 to 30, power 0.5 to 0.6 | The wave stands taller; 0.6x. |
| 3 | pierce 0 to 1 | The wave passes through every foe. |
| 4 | reach 60 to 80, power 0.6 to 0.8 | The wave runs 80 px, 0.8x. |
| 5 | echo 0 to 1 | At tier 3 a second wave follows on the next beat. |
| 6 | slow 0 to 1.5 | Foes it passes are slowed for 1.5 s. |
| 7 | bounce 0 to 1 | The wave bounces off the stage edge. |
| 8 | reach 80 to 110, power 0.8 to 1.2 | The wave runs 110 px, 1.2x. |
| Evolved | wall 0 to 1 | The wave crosses the stage and knocks down. |

Evolution: **Wall of Sound** (partner `j_horn`). The wave crosses the whole stage both ways and knocks minions down.

### j_rimshot: Rimshot

attack, precise, J. An on-beat Tap cracks the first foe it reaches for a large bonus.

Values: power: share more an on-beat Tap deals to the first foe; crit: chance it is a sure crit; stun: seconds it stuns; pierce: attack damage the crack deals to the next foe within 40 px; sure: 1 a Rimshot on a downbeat is a sure crit; gunshot: attack damage of a crack fired 120 px ahead at the first foe (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.8 | An on-beat Tap deals 80% more to the first foe. |
| 2 | power 0.8 to 1.1, crit 0 to 0.5 | +50% crit chance on the crack; 110% more. |
| 3 | stun 0 to 0.5 | The crack stuns for 0.5 s. |
| 4 | power 1.1 to 1.5 | The crack deals 150% more. |
| 5 | pierce 0 to 0.6 | The crack carries to a second foe, 0.6x. |
| 6 | power 1.5 to 2 | The crack deals 200% more. |
| 7 | sure 0 to 1 | A Rimshot on a bar's downbeat is a sure crit. |
| 8 | power 2 to 2.8 | The crack deals 280% more. |
| Evolved | gunshot 0 to 2.5 | An on-beat Tap also fires a 120 px crack, 2.5x. |

Evolution: **Gunshot Snare** (partner `j_tuning`). An on-beat Tap also fires a crack 120 px straight ahead at the first foe for a heavy hit.

### j_kickDrum: Kick Drum

attack, timed, J. A J pressed on a bar's downbeat is a front Kick that throws minions up.

Values: power: the Kick's power as a multiple of its own; launch: how fast it throws a minion up (negative is up); thump: pixels of the floor ring it thumps; guard: 1 the Kick breaks guards; elite: 1 it knocks elites down; accent: 1 the Kick is an Accent; fourFloor: 1 every on-beat J may Kick, each with its thump (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 1, launch -190 | J on a bar's downbeat is a Kick that throws minions up. |
| 2 | launch -190 to -240 | The Kick throws higher. |
| 3 | thump 0 to 30 | The Kick thumps a 30 px floor ring. |
| 4 | guard 0 to 1, power 1 to 1.4 | The Kick breaks guards and deals 40% more. |
| 5 | elite 0 to 1 | The Kick knocks elites down. |
| 6 | thump 30 to 40, power 1.4 to 1.8 | A 40 px thump; the Kick deals 80% more. |
| 7 | accent 0 to 1 | The Kick is an Accent. |
| 8 | power 1.8 to 2.5 | The Kick deals 150% more. |
| Evolved | fourFloor 0 to 1 | Every on-beat J may Kick. |

Evolution: **Four on the Floor** (partner `j_leap`). Every on-beat J may Kick, and each Kick thumps a floor ring.

### j_swell: Swell

attack, easy, auto. Every blow deals more for each Groove tier.

Values: perTier: share more every blow deals for each Groove tier; stagger: seconds more his blows stagger from tier 3; mp: MP the first foe of each Accent gives; reach: share further his blows reach at Crescendo; guard: 1 from tier 2 his string breaks guards; fortissimo: 1 at Crescendo every blow sends a 30 px ring (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | perTier 0.05 | Every blow deals 5% more for each Groove tier. |
| 2 | perTier 0.05 to 0.08 | 8% a tier. |
| 3 | stagger 0 to 0.2 | From tier 3 his blows stagger 0.2 s longer. |
| 4 | mp 0 to 3, perTier 0.08 to 0.11 | Each Accent gives 3 MP; 11% a tier. |
| 5 | reach 0 to 0.1 | At Crescendo his blows reach 10% further. |
| 6 | guard 0 to 1, perTier 0.11 to 0.14 | From tier 2 his string breaks guards; 14% a tier. |
| 7 | reach 0.1 to 0.15 | At Crescendo, 15% further. |
| 8 | perTier 0.14 to 0.18 | 18% a tier. |
| Evolved | fortissimo 0 to 1, reach 0.15 to 0.25 | At Crescendo, 25% further and a 30 px ring. |

Evolution: **Fortissimo** (partner `j_encore`). At Crescendo every blow reaches 25% further and sends a 30 px ring.

### j_stepTouch: Step Touch

movement, timed, L. Beat Step strikes the foes it passes.

Values: power: attack damage each foe passed takes; echo: share of it struck again on the next beat; reach: share further the step goes; stagger: 1 struck minions stagger; second: 1 an on-beat step makes the next step free; moonwalk: 1 on-beat steps cost no stamina for four in a row (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | power 0.6 | Beat Step strikes the foes it passes, 0.6x. |
| 2 | power 0.6 to 0.8 | 0.8x. |
| 3 | echo 0 to 0.5 | An echo strikes them again on the next beat, half as hard. |
| 4 | reach 0 to 0.15 | The step goes 15% further. |
| 5 | stagger 0 to 1 | Struck minions stagger. |
| 6 | power 0.8 to 1.1, echo 0.5 to 0.7 | 1.1x; the echo 70%. |
| 7 | second 0 to 1 | An on-beat step makes the next one free. |
| 8 | power 1.1 to 1.5 | 1.5x. |
| Evolved | moonwalk 0 to 1 | Four on-beat steps in a row cost nothing. |

Evolution: **Moonwalk** (partner `j_paradiddle`). On-beat steps cost no stamina for four in a row, each striking.

### j_march: War March

movement, easy, auto. He walks faster for each Groove tier.

Values: walk: share faster he walks for each Groove tier; bump: 1 walking into a minion on a beat bumps it back; hold: 1 silence costs no Groove while he runs; footfall: attack damage of a 30 px ring on each downbeat while he walks; knock: 1 a bump knocks the minion down; parade: 1 walking at Crescendo stamps a 40 px ring every beat (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | walk 0.04 | He walks 4% faster for each Groove tier. |
| 2 | walk 0.04 to 0.06 | 6% a tier. |
| 3 | bump 0 to 1 | Walking into a minion on the beat bumps it back. |
| 4 | walk 0.06 to 0.08 | 8% a tier. |
| 5 | hold 0 to 1 | Silence costs no Groove while he runs. |
| 6 | footfall 0 to 0.4 | Walking stamps a ring on each downbeat, 0.4x. |
| 7 | knock 0 to 1, walk 0.08 to 0.1 | A bump knocks the minion down; 10% a tier. |
| 8 | footfall 0.4 to 0.8 | Footfalls deal 0.8x. |
| Evolved | parade 0 to 1 | At Crescendo, a 40 px ring every beat. |

Evolution: **Parade** (partner `j_drumCorps`). Walking at Crescendo stamps a 40 px ring on every beat.

### j_leap: Downbeat Leap

movement, timed, jump. A jump pressed on the beat lets Up jump again in the air, on a beat.

Values: leaps: jumps in the air after an on-beat jump; ring: pixels of the ring his landing sends out after a leap; power: attack damage of that ring; stun: seconds it stuns; boom: 1 Boom in the air costs no stamina; skybeat: 1 each air jump drops a sound blast below him (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | leaps 1, power 0.5 | An on-beat jump gives one more jump, on a beat. |
| 2 | ring 0 to 30 | Landing from a leap rings out 30 px, 0.5x. |
| 3 | leaps 1 to 2 | Two more jumps. |
| 4 | stun 0 to 0.4 | The landing ring stuns for 0.4 s. |
| 5 | ring 30 to 45, power 0.5 to 0.8 | A 45 px ring, 0.8x. |
| 6 | boom 0 to 1 | Boom in the air costs no stamina. |
| 7 | power 0.8 to 1.2 | The ring deals 1.2x. |
| 8 | leaps 2 to 3, ring 45 to 60 | Three more jumps; a 60 px ring. |
| Evolved | skybeat 0 to 1 | Each air jump drops a sound blast below him. |

Evolution: **Skybeat** (partner `j_kickDrum`). Each on-beat air jump drops a sound blast below him.

### j_gong: Gong

spell, easy, I. A spell on I: a gong set 40 px ahead rings on the next beats.

Values: mp: MP; cooldown: seconds; beats: rings; radius: pixels each ring reaches; power: ability power each ring deals; pull: pixels each ring pulls foes in; stagger: 1 rings stagger minions; second: 1 a second gong rings behind him; temple: 1 rings burst Resonance stacks (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 18, cooldown 8, beats 4, radius 50, power 0.5 | 18 MP: a gong rings on the next 4 beats, 50 px, 0.5x. |
| 2 | beats 4 to 6 | It rings 6 beats. |
| 3 | radius 50 to 65 | 65 px rings. |
| 4 | pull 0 to 10 | Each ring pulls foes 10 px in. |
| 5 | stagger 0 to 1 | Rings stagger minions. |
| 6 | power 0.5 to 0.8 | Rings deal 0.8x. |
| 7 | second 0 to 1 | A second gong rings behind him. |
| 8 | power 0.8 to 1.2, beats 6 to 8 | 1.2x; 8 beats. |
| Evolved | temple 0 to 1, beats 8 to 12 | Rings 12 beats and bursts Resonance. |

Evolution: **Temple Bell** (partner `j_resonance`). The gong rings 12 beats, and each ring bursts the Resonance on the foes it reaches.

### j_tuning: Tuning Fork

spell, precise, I. A spell on I: on the beat it tunes the nearest foe, and each on-beat blow on it deals bonus ability power. Off the beat it tunes for half as long, at half.

Values: mp: MP; cooldown: seconds; beats: beats a foe stays tuned; ap: ability power each Accent on it adds; bonus: share more it takes from every source; count: foes tuned; slow: seconds a foe is slowed when tuned; perfect: 1 a tuned foe shatters for 4x ability power after four Accents (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 14, cooldown 6, beats 8, ap 0.6, count 1 | 14 MP: tune a foe for 8 beats; Accents on it add 0.6x. |
| 2 | ap 0.6 to 0.9 | Accents on it add 0.9x. |
| 3 | bonus 0 to 0.1 | Tuned foes take 10% more. |
| 4 | ap 0.9 to 1.3 | 1.3x. |
| 5 | count 1 to 2 | Tunes two foes. |
| 6 | slow 0 to 1.5 | A tuned foe is slowed for 1.5 s. |
| 7 | ap 1.3 to 1.8, bonus 0.1 to 0.2 | 1.8x; tuned foes take 20% more. |
| 8 | ap 1.8 to 2.5, beats 8 to 12 | 2.5x; 12 beats. |
| Evolved | perfect 0 to 1 | Four Accents shatter a tuned foe, 4x. |

Evolution: **Perfect Pitch** (partner `j_rimshot`). A tuned foe shatters for a heavy hit after four Accents.

### j_echo: Echo Chamber

spell, timed, I. A spell on I: a dome of sound at his feet; on each beat, foes inside take a share of his last blow again.

Values: mp: MP; cooldown: seconds; radius: pixels the dome reaches; beats: beats it stands; share: share of his last landed blow it repeats; follow: 1 the dome follows him; stagger: 1 each echo staggers minions; slow: seconds foes inside are slowed; cathedral: 1 140 px, 16 beats, and it repeats his last two blows (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | mp 22, cooldown 10, radius 80, beats 8, share 0.3 | 22 MP: an 80 px dome for 8 beats repeats 30% of his last blow. |
| 2 | share 0.3 to 0.4 | 40%. |
| 3 | follow 0 to 1 | The dome follows him. |
| 4 | share 0.4 to 0.5 | 50%. |
| 5 | stagger 0 to 1 | Each echo staggers minions. |
| 6 | slow 0 to 0.5 | Foes inside are slowed. |
| 7 | share 0.5 to 0.65, radius 80 to 100 | 65%; a 100 px dome. |
| 8 | share 0.65 to 0.8, beats 8 to 10 | 80%; 10 beats. |
| Evolved | cathedral 0 to 1, radius 100 to 140, beats 10 to 16 | 140 px, 16 beats, his last two blows. |

Evolution: **Cathedral** (partner `j_eardrum`). A 140 px dome for 16 beats that repeats his last two blows.

### j_resonance: Resonance

dot, easy, auto. His blows leave Resonance on foes, which hums on each beat for ability power.

Values: max: most stacks on a foe; ap: ability power each stack deals on each beat; double: 1 an Accent adds two stacks; slow: seconds a foe is slowed when stacks are laid; sympathy: 1 each Accent spreads the stacks to foes within 40 px (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | max 3, ap 0.06 | His blows add Resonance, up to 3, 0.06x a beat each. |
| 2 | ap 0.06 to 0.09 | 0.09x. |
| 3 | max 3 to 5 | Up to 5 stacks. |
| 4 | ap 0.09 to 0.13 | 0.13x. |
| 5 | double 0 to 1 | Accents add two stacks. |
| 6 | slow 0 to 0.6, ap 0.13 to 0.18 | Resonating foes are slowed; 0.18x. |
| 7 | max 5 to 7 | Up to 7 stacks. |
| 8 | ap 0.18 to 0.26 | 0.26x. |
| Evolved | sympathy 0 to 1 | Accents spread Resonance 40 px. |

Evolution: **Sympathy** (partner `j_gong`). Each Accent spreads the Resonance on its foe to every foe within 40 px.

### j_eardrum: Ringing Ears

dot, timed, K. Boom leaves Ringing on the foes it reaches, which hurts on each beat.

Values: stacks: stacks a Boom lays; ap: ability power each stack deals on each beat; slow: seconds ringing foes are slowed; taken: share more ringing foes take from every source; blind: seconds an on-beat Boom blinds them; wider: share wider his Boom rings; roar: 1 an on-beat Boom consumes the Ringing for a burst (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | stacks 1, ap 0.1 | Boom leaves 1 Ringing stack, 0.1x a beat. |
| 2 | stacks 1 to 2 | 2 stacks. |
| 3 | slow 0 to 1 | Ringing foes are slowed. |
| 4 | ap 0.1 to 0.16 | 0.16x. |
| 5 | taken 0 to 0.1 | Ringing foes take 10% more. |
| 6 | blind 0 to 0.5 | An on-beat Boom blinds them 0.5 s. |
| 7 | wider 0 to 0.2 | Boom rings 20% wider. |
| 8 | stacks 2 to 3, ap 0.16 to 0.26 | 3 stacks, 0.26x. |
| Evolved | roar 0 to 1 | An on-beat Boom bursts the Ringing. |

Evolution: **Deafening Roar** (partner `j_echo`). An on-beat Boom consumes the Ringing on every foe it reaches for a burst.

### j_dissonance: Dissonance

dot, precise, J. An accented Crash marks foes with Dissonance, which grows with each Accent on them and hurts on each beat. An off-beat press halves it.

Values: ap: ability power each stack deals on each beat; max: most stacks; start: stacks an accented Crash lays; any: 1 any Accent marks; cacophony: 1 at 8 stacks it bursts for the stacks consumed (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | ap 0.12, max 6, start 1 | An accented Crash marks foes, 0.12x a beat a stack. |
| 2 | ap 0.12 to 0.17 | 0.17x. |
| 3 | start 1 to 2 | An accented Crash lays two stacks. |
| 4 | ap 0.17 to 0.24 | 0.24x. |
| 5 | max 6 to 10 | Up to 10 stacks. |
| 6 | any 0 to 1 | Any Accent marks. |
| 7 | ap 0.24 to 0.34 | 0.34x. |
| 8 | ap 0.34 to 0.48, max 10 to 12 | 0.48x; up to 12 stacks. |
| Evolved | cacophony 0 to 1 | At 8 stacks it bursts. |

Evolution: **Cacophony** (partner `j_accent`). At 8 stacks the Dissonance bursts for the stacks it held.

### j_drumCorps: Drum Corps

summon, timed, auto. An accented Crash may call a spectral drummer who strikes the nearest foe on each beat.

Values: chance: chance an accented Crash calls one; cooldown: seconds between calls; beats: beats a drummer stays; power: attack damage each strike deals; stagger: 1 strikes stagger minions; count: drummers called; band: 1 three drummers march with him for the whole run (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.35, cooldown 3, beats 4, power 0.4, count 1 | 35%: a drummer strikes on each of 4 beats, 0.4x. |
| 2 | chance 0.35 to 0.5 | 50% chance. |
| 3 | beats 4 to 6 | Drummers stay 6 beats. |
| 4 | power 0.4 to 0.6 | 0.6x. |
| 5 | stagger 0 to 1 | Their strikes stagger minions. |
| 6 | chance 0.5 to 0.7 | 70% chance. |
| 7 | count 1 to 2 | Two drummers. |
| 8 | power 0.6 to 0.9, beats 6 to 8 | 0.9x; 8 beats. |
| Evolved | band 0 to 1 | Three drummers march with him. |

Evolution: **Marching Band** (partner `j_march`). Three drummers march with him and strike on every beat.

### j_horn: War Horn

summon, easy, auto. A kill may call a ghostly horn-bearer who sounds a cone of sound.

Values: chance: chance a kill calls one; cooldown: seconds between calls; power: attack damage of each blast; cone: pixels the cone reaches; blasts: blasts it sounds, one a beat; slow: seconds a blast slows foes; knock: 1 the cone knocks minions down; herald: 1 a herald stays and every 8th beat sounds both ways (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | chance 0.2, cooldown 4, power 0.5, cone 80, blasts 1 | 20%: a horn-bearer sounds an 80 px cone, 0.5x. |
| 2 | chance 0.2 to 0.3 | 30% chance. |
| 3 | blasts 1 to 2 | It sounds twice. |
| 4 | power 0.5 to 0.8 | 0.8x. |
| 5 | slow 0 to 1 | Its blasts slow foes for 1 s. |
| 6 | chance 0.3 to 0.45, cone 80 to 110 | 45% chance; a 110 px cone. |
| 7 | knock 0 to 1 | The cone knocks minions down. |
| 8 | power 0.8 to 1.2, blasts 2 to 3 | 1.2x; three blasts. |
| Evolved | herald 0 to 1 | A herald sounds both ways every 8th beat. |

Evolution: **Herald** (partner `j_crashWave`). A herald stays with him and sounds both ways on every 8th beat.

### j_metronome: Iron Metronome

summon, precise, auto. After on-beat presses in a row, an iron metronome drops beside the nearest foe and strikes on each beat.

Values: streak: on-beat presses in a row that call it; beats: beats it strikes; power: attack damage each strike deals; ring: pixels of the ring each strike sends onto the foes round its foe; stagger: 1 strikes stagger; conductor: 1 it stays while Crescendo lasts and every strike staggers (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | streak 8, beats 6, power 0.6 | 8 on-beat presses in a row: it strikes 6 beats, 0.6x. |
| 2 | power 0.6 to 0.8 | 0.8x. |
| 3 | beats 6 to 8 | It strikes 8 beats. |
| 4 | streak 8 to 6 | 6 presses in a row call it. |
| 5 | ring 0 to 20, power 0.8 to 1.1 | Each strike rings 20 px round its foe; 1.1x. |
| 6 | stagger 0 to 1 | Its strikes stagger. |
| 7 | power 1.1 to 1.5 | 1.5x. |
| 8 | power 1.5 to 2, beats 8 to 10 | 2x; 10 beats. |
| Evolved | conductor 0 to 1, stagger 1 to 1 | It stays through Crescendo. |

Evolution: **Conductor** (partner `j_swell`). It stays while Crescendo lasts, and every strike staggers.

### j_encore: Encore

passive, easy, auto. Missing the beat costs him less.

Values: cost: Groove an off-beat press costs; window: game seconds wider his beat window is; hurt: Groove a blow taken costs; silence: beats of silence before Groove falls; shrug: 1 at Crescendo one blow every 10 s costs no Groove; ovation: 1 every 8th on-beat press heals 2% of his HP (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | cost 2 | An off-beat press costs 2 Groove. |
| 2 | window 0 to 0.016 | His beat window is 0.02 s wider. |
| 3 | hurt 0 to 3 | A blow taken costs 3 Groove. |
| 4 | silence 0 to 6 | Silence costs Groove only after 6 beats. |
| 5 | window 0.016 to 0.032 | The window is 0.04 s wider. |
| 6 | hurt 3 to 2 | A blow taken costs 2 Groove. |
| 7 | shrug 0 to 1 | At Crescendo one blow every 10 s costs nothing. |
| 8 | cost 2 to 1 | An off-beat press costs 1 Groove. |
| Evolved | ovation 0 to 1 | Every 8th on-beat press heals 2%. |

Evolution: **Standing Ovation** (partner `j_dissonance`). Every 8th on-beat press heals 2% of his HP.

### j_finale: Grand Finale

ultimate, timed, U. Replaces Drumroll: wider rings, a cymbal crash on every foe each ring reaches, and Crescendo held after it.

Values: wider: share wider the rings are; power: a multiple on each ring's damage; cymbal: share of a ring's damage each cymbal crash adds; lock: beats Crescendo is held after it; stun: seconds each ring stuns minions; pull: pixels each ring pulls foes in; extra: beats added to the roll; refund: MP given back when the roll ends; encore: 1 the roll lasts 12 beats and every ring knocks down (evolution)

| Lv | Change | Card |
| --- | --- | --- |
| 1 | wider 0.25, power 1.2, cymbal 0.3, lock 8 | Drumroll rings 25% wider with cymbal crashes; Crescendo held 8 beats. |
| 2 | power 1.2 to 1.5, cymbal 0.3 to 0.45 | Rings deal 1.5x; cymbals 45%. |
| 3 | stun 0 to 0.4 | Each ring stuns minions 0.4 s. |
| 4 | power 1.5 to 2, cymbal 0.45 to 0.6, wider 0.25 to 0.4 | Rings deal 2x; cymbals 60%; 40% wider. |
| 5 | pull 0 to 8 | Each ring pulls foes 8 px in. |
| 6 | power 2 to 2.6, cymbal 0.6 to 0.8, lock 8 to 12 | Rings deal 2.6x; cymbals 80%; held 12 beats. |
| 7 | extra 0 to 1 | One more beat in the roll. |
| 8 | refund 0 to 25, power 2.6 to 3.5, cymbal 0.8 to 1.1, lock 12 to 16 | 25 MP back after it; 3.5x; cymbals 110%; held 16 beats. |
| Evolved | encore 0 to 1, power 3.5 to 5 | 12 beats; every ring knocks down. |

Evolution: **Encore of Thunder** (partner `j_encore`). The roll lasts 12 beats, and every ring knocks foes down.

## Shape check

The contract asks that at least four of a skill's seven level ups add a new property and that the rest are large number steps.
The table counts, from the data, the level ups that turn a value on from 0 or add another strike, leap, stack, beat, drummer or blast (a new property), and those that only raise a number.

| Skill | Level ups adding a property | Number steps |
| --- | --- | --- |
| Heavy Accent | 5 | 2 |
| Paradiddle | 5 | 2 |
| Crash Wave | 4 | 3 |
| Rimshot | 4 | 3 |
| Kick Drum | 4 | 3 |
| Swell | 4 | 3 |
| Step Touch | 4 | 3 |
| War March | 4 | 3 |
| Downbeat Leap | 5 | 2 |
| Gong | 5 | 2 |
| Tuning Fork | 4 | 3 |
| Echo Chamber | 4 | 3 |
| Resonance | 4 | 3 |
| Ringing Ears | 6 | 1 |
| Dissonance | 4 | 3 |
| Drum Corps | 4 | 3 |
| War Horn | 4 | 3 |
| Iron Metronome | 4 | 3 |
| Encore | 4 | 3 |
| Grand Finale | 4 | 3 |
