<p align="center">
  <a href="https://warpblade.sainytk.com"><img src="docs/media/banner.png" alt="Warpblade: Kael stands in the night ruins as lightning strikes beside him" width="100%"></a>
</p>

<p align="center">
  <b>Throw the sword. Become the sword.</b><br>
  A pixel art action game where every sprite and every spark is drawn by code.
</p>

<p align="center">
  <a href="https://warpblade.sainytk.com"><img alt="Play in your browser" src="https://img.shields.io/badge/%E2%96%B6%20PLAY-warpblade.sainytk.com-7fe3ff?style=for-the-badge&labelColor=0c0a18"></a>
  <a href="LICENSE"><img alt="MIT License" src="https://img.shields.io/badge/LICENSE-MIT-e0ac48?style=for-the-badge&labelColor=0c0a18"></a>
  <img alt="No image files" src="https://img.shields.io/badge/ASSETS-0%20image%20files-b4a8ff?style=for-the-badge&labelColor=0c0a18">
</p>

---

## The story so far

The old city fell to the night a long time ago.
Its towers still stand under the moon, and rifts keep opening between them.

Kael is the last warp knight.
His crystal sword can be thrown, and wherever it lands, he follows.

<p align="center">
  <img src="docs/media/gameplay.gif" alt="Gameplay: a three-hit combo, a warp strike, then fire, ice and lightning spells against shadow creatures" width="100%">
</p>

## Features

- **One moveset for every hero.** Every hero plays on the same buttons and fills them with their own moves.
  Tap `J` for the hero's string, and hold it for a quarter of a second to warp: the hero throws their weapon at the nearest foe ahead, follows it and strikes on arrival, with the same numbers and the same 10 MP for every hero.
  Hold `K` to guard against blows from the front, and press it just as a blow lands to parry, with a reward of the hero's own.
  `L` is the same front dodge for everyone.
  `I` casts the selected ability, `I` held casts its wide form where it has one, and `O` switches ability.
  `U` is the hero's one ultimate.
- **A full kit from the first second.** Every hero starts a run with every button already doing something.
  Kael has his four-hit sword string, a double jump, Warp Strike on a long press of `J` (throw the sword at a foe and appear beside it mid-swing, harder the farther he travels, 10 MP), a sword guard on `K` whose parry cuts back and lets `J` blink him behind the attacker, the dodge on `L`, and two crystal abilities on `I`, Crystal Lance and Crystal Burst, each with a wide form on a long press.
- **Fixed combo strings.** Each hero's ground string has a fixed length for the whole run: four hits for Kael and three for Ysra, Sable, Hulda, Orrin, Mirel, Wenna, Tallis, Jory and Brannoc.
  Kael's string is a step-in cut, a rising backhand, a twin-fang double stab and a falling smash that knocks the foe down, and each one moves his whole body while his feet stay planted.
  Skills change what the hits do, never how many there are.
- **Combos that play the same every time.** Each press of J plays one whole blow with a wind-up, a strike that holds through the hit and a follow-through, in the same order wherever the foes stand, and heavy blows bounce foes off the edge of the stage.
  Air attacks are their own moves: a wheel slash that circles Kael's whole body, a scissor cut that lays him back and sweeps the blade under his feet, and a stomp that drops him feet first and knocks nearby foes down.
  Kael has two air attacks per jump, the wheel slash and the scissor cut; the Sky Dance skill adds the stomp.
- **Keen timing.** Press J just after a blow lands and the next one is a sure critical hit with a gold slash.
  Pressing before the blow lands spoils it, so rhythm beats mashing.
- **Positioning pays.** Hits from behind deal 1.5 times the damage and foes in the air take double, with the numbers popping out of every hit.
- **Low health warning.** At a quarter of HP or less, a faint red light glows in from the edges of the screen, and under a tenth it grows wider and beats like a heart. It fades in and out as HP drops or comes back.
  A hurt hero stands wounded when idle: Kael hunches over his sword planted in the floor, and Ysra lets her glaive sag onto the floor ahead, both short of breath.
- **Fights that need skill.** Husks block blows from the front and strike back, wisps slip away from swings, and missed swings leave you open.
  Press `K` just as a blow lands to parry it: the hero takes nothing, a minion attacker reels, the world slows for a beat, and MP, stamina and Flow come back.
  Dodge through an attack at the last moment for a perfect dodge and slow motion.
- **Stamina.** The green stamina bar pays for dodges and blocks, and some heroes spend it on moves of their own.
  Each dodge spends 50, half of Kael's bar, so two dodges in a row leave him out of breath until it refills, and every blow the guard blocks costs some more.
  It comes back after a short pause, slower while the hero attacks, and a perfect dodge or a parry gives some back.
- **Hero skills.** Every hero has 20 skills of their own, each with eight levels and an evolution: attacks, movement, spells, damage over time, summons and one ultimate skill, and for some heroes a passive.
  Every level up gives a point, and when a wave's last foe falls the fight pauses on a pick of three cards for each point, four with luck.
  A card offers a new skill, the next level of a held skill, or a charm, each with its own pixel icon.
  A build holds up to 8 skills and 3 charms at first, and every run starts with 2 rerolls, 2 skips and 1 banish to steer the cards.
  If too few cards are left, Second Wind fills the rest and restores all HP and MP.
- **Charms.** Charms multiply one stat for every source at once: Might for damage, Haste for cooldowns, Vigor for HP, Insight for experience, and more that are found over many runs.
- **Chests and evolutions.** Elites with a gold ring, mini bosses and the wave 20 Warden drop chests; touching one opens it.
  A chest raises held skills and charms, sometimes three or five at once, and from wave 8 it evolves a skill at level 8 whose partner skill is held at level 4 or more.
  Kael's Fire Flask evolves with Crystal Familiar into Sunflask, Orrin's Sweet Spot with Perpetual Motion into Perfect Arc, Mirel's Long Echo with Patience into Choir of Hours, Wenna's Hunting Call with Deep Tallow into Pack Law, Tallis's Backbiter with Shroud into Last Breath, Jory's Heavy Accent with Iron Metronome into Thunderclap, and Brannoc's Heavy Hew with Blood Geyser into Earthsplitter.
  A card says "Evolves with ???" until the player has made that evolution once.
- **Flow.** Every hit of the hero's own adds a stack of Flow, up to 25, each one +4% damage on every source, so a full bar doubles it; a perfect dodge adds five, and getting hurt halves it.
- **Charged ultimates.** Every hero has one ultimate on `U` for the whole run: Crystal Nova for Kael, Pyre Wave for Ysra, Bolt Storm for Sable, Quake Drop for Hulda, Grand Pendulum for Orrin, Hour of Stillness for Mirel, Great Wick for Wenna, Gloaming for Tallis, Drumroll for Jory and Berserk for Brannoc.
  Hold U through four levels; level 4 spends a full MP bar.
  After a strike the ultimate recharges for 20 seconds, less with some ultimate skills, and its row on the HUD dims with a bar filling under it.
  Each hero has one ultimate skill, named after their ultimate, that upgrades it level by level and evolves it into a bigger form, such as Supernova for Crystal Nova.
- **Experience to pick up.** Slain foes drop lime orbs of experience that bounce on the floor. Walk over them to collect them; any left behind fly to the hero after 4 seconds, or in a room to the nearest standing hero.
  Attack and ability power grow 2.5% with every level, compounding, and a full run reaches about level 84.
- **Streaming waves.** Each wave has a quota of foes, from 3 at wave 1 to 62 at wave 30, that stream in through rifts until the quota is spent.
  From wave 3 every third wave brings an elite halfway through: a tougher foe of the era with a gold ring that drops a chest.
- **Damage by source.** The result screen lists every source of damage with its level, total damage and damage per second: the hero's attacks, abilities and ultimate, and each skill that strikes on its own.
- **The Codex.** The Codex on the start menu lists every hero's skills and evolutions and every charm, with the ones still locked shown as silhouettes with a short hint, and a few as ???.
- **Abilities on `I`.** Each hero turns through their abilities with `O`: their base ones and every spell skill they hold, such as Kael's Fire Flask that sets the floor burning, his Ice Spikes that freeze and his Lightning that arcs to a second foe.
  Each ability has its own recharge, and casting one adds no wait to any other.
  When the selected one is recharging or cannot be paid for, `I` casts the next ready one and selects it; with none ready, the press is refused with a dull tick and a jolt of the tab.
  The HUD tabs dim while an ability recharges, and a bar along each tab fills back up.
- **Coins and a shop.** Foes drop pixel coins that Kael picks up by touch, and any left behind fly to him after a moment.
  When a run ends, cleared or lost, its coins go to the bank and a result screen shows the wave reached and the coins earned.
  The Shop on the start menu sells stats in levels (HP, attack, ability power, MP, crit, move speed, stamina), more rerolls, skips and banishes for the cards, and four skills: Lodestone, Aftershock and Head Start, bought once, and Last Light, bought in three levels, each saving the hero from one more fatal blow per run.
  Everything bought applies to every run and every hero, on top of the level-up picks, and is saved in this browser.
- **Achievements and hero unlocks.** Thirty-five achievements track goals across runs: waves reached, a clear of wave 10 with each hero, foes slain, long combos, perfect dodges, evolutions, three foes felled by Orrin's swing kicks in one swing, five foes felled inside one of Mirel's Stillfields, forty foes felled by Wenna's Wicks in one run, thirty foes felled from behind by Tallis in one run, twenty seconds held at Crescendo by Jory, thirty foes felled by Brannoc while Bloodied in one run, coins banked, the Rift Warden and The Unblinking.
  Most pay coins, a few stay hidden as ??? until an earlier one is earned, and a small banner slides down when one is earned without stopping play.
  The Achievements page on the start menu shows what each one asks, with a progress bar for those that count up, and the result screen names those a run earned.
  Kael and Ysra are free; every newer hero is unlocked with coins on the hero screen, each one costing more than the last (see [docs/achievements.md](docs/achievements.md)).
- **Ten heroes.** Start opens the hero screen, a roster of hero tiles over one panel for the hero in focus.
  Kael throws his crystal sword and appears where it lands; he is balanced, with a four-hit sword string, a double jump and Warp Strike on `J` held.
  His guard lets a fifth of a blow through, and his parry cuts back at once and lets `J` blink him behind the attacker.
  He starts with Crystal Lance and Crystal Burst on `I`, adds his element spells from picks, and his Crystal Nova skill grows his ultimate with phantoms, falling stars and a storm of edges.
  Ysra, the ember lancer, is a flame-temple guard who woke when the braziers lit again.
  She shares Kael's rig and plays nothing like him: tougher and slower, with one heavy jump and no run.
  Her glaive string of hip thrust, reverse sweep and impale pokes far and pierces every foe in the line.
  Her warp hurls the glaive like a javelin, and she wrenches it free from the foe in a burst of embers.
  Her guard is firm and cheap, a parry gives her Heat and makes `J` a counter thrust, and the side behind her held while she guards steps her back.
  Her blows build Heat, a second bar that pays for her fire rites on `I`, Flare and Cinder Lash from the start; MP pays only for her warp and her ultimate.
  `I` also pole-vaults her over foes, and in the air the vault dives glaive first.
  Her ultimate is Pyre Wave, a wall of flame rolling ahead of her, and its skill makes it roll both ways, erupt and come again.
  Sable, the hooded hunter, fights at range with a repeating crossbow: `J` shoots a three-bolt string at the foe ahead, and an empty quiver reloads on `J`, or by hand with Down and `J`, with a perfect reload for a tap in the bright window.
  Her warp is a grapple that zips her away from the foe and fires a heavy bolt back, and the parry of her crossbow-stock guard, Point-Blank, kicks the attacker away and fills the quiver with primed bolts.
  `I` hops her back with a shot or sets snares for MP, and her ultimate Bolt Storm rains bolts on the foes in reach (see [docs/sable-design.md](docs/sable-design.md)).
  Hulda, the iron grappler, fights bare-handed in iron gauntlets with the shortest reach of all, a slow walk and no run.
  `J` throws a three-blow string of jab, body hook and an overhand haymaker, a hammer fist in the air, and a knee while she holds a foe.
  Her warp hurls a chained gauntlet and hauls her in already holding the foe, which `J` held or `K` then throws: forward into the others, or a suplex into the floor behind her with the side behind held; bigger foes are crushed in both hands.
  Her iron guard lets almost nothing through, and her parry, Iron Catch, seizes the attacker.
  `I` is an armoured Bull Rush (in the air Skyfall Grab, which catches a flier and drives it into the floor), a Bellow that drags foes in, and fliers down to her hands, for MP, or a taunt.
  Her blows, grabs and throws fill Grit, four iron plates under stamina; a blow on a full plate breaks it for half the damage and never stops her, and her ultimate Quake Drop slams both fists into the floor (see [docs/hulda-design.md](docs/hulda-design.md)).
  Orrin, the chain dancer, fights at the length of a brass hook on a steel chain and never runs.
  `J` lashes a three-blow string of Lash, Rising Arc and Full Circle that hits hardest in the last 18 px of the chain, with a Hanging Arc in the air.
  His warp throws the hook at a foe and lands him on it with a flying kick that leaves it bound in chain; with Up held, the hook bites a platform or the air itself, and he swings under it as a pendulum.
  `A` and `D` pump the swing, `J` held reels the chain in to swing faster, and `W` lets go and flings him along the arc.
  His guard spins the chain into a weak shield, and his parry, Chain Bind, hauls the attacker out to the chain's tip and holds it there.
  `I` spins Whirlwall, a chain ring that breaks foe shots, or hurls Anchor Pin to root a foe, for MP, and his ultimate Grand Pendulum swings him under a rift tear and ends in a crash.
  Speed in the air fills Momentum, a bar under stamina that makes every blow hit up to 40% harder, and it drains when he stands still (see [docs/orrin-design.md](docs/orrin-design.md)).
  Mirel, the hour keeper, is a time mage with a staff topped by a clock ring, fragile and patient.
  She walks slowly, jumps once and never runs; holding `W` past the top of her jump hangs her in the air while her stamina lasts.
  `J` swings a three-blow string of Tick, Tock and Toll, with Pendant Strike in the air, and every blow strikes again half a second later as a pale teal echo at the same spot, so a foe that walks into it is hit.
  Her warp flings the staff and skips her to the foe, and its blow echoes too.
  Her guard is a time bubble that slows blows as they reach her, and her parry, the Stopped Moment, stops the attacker in time and gives back half the HP she lost in the last two seconds.
  `I` opens a Stillfield ahead for Sand, a bar under stamina that refills while she spends none, and foes inside act at a fifth of their pace while their shots nearly stop.
  Held, `I` keeps the field open until she lets go, and when it closes it snaps shut, hitting and pushing out every foe inside.
  For MP, `I` also stops the foe ahead dead under a clock face with Stopped Clock or throws Second Hand through a line of foes, and her ultimate Hour of Stillness stops every foe in reach and tolls (see [docs/mirel-design.md](docs/mirel-design.md)).
  Wenna, the lamplighter, is a summoner who fights through the wax figures her lamp lights, the weakest hero alone, with a slow walk and no run.
  `I` lights a Wick for Wax: a wax figure with a violet flame for a head that walks to the nearest foe and bites it, stops ground minions that walk into it, and takes blows aimed at her from its side.
  `J` swings a three-blow lamp string of Tap, Swing and Flare, with Lamp Drop in the air; the foe it hits becomes her Quarry, and every Wick turns on it and bites faster.
  Her warp throws a lit candle at a foe and trades places with it, and the candle burns on as a Wick; her lantern guard's parry, Flare Back, blinds the foes ahead and lights a Wick at her feet.
  `I` also bursts the nearest Wick with Kindle or calls every Wick to a ring round her with Beckon, for MP, and her ultimate Great Wick raises a giant Wick that swings at every foe in reach and melts into new Wicks.
  Wax, a bar under stamina, trickles in and drips from the foes she and her Wicks fell, flying to her when she is near; every wave opens with two free Wicks at her side (see [docs/wenna-design.md](docs/wenna-design.md)).
  Tallis, the gloam knife, is a shadow assassin with two short knives in reverse grip, the highest crit in the roster and HP well below the front-line heroes.
  `J` plays Flick, Cross and Heel Kick, with Drop Stab in the air; blows from behind deal 2.25 times as much, and a rose chevron marks a foe whose back is open to him.
  His warp throws a knife into the foe, and he steps out of its shadow at its back to strike.
  His guard of crossed knives is thin, and his parry, Fade, drops him into the Veil, where minions lose sight of him, keep their facing, start no attack at him and walk on past, with a grey question mark over each one that lost him; his first blow out of it is an Ambush, a sure crit.
  `I` raises the Veil for Gloam, sinks him for stamina into a shadow pool that glides under ground foes and rises facing the back of a foe he came up behind, or for MP drops a Smoke Knot that blinds the minions inside or Hamstrings the foe ahead.
  Gloam, a bar under stamina, refills only while no foe near faces him and from his blows from behind, and his ultimate Gloaming darkens the scene while he appears behind foe after foe (see [docs/tallis-design.md](docs/tallis-design.md)).
  Mini bosses only turn more slowly toward a hidden hero, the Rift Warden is never fooled, and in co-op foes go for a hero they can see.
  Jory, the war drummer, fights to a beat everyone can see and hear: a cobalt ring at his feet closes and flashes on every beat, his body rides it, the GV bar's lamp blinks with it and a soft tick sounds.
  Every tap of `J` and every press of `I` is judged against that beat, and his warp, dodge and parry give more on it.
  On the beat a blow is an Accent that hits 1.4 times as hard and adds a pip of Groove; off the beat Groove falls, and mashing never builds it.
  Groove, twelve pips under stamina, raises his tempo from 96 to 132 beats a minute in four tiers, so a player who keeps time gets faster and reaches further.
  `J` plays Tap, Roll and Crash with his two mallets, and from tier 3 Crash sends a sound wave along the floor; in the air it is Downstroke.
  His warp spins a mallet at the foe and he arrives with a crash, and his drum guard's parry, Counterbeat, bursts a Boom off the drum and on the beat lifts Groove a tier.
  `I` casts Boom for stamina, which pushes foes away and on the beat drowns foe shots and leaves him untouchable for a moment, or for MP Steady Hand, which widens his window and holds his Groove for eight beats, or Thunder Skin, a wave along the floor.
  His ultimate Drumroll plants the drum for a roll of heavy rings (see [docs/jory-design.md](docs/jory-design.md)).
  Brannoc, the berserker, pays for his power in his own HP and wins it back by striking.
  His abilities on `I` cost HP: Frenzy, which keeps blows from knocking him back for four seconds, War Cry, which staggers and marks the foes round him, and Red Crescent, a crescent of blood along the floor; the HP spent shows as a crimson debt segment after the HP fill.
  Every foe a blow of his lands on wins some of the debt back into his HP, with crimson motes flying from the foe to him, and a blow that lands on him first breaks the whole debt away.
  Every point of HP he is missing makes him hit harder, swing faster and walk faster, up to 1.6 times the damage near 0 HP.
  `J` plays Hew, Reave and Cleave with his great axe: Reave sweeps a foe behind him round to his front, and Cleave hits both sides and knocks minions down; at or under 35% HP he is Bloodied, his war paint glows, and Cleave spins twice.
  His warp, the Hunt, hurls the axe into the foe and he rips it out with a chop that wins back more of the debt; his guard lets half of each blow bleed into the debt, and his parry, Blood Answer, wins the whole debt back and starts Frenzy for free.
  His ultimate Berserk keeps him from falling below 1 HP for a few seconds and ends in Last Cleave, a wide ring (see [docs/brannoc-design.md](docs/brannoc-design.md)).
  Sable, Hulda, Orrin, Mirel, Wenna, Tallis, Jory and Brannoc start locked and are bought with coins.
  The hero behind the menu changes as you look through the cards, and the choice is saved in this browser.
- **A 30-wave stage in five eras.** The sky and the foes change as the waves go on, and the scene dissolves into the next era between waves.
  Waves 1 to 5 are a sunlit day with Thornbacks, Glimmer Moths and the Oakheart.
  Waves 6 to 10 bring clouds and rain with Mire Toads, Storm Kites and the Bog Hulk.
  Waves 11 to 15 are night with horned husks, floating wisps and the Rift Brute.
  Waves 16 to 20 turn the night magical, with Rune Golems and Prism Sprites taking over from the night's foes.
  Waves 21 to 30 are the darkest, with Void Stalkers, Abyss Eyes and the Abyss Maw.
  Waves 5, 10, 15 and 25 bring the era's mini boss, the Rift Warden waits at wave 20 and the Abyss Sovereign at wave 30.
  When the Sovereign falls, The Unblinking comes through: a great eye that every hit reaches and none seems to matter to.
  Its lances, tears and gaze hit far harder than anything before it.
- **Co-op for up to four.** Co-op on the start menu hosts a room in your browser, and friends join with its five-letter code or an invite link.
  Each player picks a hero, the same hero twice is fine, and a P1 to P4 tag in the player's colour floats over each hero.
  Waves bring more and tougher foes for each extra player.
  Experience is shared, but every player chooses their own skill cards when a wave is cleared and banks their own coins.
  A fallen player is down until the wave is cleared, then rises with half HP; the run ends when everyone is down at once.
  The host's browser runs the game and streams it to the others over WebRTC; [docs/multiplayer.md](docs/multiplayer.md) has the design and its limits.
- **Plays anywhere.** The game fills the whole screen at a whole-number pixel scale, with the scene continued to every edge. Keyboard on desktop, a pixel touch controller on phones and tablets, no install.

<table>
  <tr>
    <td><img src="docs/media/shot-fire.png" alt="A fire flask bursts into flame and sparks"></td>
    <td><img src="docs/media/shot-ice.png" alt="Ice spikes erupt along the floor"></td>
    <td><img src="docs/media/shot-warp.png" alt="Kael in mid-air after a warp"></td>
  </tr>
  <tr>
    <td align="center">Fire</td>
    <td align="center">Ice</td>
    <td align="center">Warp</td>
  </tr>
</table>

## Controls

Every hero plays on the same keys.
The table names Kael's moves, and the Controls screen lists each hero's own.

| Key | Action |
| --- | --- |
| `A` `D` or arrows | Walk. Tap a side twice and hold to run |
| `W` or `Up` | Jump, the same height however long you hold it. Press again in the air to jump again. Hold `S` and jump to drop through a ledge |
| `J` | Sword combo of four hits, the same every time. Press again just after a blow lands for a Keen hit. Just after a parry, blink behind the attacker and strike |
| `J` held | Warp strike: throw the sword at the nearest foe ahead and warp to it (10 MP) |
| `K` | Guard: hold to block blows from the front. Press just as a blow lands to parry with a riposte cut |
| `L` | Dodge forward. Nothing can touch you while you dodge, and each dodge spends stamina |
| `I` | Cast the selected ability: Crystal Lance, Crystal Burst or a spell you learn. If it is recharging, the next ready one goes |
| `I` held | Cast the wide form of the selected ability, for half again the MP |
| `O` | Switch to the next ability |
| `U` | Hold to charge the ultimate, release to strike |
| `M` | Sound on or off |
| `Esc` or `P` | Pause and open the menu |
| `F` | Fullscreen on or off |

On phones and tablets a touch controller appears, in landscape or portrait, and hides again when you press a key.
The stick on the left appears wherever your left thumb lands.
Push it to walk, push it all the way to run, push up to jump and down for the down variants.
The buttons on the right sit in an arc around a large Attack button: tap it to attack, and hold it to warp.
Around it sit Jump, Dodge, Guard, an ability button that casts on a tap and casts the wide form on a hold, a button that switches ability, and Special.
Each hero's buttons carry that hero's own names where they differ, such as Shoot for Sable's attack.
Several fingers work at once, and a thumb can slide from one button to the next.
Hold Special to charge it: its ring fills one quarter per level, and you strike when you let go.
Buttons dim while their action lacks MP or stamina or waits on a cooldown, and phones that support it give a short vibration on each press.
The page holds still under your fingers: double taps, pinches and long presses never zoom, select text or open a menu.

The game opens on a start menu with Start, Co-op, Shop, Achievements, Codex, Controls and Options.
Start opens the hero screen: pick Kael, Ysra, Sable, Hulda, Orrin, Mirel, Wenna, Tallis, Jory or Brannoc with `A` `D` or the arrows and begin with `J` or `Enter`.
In the Shop, pick an item once to see "Buy?" and again to buy it; a locked hero on the hero screen asks the same way before it is unlocked.
When a run ends, the start menu opens on its result, with Continue and Shop.
Pausing adds Resume, Restart run and Quit run, and freezes the game until you resume.
Move through the menu with the arrow keys or `W` `S`, pick with `J` or `Enter`, and go back with `Esc`; the mouse and touch work too.
The Controls screen lists every key from the game's key map, and on touch screens the stick and buttons as they look on screen.
Options holds sound, volume, screen shake, damage numbers, vibration on devices that can vibrate, and fullscreen, saved in this browser.

Each level up gives a skill point.
When a wave's last foe falls with points waiting, the game pauses and offers three cards for each point.
Choose with `A` `D` or the arrows and learn with `J` or `Enter`, press `1` to `3`, or click or tap a card.
Points left when the last wave of the stage falls are not spent, since the stage ends there.

## Patch notes and feedback

Every update is written up on the [patch notes](https://warpblade.sainytk.com/patches/) page, with the reason behind each change.
Report a bug, a balance problem or an idea through the [game feedback form](https://github.com/SainyTK/warpblade/issues/new?template=game-feedback.yml) on GitHub, and give a thumbs up to [what other players asked](https://github.com/SainyTK/warpblade/issues?q=label%3Agame-feedback).
The studio reads new feedback every night, replies on the issue, and closes it when a patch addresses it, or explains why it will not.
Both are linked from the start menu.

## Run it locally

```sh
npm install
npm run dev
```

Other commands: `npm run build`, `npm run preview`, `npm run typecheck`, `npm run lint`, `npm run format`.

The stack is TypeScript, Vite and Biome.
The only runtime dependencies are three web fonts and [PeerJS](https://peerjs.com), which loads only when a player hosts or joins a room.

To pose Kael, draw effects and hand them to Claude Code agents, run the local [studio](studio/README.md).

## How the pixels are made

This game is also my sandbox for learning how to make pixel art and effects that look good.
There are no image files in the game: the hero, the enemies, the stage and every effect are drawn pixel by pixel at runtime.

The stage is 320 by 180 art pixels, scaled up by a whole number so every pixel stays square.
The frame itself is drawn at twice that, 640 by 360, so the heroes and the effects can carry detail half an art pixel fine.
The stage, the foes and the text keep whole art pixels.
Around the stage, the sky, ridge and stone floor are continued on the same pixel grid and fade out at the edges, so there is no frame.
Each frame is drawn into two buffers, as in Sprite Fusion's effects:

- a color buffer for opaque pixels, faded with a 4 by 4 Bayer dither, or truly blended for smoke and mist;
- a light buffer for additive glow, kept per art pixel and composited on top.

The rules I took from the references, and where they show up:

- Build effects from lines, rims, sparks and light, not flat fills. The slash is a crescent that whips out white at the rim and cools down a blue ramp as its tail follows (`src/game/effects/slash.ts`).
- Put light everywhere. Hits, spells and pickups add lights that flare and fall away with life squared (`src/engine/lights.ts`).
- Use real motion. Sparks stretch with speed and bounce, smoke swells and thins, fire cools down its ramp into smoke, shards tumble and settle (`src/engine/particles.ts`).
- Choreograph in phases: gather, release with a white flash, spread, linger, fade. The lightning bolt marks its target before it strikes, and the ice spikes erupt one after another, stand, then shatter.
- Give every blow an act. Each attack winds up the opposite way, snaps to a new silhouette on the hit frame, freezes the game for a few hundredths of a second on contact, shakes the screen and follows through (`src/constants/clips/`).

Kael is drawn from a small skeleton every frame (`src/game/hero/drawHero.ts`).
His spine runs from hip to neck through a chest point that a pose can push forward or back, so he can lean flat into a lunge, arch under a raised blade or hunch into a wind-up.
A pose can also turn his back to the camera or mirror him to face behind, which is how the spins read as spins.
Arms and legs are placed by two-bone reach, each elbow can bend either way, and each boot tilts to point the toes or rock onto the heel.
The heroes are drawn at the frame's finer grid: each part is lit from the top left with a light edge and a shadow edge, plate armour carries a glint, and the head is a 24 by 22 pixel portrait with a lit eye.
Every hero shares this rig and differs by their colours, head art and weapon (`src/constants/characters/`).
Each body part is outlined where it overlaps the one behind it, and the whole figure gets a dark outline.
Every move, action and state is a keyed clip sampled at 30 frames a second, with a pose keyed on nearly every frame; idle, walk, run, charge and the throw wait loop (`src/constants/clips/`).
His scarf and ponytail are verlet ropes, so they trail behind him as he runs and warps (`src/game/hero/chain.ts`).

The README images were captured from the game canvas when it was 320 by 180 and scaled up with nearest-neighbour, so they show the earlier, coarser heroes.

## Project layout

```text
src/
  main.ts          wires everything and runs the 120 Hz loop
  types/           shared types
  constants/       stage layout, palettes, poses and attack keyframes, tuning, key map, touch controller layout, waves, every hero's stats, numbers and skills, coin drops and the shop items
  utils/           pure helpers: math, color, seeded random, stats, experience, level-up picks, wave plan, shop prices and save parsing
  engine/          the pixel renderer: frame buffers and painter, particles, lights, sprite canvas
  services/        Web Audio sound effects, saved options, run records and shop progress in local storage, the Fullscreen API, vibration, the clipboard
    coop/          the PeerJS links of a co-op room's host and guests, and the game stream
  store/           the player's options, the coin bank, shop purchases, unlocked heroes and achievements kept between runs, achievement tracking, and the co-op room as the menu sees it
  game/            the simulation; beat.ts is the shared beat clock that keeps counting through hit-stop and slow motion
    coop/          a co-op room: the host's run with every player's hero, the host and guest sessions, player tags
    hero/          the moveset every hero shares (warp, guard, dodge, ability bar, ultimate charge), poses, drawing, rope physics, combos and moves, per-step update, and one folder per hero's kit
    enemies/       every foe's drawing and behavior, one folder per era (day, rain, twilight, abyss; the night foes sit at the top level)
      kinds/       one kind per foe type, the registry the game looks foes up in
    effects/       slash, impact, floor ring, warp line, rift, the thrown weapon, crossbow bolt, shadow orb, and folders for Orrin's, Wenna's, Jory's and Brannoc's effects
    spells/        fire, ice, bolt and the explosion they share, and Ysra's rites
    ultimates/     the cast every ultimate goes through, Crystal Nova with its phantoms, stars and storm of edges, Pyre Wave, Bolt Storm and Quake Drop; the other heroes' ultimates sit in their kit folders
    skills/        the skills that act on their own, one folder per hero
  scene/           background, the backdrop around the stage, the order layers are drawn in, and the dissolve between eras
    eras/          one scene per era: palette, sky, decorations, weather and lighting
  site/            the patch notes page and its shared header and shell
  content/patches/ one JSON file per patch, read by the patch notes page
  ui/              HUD, level-up pick, menu, keyboard input, touch controller, stage sizing
    menu/          start and pause menu: main, Shop, Achievements, Co-op and its lobby, run result, Controls and Options screens
    achievements/  an achievement row, its trophy, the earned banner and their styles
    coop/          the co-op line under the pause button
    shop/          one shop row and the shop's styles
studio/            a local tool to pose Kael with the game's rig, draw effects and send them to agents (see studio/README.md)
docs/
  moveset-design.md the layout every hero shares: the warp, guard and parry, dodge, abilities and ultimate
  combo-design.md  what the combo takes from Grand Chase and what it leaves out
  meta-progress.md coins, the shop items and the basis for their prices
  achievements.md  the achievements, how they are tracked, hero unlock prices and how a new hero adds its own
  ysra-design.md   Ysra's kit, Heat and rites, and how she differs from Kael
  sable-design.md  Sable's kit, the quiver and reload, and her balance check
  hulda-design.md  Hulda's kit, Grit and plates, grabs and throws, and her balance check
  orrin-design.md  Orrin's kit, the hook and the pendulum swing, Momentum, and his balance check
  mirel-design.md  Mirel's kit, echoes, the Stillfield, the Stopped Moment, Sand, and her balance check
  jory-design.md   Jory's kit, the beat and Groove, Accents, Boom and Counterbeat, and his balance check
  brannoc-design.md Brannoc's kit, the HP debt, Fury, Frenzy, Hunt and Berserk, and his balance check
  motion-standard.md the rules every hero's animation follows
  pick-pacing.md   when picks come, how long the skill pool lasts and Second Wind after it
  multiplayer.md   co-op rooms: who runs the game, what crosses the network, downs, picks, coins and what is left for later
  media/           README banner, gameplay GIF and screenshots
```

## References

- Hugo Duprez, [How to make (good) pixel art effects with Claude](https://www.spritefusion.com/blog/how-to-make-good-pixel-art-effects-with-claude)
- Sprite Fusion, [open-source pixel art VFX](https://www.spritefusion.com/pixel-art-vfx)
- [pixelfx](https://github.com/patch-gg/pixelfx), the effect library and authoring guide built on those effects

## License

MIT, see [LICENSE](LICENSE).
The particle kinds, the frame model and the slash crescent are adapted from Sprite Fusion's open-source pixel art VFX, MIT License, Copyright (c) 2026 Hugo Duprez.
