# Aldric skills

Aldric's part of the skill contract (`docs/skill-design.md`).
The rows are in `src/heroes/aldric/constants/skills/`, one file per skill; this note is the design as built.
AD and AP mean Aldric's attack damage and ability power (10 and 9 at hero level 1, `ALDRIC.base`).
His design note is `docs/heroes/aldric.md`.

## Identity

Aldric fights from behind a raised shield: he walks into foes with the guard up, bashes from behind it and turns every blow he stops into Valor, which lights his sword at full.
His skills lean on what only he does: the guard, the Guard bash and its Counterbash, the string's Shield bash, Valor and Radiance, Bulwark after a warp, and light called down from above.
Every skill is on a single press or runs on its own; nothing asks for a direction, a dash or a double tap.

## Base kit (no skills)

| Button | What it does |
| --- | --- |
| J | The ground string, fixed at 3 hits: Oath cut (1.2 AD), Shield bash (1.0 AD, staggers 0.7 s, breaks a guard), Crest breaker (2.4 AD, knocks down 0.9 s). No blow turns him. |
| J (Keen) | The shared Keen timing: J just after a blow lands makes the next blow a sure crit. |
| J (air) | Sky cut (1.0 AD), then Shield fall: a plunge shield first that spikes foes under him (1.2 AD) and a ring where he lands (1.3 AD, 28 px, knocks down). |
| J held | The shared warp; he arrives shield first behind Bulwark, which takes the next blow within 2.5 s. |
| K | Guard: blocks every blow from the front, lets nothing through, 8 stamina a block. He walks at 45% speed behind it and does not turn. Each block gives 12 Valor. |
| J with K held | Guard bash, 0.9 AD every 0.4 s, the guard staying up. Within 0.35 s of a block it is a Counterbash: 2.0 AD, a sure crit, 16 Valor. |
| K (parry) | The shared parry, then a Stun bash: 1.3 AD, knocks the attacker down for 1.1 s, 25 Valor. |
| L | The shared dodge. |
| I | Shield Rush (12 MP, 3 s): 44 px forward, 1.4 AP to each foe met, carrying them. Sunpillar (16 MP, 4.5 s): 2.4 AP on the nearest foe ahead within 130 px, knocks down. |
| I held | Wide forms for 1.5 times the MP: Shield Rush ends in a 30 px burst of 1.0 AP; Sunpillar calls three pillars 28 px apart. |
| I in an open string | Shieldcast: the ability skips its wind-up, and after the Shield bash it hits 25% harder. |
| O | Switch ability. |
| U | Sanctuary: a dome of 40 to 80 px by charge level for 3 s, six burns of 0.2 of the level's power each; foe shots break on it and he takes half damage inside. |
| Up | Jump; again in the air. |

Valor (VL bar, 0 to 100) fills from blocks (12), parries (25), Guard bash hits (8), Counterbashes (16) and Shield bash hits (6).
At 100 it becomes Radiance for 6 s: each of his own blows deals 35% more, and the first landed blow of each move throws a wave of light (0.5 AD, 64 px).

The ability order is Shield Rush, Sunpillar, Dawn Lance, Mending Light, Rallying Cry, the spells shown once their skill is held.

## The 20 skills

| Id | Name | Kind | Risk | Button | Partner | Evolution |
| --- | --- | --- | --- | --- | --- | --- |
| `al_oath` | Oathblade | attack | easy | J | `al_resolve` | Sunblade |
| `al_breaker` | Breaking Bash | attack | timed | J | `al_brand` | Shattering Bash |
| `al_retort` | Iron Retort | attack | precise | K | `al_vow` | Retribution |
| `al_verdict` | Verdict | attack | precise | J | `al_lance` | Final Verdict |
| `al_crest` | Crestfall | attack | timed | J | `al_skyfall` | Dawnbreak |
| `al_step` | Shield Step | movement | timed | L | `al_rally` | Phalanx Step |
| `al_bulwark` | Bulwark Arrival | movement | timed | J | `al_oathsworn` | Twin Bulwark |
| `al_skyfall` | Skyfall | movement | easy | Up | `al_crest` | Falling Sun |
| `al_lance` | Dawn Lance | spell | timed | I | `al_verdict` | Spear of Morning |
| `al_mend` | Mending Light | spell | easy | I | `al_penance` | Absolution |
| `al_rally` | Rallying Cry | spell | easy | I | `al_step` | War Cry |
| `al_brand` | Sunbrand | dot | timed | J | `al_breaker` | Solar Brand |
| `al_penance` | Penance | dot | easy | K | `al_mend` | Atonement |
| `al_dawn` | Lingering Dawn | dot | easy | I | `al_falcon` | High Noon |
| `al_oathsworn` | Oathsworn | summon | precise | K | `al_bulwark` | Honour Guard |
| `al_lion` | Sun Lion | summon | easy | auto (kill) | `al_oath` | Pride of Dawn |
| `al_falcon` | Dawn Falcon | summon | timed | auto (cast) | `al_dawn` | Sunbird |
| `al_resolve` | Resolve | passive | easy | auto | `al_sanctuary` | Unbroken |
| `al_vow` | Iron Vow | passive | easy | K | `al_retort` | Iron Fortress |
| `al_sanctuary` | Sanctuary | ultimate | easy | U | `al_resolve` | Dawn Citadel |

Counts: attack 5, movement 3, spell 3, dot 3, summon 3, passive 2, ultimate 1. Risk: easy 10, timed 7, precise 3.
The Values column shows only the numbers a level changes; the data rows carry the whole state.
In the Code lines, a file name is a file under `src/heroes/aldric/game/`.
"New" in a card line marks a level that adds a property; the rest are number steps.
Damage source: hits of his own press (string, Guard bash, Stun bash, warp, dodge blows, abilities, the ultimate) count as `attacks`, `abilities` or `ultimate` and build Flow; burns, summons, Verdict's swords and Iron Fortress's lance use the skill id and build no Flow.

#### `al_oath` Oathblade

Attack, easy, J. The sword string hits harder, Crest breaker throws a wave of light, and later every blow does.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | String blows +15%. | power 1.15 |
| 2 | String blows +25%. | power 1.25 |
| 3 | New: Crest breaker throws a wave of light. | wave 0.6 |
| 4 | New: Oath cut also cuts behind you. | behind 1 |
| 5 | String blows +40%. | power 1.4 |
| 6 | New: every blow of the string throws a wave. | waveAll 1 |
| 7 | New: waves pass through foes. | pierce 1 |
| 8 | String blows +80%; waves hit twice as hard. | power 1.8, wave 1.2 |

Evolution **Sunblade** (partner `al_resolve`): Every blow of the string throws a great wave of light that passes through every foe.
Evolved values added: wave 1.6, size 1.6.
Values: `power` multiplies every blow of the ground string, `wave` attack damage of a wave of light thrown by Crest breaker, `waveAll` every blow of the string throws one, `pierce` waves pass through foes, `behind` Oath cut also cuts behind him.
Code: `shapeHit.ts` (power, Oath cut behind), `stringSkills.ts` (waves).

#### `al_breaker` Breaking Bash

Attack, timed, J. The string's Shield bash hits harder, marks the foe and sends a shock through to the foes behind it.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Shield bash +40%. | power 1.4 |
| 2 | Shield bash staggers longer and gives 4 more Valor. | stagger 0.3, valor 4 |
| 3 | New: the bashed foe takes 15% more for 3 s. | mark 0.15 |
| 4 | New: a shock hits the foes behind it. | shock 0.6, shockReach 26 |
| 5 | Shield bash +80%. | power 1.8 |
| 6 | New: Shield bash knocks the foe down. | stun 0.6 |
| 7 | New: the mark rises to 25%. | mark 0.25 |
| 8 | Shield bash +200%; a stronger shock. | power 3, shock 1.6 |

Evolution **Shattering Bash** (partner `al_brand`): Shield bash bursts every Sunbrand on the foes it reaches, each stack a heavy hit.
Evolved values added: shatter 1.2.
Values: `power` multiplies the Shield bash, `stagger` seconds added to its stagger, `valor` Valor added on a hit, `mark` extra damage the bashed foe takes for 3 s, `shock` attack damage of a shock to foes within `shockReach` behind it, `stun` seconds it knocks the foe down.
Code: `shapeHit.ts` (power, stagger, knock-down), `stringSkills.ts` (Valor, mark, shock, Shattering Bash).

#### `al_retort` Iron Retort

Attack, precise, K. The Counterbash, a Guard bash just after a block, hits harder, comes easier and throws light at the foe.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Counterbash +50%. | power 1.5 |
| 2 | Counterbash comes up to 0.1 s later after a block. | window 0.1 |
| 3 | New: a Counterbash gives back 15 stamina. | refund 15 |
| 4 | New: it throws a wave of light at the foe. | wave 2 |
| 5 | Counterbash three times as hard. | power 3 |
| 6 | New: it knocks the foe down. | stun 1 |
| 7 | New: it adds 2 s to Radiance, or 10 Valor. | extend 2 |
| 8 | Counterbash eight times as hard; a heavier wave. | power 8, wave 6 |

Evolution **Retribution** (partner `al_vow`): The Counterbash strikes every foe in front of him at full power and its wave splits in three.
Evolved values added: wide 1, waves 3.
Values: `power` multiplies the Counterbash, `window` seconds added to its moment after a block, `refund` stamina it gives back, `wave` attack damage of a wave of light at the foe it struck, `stun` seconds it knocks that foe down, `extend` seconds it adds to Radiance (or Valor when Radiance is out).
Code: `guardBash.ts` (power, window, refund, wave, stun, Radiance, Retribution).

#### `al_verdict` Verdict

Attack, precise, J. A Keen blow calls a sword of light down on the foe it struck.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A Keen blow calls a sword of light on its foe. | power 1.5, swords 1 |
| 2 | Sword of light 1.5 to 2.5. | power 2.5 |
| 3 | New: the foe takes 15% more for 3 s. | mark 0.15 |
| 4 | New: a Counterbash calls it too. | counter 1 |
| 5 | Sword of light 2.5 to 5. | power 5 |
| 6 | New: two swords fall. | swords 2 |
| 7 | New: the Keen moment is 0.05 s longer. | keen 0.05 |
| 8 | Sword of light 5 to 12. | power 12 |

Evolution **Final Verdict** (partner `al_lance`): Each sword of light lands with a pillar of dawn that strikes the foes around it.
Evolved values added: pillar 1.6.
Values: `power` attack damage of the sword of light, `swords` how many fall, `mark` extra damage the foe takes for 3 s, `counter` a Counterbash calls it too, `keen` seconds added to the Keen moment.
Code: `skills/verdict.ts`; the Keen moment in `kit.ts`.

#### `al_crest` Crestfall

Attack, timed, J. Crest breaker sends a ring of light along the floor that knocks foes down.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Crest breaker sends a ring of light along the floor. | ring 30, power 0.6 |
| 2 | Ring power 0.6 to 0.9. | power 0.9 |
| 3 | New: the ring knocks foes down. | stun 0.6 |
| 4 | New: Crest breaker gives 8 Valor. | valor 8 |
| 5 | Ring reaches 42 px. | ring 42 |
| 6 | New: a second ring follows. | echo 1 |
| 7 | New: Crest breaker itself +40%. | crest 1.4 |
| 8 | Ring power 0.9 to 2.2; reaches 50 px. | power 2.2, ring 50 |

Evolution **Dawnbreak** (partner `al_skyfall`): Crest breaker sends three rings across 80 px, each one knocking foes down.
Evolved values added: ring 80, echo 2.
Values: `ring` radius of the ring, `power` attack damage of the ring, `stun` seconds it knocks foes down, `valor` Valor Crest breaker adds when it lands, `echo` rings that follow it, `crest` multiplies Crest breaker itself.
Code: `shapeHit.ts` (Crest breaker power), `stringSkills.ts` (rings, Valor), `effects/delayedRing.ts`.

#### `al_step` Shield Step

Movement, timed, L. The dodge strikes each foe it passes with the shield.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Foes the dodge passes take a shield blow. | power 0.8 |
| 2 | Shield blow 0.8 to 1.1. | power 1.1 |
| 3 | New: the dodge ends behind a Bulwark. | barrier 1 |
| 4 | New: 5 Valor for each foe passed. | valor 5 |
| 5 | Shield blow 1.1 to 1.5. | power 1.5 |
| 6 | New: Shield Rush's wide burst is 50% wider. | burst 0.5 |
| 7 | New: 15 stamina back for each foe passed. | refund 15 |
| 8 | Shield blow 1.5 to 2. | power 2 |

Evolution **Phalanx Step** (partner `al_rally`): The dodge ends in a ring of light that strikes every foe around him, and its Bulwark takes two blows.
Evolved values added: ring 2.
Values: `power` attack damage to each foe the dodge passes, `barrier` the dodge ends behind a Bulwark, `valor` Valor for each foe passed, `burst` Shield Rush's wide burst grows by this share, `refund` stamina back for each foe passed, `ring` attack damage of a ring of light where the dodge ends.
Code: `step.ts`, the kit's `dodge` hooks; the wide burst in `abilities/rush.ts`.

#### `al_bulwark` Bulwark Arrival

Movement, timed, J. The warp's Bulwark lasts longer and takes more, the warp comes back sooner, and the arrival rings with light.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Bulwark lasts 1.5 s longer. | time 1.5 |
| 2 | Warp recharge 2 to 1.6 s. | recharge 1.6 |
| 3 | New: the arrival sends out a ring of light. | ring 0.8 |
| 4 | New: Bulwark takes two blows. | blows 1 |
| 5 | Arrival blow 1.8 to 2.4. | strike 2.4 |
| 6 | New: a warp costs 6 MP. | cost 6 |
| 7 | New: Bulwark bursts with light when it breaks. | shatter 1.2 |
| 8 | New: two warps in a row. | charges 2 |

Evolution **Twin Bulwark** (partner `al_oathsworn`): Every arrival calls an Oathsworn knight to cut beside him, and Bulwark takes three blows.
Evolved values added: blows 2, knight 1.
Values: `time` seconds added to Bulwark, `blows` more blows it takes, `recharge` seconds the warp takes to come back, `ring` attack damage of a ring of light on arrival, `strike` the arrival blow's power, `cost` MP a warp costs, `shatter` attack damage of a burst when Bulwark breaks, `charges` warps in a row.
Code: `warpStyle.ts` (Bulwark, ring, the warp's numbers through `tune`), `kit.ts` (the burst as it breaks); Twin Bulwark's knight in `skills/oathsworn.ts`.

#### `al_skyfall` Skyfall

Movement, easy, Up. Shield fall hits harder and its ring reaches farther.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Shield fall's landing +30%, reaching 30% farther. | power 1.3, ring 0.3 |
| 2 | Landing +60%. | power 1.6 |
| 3 | New: 6 Valor for each foe the landing strikes. | valor 6 |
| 4 | New: the landing raises Bulwark. | barrier 1 |
| 5 | Landing reaches 60% farther. | ring 0.6 |
| 6 | New: the landing leaves burning light for 2 s. | ground 2 |
| 7 | New: a faster dive. | dive 0.4 |
| 8 | Landing +200%. | power 3 |

Evolution **Falling Sun** (partner `al_crest`): Shield fall brings a pillar of dawn down where he lands, and its ring reaches twice as far.
Evolved values added: ring 1, pillar 1.
Values: `power` multiplies Shield fall's landing ring, `ring` share added to its reach, `valor` Valor for each foe the landing strikes, `barrier` the landing raises Bulwark, `ground` seconds of burning light it leaves, `dive` share added to its dive speed.
Code: `moves/index.ts` (landing, dive), `skyfall.ts`.

#### `al_lance` Dawn Lance

Spell, timed, I. A new ability: a lance of light thrown straight ahead. Held, three in a fan. Grows with ability power.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Throw a lance of light (14 MP). | power 1.6, pierce 1, recharge 5 |
| 2 | Lance power 1.6 to 2. | power 2 |
| 3 | New: lances pass through 3 foes. | pierce 3 |
| 4 | New: lances burn the foes they strike. | burn 0.2 |
| 5 | Lance power 2.4; recharge 4 s. | power 2.4, recharge 4 |
| 6 | New: two lances a cast. | count 2 |
| 7 | New: a lance bursts where it ends. | burst 26 |
| 8 | Lance power 2.4 to 4.5. | power 4.5 |

Evolution **Spear of Morning** (partner `al_verdict`): A spear twice the size that passes through every foe and leaves each one taking 25% more.
Evolved values added: pierce 99, mark 0.25.
Values: `power` ability power of a lance, `pierce` foes one lance passes through, `recharge` seconds, `burn` ability power a burn stack deals a tick, `count` lances a cast throws, `burst` radius of a burst where a lance ends, `mark` extra damage a struck foe takes for 4 s.
Code: `abilities/spells.ts`, `effects/lance.ts`.

#### `al_mend` Mending Light

Spell, easy, I. A new ability: heal, and a ring of light burns the foes around you. Held, more of both. Grows with ability power.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Heal 8% HP and burn foes around you (20 MP). | heal 0.08, ring 34, power 0.8, recharge 9 |
| 2 | Heal 8% to 10%. | heal 0.1 |
| 3 | New: it raises Bulwark. | barrier 1 |
| 4 | New: it gives 20 Valor. | valor 20 |
| 5 | A wider, stronger ring. | ring 44, power 1.2 |
| 6 | New: heals 2% HP a second for 3 s more. | regen 0.02 |
| 7 | New: the ring knocks foes down. | stun 0.8 |
| 8 | Heal 15%; ring power 1.6; recharge 7 s. | heal 0.15, power 1.6, recharge 7 |

Evolution **Absolution** (partner `al_penance`): The ring lays Penance on every foe it burns.
Values: `heal` share of max HP healed, `ring` radius, `power` ability power of the ring, `recharge` seconds, `barrier` raises Bulwark, `valor` Valor it gives, `regen` share of max HP healed each second for 3 s, `stun` seconds the ring knocks foes down.
Code: `abilities/spells.ts`; the healing over time in `kit.ts`.

#### `al_rally` Rallying Cry

Spell, easy, I. A new ability: a shout that throws foes back in a ring and fills Valor. Held, a wider ring. Grows with ability power.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Shout: throw foes back and gain 15 Valor (16 MP). | radius 40, power 0.8, valor 15, recharge 7 |
| 2 | A wider ring. | radius 50 |
| 3 | New: struck foes are blinded for 1.5 s. | blind 1.5 |
| 4 | New: during Radiance it adds 2 s to it. | extend 2 |
| 5 | Ring power 1.2; 22 Valor. | power 1.2, valor 22 |
| 6 | New: string blows 20% faster for 4 s. | haste 0.2 |
| 7 | New: struck foes take 15% more for 4 s. | mark 0.15 |
| 8 | Ring power 2.4; 35 Valor; recharge 6 s. | power 2.4, valor 35, recharge 6 |

Evolution **War Cry** (partner `al_step`): The shout fills Valor to the full at once.
Values: `radius` of the ring, `power` ability power of its blow, `valor` Valor it gives, `recharge` seconds, `blind` seconds struck foes are blinded, `extend` seconds it adds to Radiance, `haste` faster string blows for 4 s, `mark` extra damage struck foes take for 4 s.
Code: `abilities/spells.ts`; the quicker blows in `kit.ts`.

#### `al_brand` Sunbrand

Dot, timed, J. Every bash brands the foes it strikes with burning light that stacks.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Bashes brand foes with burning light. | tick 0.08, max 3, time 3 |
| 2 | Brand burns harder. | tick 0.11 |
| 3 | New: Sunpillar brands the foes it strikes. | pillar 1 |
| 4 | New: up to 5 stacks. | max 5 |
| 5 | Brand burns harder still. | tick 0.16 |
| 6 | New: Oath cut brands too. | cut 1 |
| 7 | New: a branded foe takes 10% more from everything. | bonus 0.1 |
| 8 | Brand burns five times as hard as at first; 6 stacks. | tick 0.4, max 6 |

Evolution **Solar Brand** (partner `al_breaker`): A branded foe that falls bursts and brands every foe near it to the full.
Evolved values added: spread 40.
Values: `tick` attack damage a stack deals every half second, `max` stacks a foe can carry, `time` seconds the brand lasts, `pillar` Sunpillar brands too, `cut` Oath cut brands too, `bonus` extra damage a branded foe takes.
Code: `skills/sunbrand.ts`, `abilities/pillars.ts` (pillar brands), `skillBonus.ts`.

#### `al_penance` Penance

Dot, easy, K. A foe whose blow you block burns with Penance. Grows with ability power.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Blocked attackers burn with Penance. | tick 0.1, stacks 2, max 4 |
| 2 | Penance burns harder. | tick 0.14 |
| 3 | New: a parry lays the most stacks. | parry 1 |
| 4 | New: a Guard bash lays a stack. | bash 1 |
| 5 | Burns harder; up to 6 stacks. | tick 0.2, max 6 |
| 6 | New: each tick heals you 0.5 HP. | heal 0.5 |
| 7 | New: foes near the attacker burn too. | spread 30 |
| 8 | Burns five times as hard as at first; 8 stacks. | tick 0.5, max 8 |

Evolution **Atonement** (partner `al_mend`): When a foe's Penance fills it bursts, each stack a heavy hit.
Evolved values added: burst 0.6.
Values: `tick` ability power a stack deals every half second, `stacks` laid by a block, `max` stacks a foe can carry, `parry` a parry lays the most, `bash` a Guard bash lays one, `heal` HP each tick gives back, `spread` px round the attacker that take stacks too, `burst` ability power each stack deals when the stacks fill.
Code: `skills/penance.ts`.

#### `al_dawn` Lingering Dawn

Dot, easy, I. Sunpillar leaves burning light on the floor where it falls. Grows with ability power.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Sunpillar leaves burning light for 2 s. | burn 0.3, width 18, time 2 |
| 2 | It burns harder. | burn 0.45 |
| 3 | New: Shield Rush leaves it where it ends. | rush 1 |
| 4 | New: it holds the feet of foes in it. | halt 1 |
| 5 | It lasts 3 s and spreads wider. | time 3, width 24 |
| 6 | New: Crest breaker leaves it too. | crest 1 |
| 7 | New: standing in it heals you 1% HP a second. | heal 0.01 |
| 8 | It burns almost five times as hard as at first. | burn 1.4 |

Evolution **High Noon** (partner `al_falcon`): The burning light calls a small pillar on a foe in it every second.
Evolved values added: pulse 1.
Values: `burn` ability power a second to foes standing in it, `width` px, `time` seconds, `rush` Shield Rush leaves it too, `halt` holds foes' feet, `crest` Crest breaker leaves it too, `heal` share of max HP a second while he stands in it, `pulse` ability power of a pillar it calls each second.
Code: `effects/dawnGround.ts`, `abilities/pillars.ts`, `abilities/rush.ts`, `stringSkills.ts`.

#### `al_oathsworn` Oathsworn

Summon, precise, K. A parry may call a knight of light who cuts the attacker.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A parry may call a knight of light (50%). | chance 0.5, power 4, cuts 1, cooldown 2, knights 1 |
| 2 | Chance 50% to 80%. | chance 0.8 |
| 3 | New: he cuts twice. | cuts 2 |
| 4 | New: a Counterbash may call him too. | counter 1 |
| 5 | Cut power 4 to 12. | power 12 |
| 6 | New: his last cut knocks the foe down. | stun 0.8 |
| 7 | New: he leaves a Bulwark on you. | barrier 1 |
| 8 | Cut power 25; every parry calls him. | power 25, chance 1 |

Evolution **Honour Guard** (partner `al_bulwark`): Two knights answer, each cutting three times.
Evolved values added: knights 2, cuts 3.
Values: `chance` a parry calls him, `power` attack damage of each cut, `cuts` cuts he makes, `counter` a Counterbash may call him too, `stun` seconds his cut knocks the foe down, `barrier` he leaves a Bulwark on you, `cooldown` least seconds between calls, `knights` knights at once.
Code: `skills/oathsworn.ts`, `effects/lightKnight.ts`.

#### `al_lion` Sun Lion

Summon, easy, auto (kill). A foe falling may call a lion of light that pounces on foes.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A kill may call a lion of light (25%). | chance 0.25, power 0.6, life 5, every 1.2, most 1, cooldown 1 |
| 2 | Chance 25% to 40%. | chance 0.4 |
| 3 | New: a pounce knocks the foe down. | stun 0.4 |
| 4 | New: it roars as it comes, striking foes near. | roar 0.5 |
| 5 | Pounces 0.6 to 0.9; it stays 7 s. | power 0.9, life 7 |
| 6 | New: two lions at once. | most 2 |
| 7 | New: a pounced foe takes 10% more for 3 s. | mark 0.1 |
| 8 | Pounces 1.3 and come quicker. | power 1.3, every 0.9 |

Evolution **Pride of Dawn** (partner `al_oath`): Three lions walk with him always.
Evolved values added: most 3, always 1.
Values: `chance` a kill calls one, `power` attack damage of a pounce, `life` seconds it stays, `every` seconds between pounces, `most` lions at once, `stun` seconds a pounce knocks a foe down, `roar` attack damage of a roar ring as it comes, `mark` extra damage a pounced foe takes for 3 s, `cooldown` least seconds between calls.
Code: `skills/sunLion.ts`.

#### `al_falcon` Dawn Falcon

Summon, timed, auto (cast). Casting an ability may send a falcon of light swooping through the foes ahead.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | A cast may send a falcon of light (50%). | chance 0.5, power 0.8, passes 1, count 1, cooldown 1 |
| 2 | Chance 50% to 75%. | chance 0.75 |
| 3 | New: it swoops back through them. | passes 2 |
| 4 | New: struck foes take 15% more for 3 s. | mark 0.15 |
| 5 | Swoop power 0.8 to 1.2. | power 1.2 |
| 6 | New: two falcons. | count 2 |
| 7 | New: a Counterbash may send one too. | counter 1 |
| 8 | Swoop power 1.8; every cast sends them. | power 1.8, chance 1 |

Evolution **Sunbird** (partner `al_dawn`): Falcons swoop three times and set the foes they pass burning.
Evolved values added: passes 3, burn 0.2.
Values: `chance` a cast sends it, `power` attack damage to each foe it passes, `passes` swoops it makes, `mark` extra damage a struck foe takes for 3 s, `count` falcons a cast sends, `counter` a Counterbash may send one too, `cooldown` least seconds between sends, `burn` attack damage a burn stack of the evolved falcon deals a tick.
Code: `skills/dawnFalcon.ts`.

#### `al_resolve` Resolve

Passive, easy, auto. Valor fills faster, Radiance lasts longer, and you have more HP.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Valor +20%; HP +10. | valor 0.2; stats hp 10 |
| 2 | Radiance lasts 1 s longer. | radiance 1 |
| 3 | New: blows during Radiance heal 1% HP. | heal 0.01 |
| 4 | New: each block gives 2 MP. | mp 2 |
| 5 | Valor +40%; HP +25. | valor 0.4; stats hp 25 |
| 6 | New: string blows 15% faster during Radiance. | haste 0.15 |
| 7 | New: kindling Radiance raises Bulwark. | barrier 1 |
| 8 | Radiance lasts 2 s longer; HP +40. | radiance 2; stats hp 40 |

Evolution **Unbroken** (partner `al_sanctuary`): Valor fills twice as fast, and kindling Radiance raises a small Sanctuary round him.
Evolved values added: valor 1, dome 1.
Values: `valor` share more Valor from every deed, `radiance` seconds added to Radiance, `heal` share of max HP each blow heals during Radiance, `mp` MP a block gives, `haste` faster string blows during Radiance, `barrier` kindling Radiance raises Bulwark, `dome` kindling Radiance raises a small Sanctuary.
Code: `valor.ts` (Valor, Radiance, kindling), `guardStyle.ts` (MP), `kit.ts` (healing, quicker blows).

#### `al_vow` Iron Vow

Passive, easy, K. Blocks cost less stamina, the guard walk is quicker, and you have more stamina.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | Blocks cost 25% less; stamina +10. | cost 0.25; stats stamina 10 |
| 2 | A quicker guard walk. | walk 0.1 |
| 3 | New: each block heals 1 HP. | heal 1 |
| 4 | New: the Guard bash reaches 30% farther. | reach 0.3 |
| 5 | Blocks cost half; stamina +25. | cost 0.5; stats stamina 25 |
| 6 | New: the Guard bash comes back 30% sooner. | bashRate 0.3 |
| 7 | New: stamina comes back while the guard is up. | regen 15 |
| 8 | A guard walk at 70% of your walk; stamina +40. | walk 0.25; stats stamina 40 |

Evolution **Iron Fortress** (partner `al_retort`): Every blow the shield stops throws a lance of light back at the attacker.
Evolved values added: lance 1.5.
Values: `cost` share off a block's stamina, `walk` share of his walk added to the guard walk, `heal` HP a block gives back, `reach` share added to the Guard bash's reach, `bashRate` share off the Guard bash's wait, `regen` stamina a second while the guard is up, `lance` attack damage of a lance of light a block throws back.
Code: `guardStyle.ts`, `guardBash.ts`, `vow.ts`.

#### `al_sanctuary` Sanctuary

Ultimate, easy, U. Sanctuary grows: it draws foes in, heals you, lasts longer and calls pillars of light. Grows with attack damage.

| Lv | Card line | Values |
| --- | --- | --- |
| 1 | The dome draws foes in and burns 30% harder. | power 1.3, pull 1 |
| 2 | Recharge 20 to 15 s; charges 30% faster. | cooldown 15, charge 1.3 |
| 3 | New: each burn heals you 2% HP. | heal 0.02 |
| 4 | Dome burns +70%. | power 1.7 |
| 5 | New: the dome stands 1.5 s longer. | time 1.5 |
| 6 | New: a pillar falls on a foe inside at each burn. | pillars 1 |
| 7 | New: the dome is 30% wider. | size 1.3 |
| 8 | Dome burns +120%. | power 2.2 |

Evolution **Dawn Citadel** (partner `al_resolve`): The dome walks with him, stands 3 s longer and is half again as wide.
Evolved values added: follow 1, time 4.5, size 1.5.
Values: each a share of the dome's own burn at the charge level: `power` the burns, `pull` the dome draws foes in, `cooldown` seconds, `charge` charging speed, `heal` share of max HP each burn heals, `time` seconds added, `pillars` a pillar falls on a foe inside at each burn, `size` multiplies its radius, `follow` the dome walks with him.
Code: `ultimate/sanctuary.ts`.
## Balance, measured

Measured on 15 November 2026 by the method in `docs/skills/balance.md`, with a scripted player of Aldric's own: the string, the guard with two Guard bashes, a cast, a dodge through a foe, a jump string, a warp and the ultimate at charge level 3, each on a fixed beat of the game clock.
The second round added the model's hard triggers through the shared guard's own function: a parry and a block answered by a Counterbash every 7 s.
Figures are raw damage a second at hero level 1 (AD 10, AP 9) over 60 s after 5 s of warm-up, as the total of every source minus the base kit's total in the same room.
One run per figure; repeat runs of a level 1 skill on the crowd spread by about 40 a second, which is the noise.

Base kit: 128 to 132 on the crowd, 31 to 47 on the lone elite and 49 to 53 on the late target (Kael's reference: 146 on the crowd, 42 on one foe).

First round, before tuning, added damage a second:

| Skill | L1 crowd | L8 crowd | L8 one | Evolved crowd | Evolved one |
| --- | --- | --- | --- | --- | --- |
| `al_oath` | -19 | 45 | 46 | 59 | 40 |
| `al_breaker` | -29 | 8 | 32 | 8 | 32 |
| `al_retort` | -40 | 20 | 0 | 4 | 0 |
| `al_verdict` | -28 | -19 | 12 | 7 | 41 |
| `al_crest` | -4 | 34 | 33 | 117 | 28 |
| `al_step` | 34 | 31 | 24 | 33 | 29 |
| `al_bulwark` | 0 | 15 | 27 | 20 | 34 |
| `al_skyfall` | -22 | -4 | 20 | 11 | 24 |
| `al_lance` | -38 | 18 | 27 | 7 | 29 |
| `al_mend` | -17 | 22 | 8 | -18 | 12 |
| `al_rally` | 0 | 28 | 14 | 20 | 20 |
| `al_brand` | 3 | -9 | 33 | 127 | 33 |
| `al_penance` | -10 | 25 | 22 | 25 | 22 |
| `al_dawn` | -5 | 20 | 21 | 32 | 20 |
| `al_oathsworn` | 0 | 0 | 0 | 0 | 0 |
| `al_lion` | 49 | 66 | 33 | 33 | 88 |
| `al_falcon` | -3 | 125 | 69 | 225 | 61 |
| `al_resolve` | -4 | -3 | 12 | 16 | 18 |
| `al_vow` | 0 | 19 | 19 | -13 | 19 |
| `al_sanctuary` | -2 | 52 | 37 | 99 | 54 |

What changed, level 8 rows only: Oathblade power 1.6 to 1.8 and wave 0.9 to 1.2; Breaking Bash power 2.2 to 3 and shock 1 to 1.6; Crestfall ring 1.4 to 2.2; Skyfall landing 2.2 to 3; Dawn Lance 3.2 to 4.5; Rallying Cry 1.6 to 2.4; Sunbrand tick 0.24 to 0.4; Penance tick 0.3 to 0.5; Lingering Dawn burn 0.8 to 1.4.
The three precise skills were scaled to the size of Kael's precise payoffs: Iron Retort's Counterbash 2 to 8 times and its wave 1.6 to 6, Verdict's sword 2.6 to 12 (level 1 0.8 to 1.5), and Oathsworn's cut 2.6 to 25 (level 1 1.2 to 4).

After tuning, with the hard triggers driven:

| Skill | L8 crowd | L8 one | L8 late | Evolved late |
| --- | --- | --- | --- | --- |
| `al_oath` | 42 | 47 | | |
| `al_breaker` | 12 | 8 | | |
| `al_crest` | 8 | 16 | | |
| `al_skyfall` | -25 | 15 | | |
| `al_lance` | 24 | 5 | | |
| `al_rally` | 13 | 16 | | |
| `al_brand` | 26 | 27 | | |
| `al_penance` | 4 | 13 | | |
| `al_dawn` | 19 | 30 | | |
| `al_verdict` | 0 | 47 | 82 | 94 |
| `al_retort` | 9 | 11 | 18 | 40 |
| `al_oathsworn` | 25 | 20 | 74 | 77 |

On a training dummy one parry with Oathsworn at level 8 deals 930 and evolved 2,325.

### Still off

- The crowd and the lone elite die and come back faster than Aldric's level 8 skills can show their worth, so most crowd and one-foe figures sit inside the noise and under their bands (easy 70, timed 112, precise 175 to 210). The late target dies to one big pull-off too, which caps the precise skills' figures.
- The level 1 figures on the crowd are noise: their spread (about 40 a second) is larger than any level 1 skill.
- Iron Retort and Oathsworn were driven at one Counterbash and one parry every 7 s; in play Aldric blocks far more often, so their real share is larger than the room reads.
- Sanctuary was not measured per cast against the base special; its row is the design estimate.
- A room that holds foes with enough HP to absorb level 8 skills, and repeat runs per figure, are needed before these numbers can be tuned further.
