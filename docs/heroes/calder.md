# Calder, the trigger blade

The ninth hero of the sword roster (patch 0.11.0).
Id `calder`, name Calder (he/him), title "The trigger blade".
Blurb: "A drifter who rebuilt a broken sword around a revolving chamber. He cuts, and as the blade bites he pulls the trigger. Six rounds, then a reload."
Price: 1800 coins, the last price in the hero order (`docs/meta-progress.md`).
Accent `#b4ff5a`, phosphor green.
Kael is crystal cyan and Yun is jade green; phosphor green is the yellow side of green, so the three never read as one.

The full skill tables are in `docs/skills/calder.md`.
Code layout follows `docs/hero-module.md`: everything is in `src/heroes/calder/`.

## Identity

Calder cuts, and pulls the trigger as the blade lands.
A round goes off in the wound: a green blast on the foe and a kick of recoil through his arms.
He counts his rounds.
Six sit in the chamber, a Trigger spends one, his two shots spend one or two, and an empty chamber reloads on the next J with a short flourish.
A reload pressed on the beat is quick and loads hot rounds.

The loop is a rhythm of three: cut, cut, Trigger.
The fun sits in the timing of the Trigger and the timing of the reload, the two moments the game asks for a press on the beat.

## Base kit by button

| Button | What it does |
| --- | --- |
| J | The ground string, 3 heavy blows, the same every time: Hew (a falling diagonal cut), Rip (a rising backhand) and Breaker (an overhead slam that knocks down). |
| J (Trigger) | J pressed in the Keen window just after a blow lands makes the next blow a Trigger: a sure critical hit, and a round fires into the wound for a blast on the foe and splash around it. Spends 1 round. With an empty chamber the Trigger still crits and the chamber clicks. |
| J (empty chamber) | Reload: the cylinder swings out, six rounds go in, it snaps shut. A J pressed while the cylinder glints is a quick reload: it ends at once and loads hot rounds, whose blasts hit half again as hard. A press before the glint spoils it. |
| J (air) | Air string of 2: Air hew, then Drop cut, a downward cut that falls fast and drives foes into the floor. Either can be a Trigger. |
| J held | The shared warp. With a round loaded, the arrival blow fires it into the foe. |
| K | Guard on the spine of the blade: lets 25% through for 14 stamina. |
| K (parry) | Point-blank counter shot: a heavy blast that staggers the attacker, loads 2 rounds and makes the next J a Trigger. |
| L | The shared dodge. |
| I | The selected ability: Slug Shot or Scatter Blast, then the shells of the spell skills. Each has its own recharge. |
| I held | The wide form of the selected ability. |
| O | Switch ability. |
| U | Cylinder Break: every round in the chamber goes into a run of exploding cuts, more cuts with a fuller chamber; the chamber then reloads hot. |
| Up | Jump; Up again in the air is a double jump. |

### Abilities

Calder's two shots are paid in rounds, his spell skills' shells in MP.

- Slug Shot (`SLUG`, 1 round, 3.5 s): a heavy round straight ahead that pierces every foe in its line, 2.4 AP each.
  Wide, Breaker Slug (2 rounds): a larger slug that breaks guards and drives each foe it passes back.
- Scatter Blast (`SCATTER`, 2 rounds, 5 s): a point-blank cone of pellets ahead, 2 AP to each foe within 46 px, with a short hop back from the recoil.
  Wide, Twin Scatter (3 rounds): pellets fore and back, no hop.

A shot with too few rounds is not affordable and its tab dims, so I goes to the next ready ability and J reloads.
The cancel rule between the string and the shots is the snap shot: I pressed once a blow has landed skips the aim, and the round leaves the barrel on the next frame.
Past the moment the rounds are in, J cuts a reload short and goes straight into the string.
The hop back is a travel move: it calls `travelEnded()` when it lands.

### The meter: the chamber

`RD` on the HUD: six cells, one per round, with the count after the bar.
The bar glows while the rounds are hot and flashes when a Trigger clicks on an empty chamber.
Rounds come from a reload (to full) and a parry (2).
Spend: a Trigger 1, the warp arrival 1, Slug Shot 1, Scatter Blast 2, Cylinder Break all.

### Numbers

| What | Value |
| --- | --- |
| Stats | AD 11, AP 9, HP 105, MP 90, stamina 100, crit 5%, move 0.97 |
| Growth per level | HP 1.15, MP 0.4 |
| String | Hew 1.45 AD, Rip 1.5 AD, Breaker 2.8 AD (knocks down) |
| Air | Air hew 1.6 AD, Drop cut 1.9 AD (spikes) |
| Trigger blast | 1.2 AD on the struck foe, 0.5 AD within 18 px; hot rounds 1.5 times |
| Reload | 0.6 s; quick reload window 0.16 to 0.3 s into it |
| Warp extra | 0.35 AD blast on arrival with a round loaded, a fifth of the arrival blow |
| Parry | counter shot 2 AD, staggers 1 s, +2 rounds, next J a Trigger |
| Guard | chip 25%, 14 stamina a block |

All numbers live in `src/heroes/calder/constants/`.

## Tempo

The string is heavier than Kael's: about 0.5 real seconds from one blow landing to the next and 0.65 from Breaker to the next Hew.
Three blows a string with more power each keeps Calder's string damage close to Kael's four, and the Trigger blasts are his extra.

## How he differs from each of the other eight

- Kael casts elemental spells into his string and blinks behind foes after a parry. Calder fires rounds from his own sword, counts them and reloads; his parry shoots, it never moves him.
- Cerise marks foes with long, thin thrusts and chains ripostes. Calder has short heavy cuts, splash blasts and one counter shot per parry.
- Aldric fights behind a shield with the best block. Calder's guard is average and his parry pays in rounds.
- Vesper lives in the air and speeds up while she hits. Calder's tempo never changes; his air string is two blows and a fall.
- Saya stores cuts and releases them at the sheathe. Calder's blasts go off at once, in the wound, on the beat.
- Yun sends spirit swords out at range. Calder's range is his shots, paid in rounds.
- Brynn swings through hits with armour and shockwaves. Calder has no armour, and his blows are fast enough to Trigger.
- Zafir walks while he attacks and bleeds foes. Calder plants his feet for every blow and fires.

## The look

A drifter mechanic.
A long gunmetal duster coat with split tails to the shins, a leather bandolier of brass rounds across the chest, a rust neck scarf, heavy leather gloves and boots.
Messy dark hair with brass goggles pushed up on it, the lenses lit phosphor green.
The sword: a broad single-edged blade with a dark spine, a revolving cylinder at the guard holding the green warp crystal at its hub, a short barrel under the spine and a trigger guard below the grip.
The cylinder swings out to the side when he reloads (blade state `bs` 1).
At rest he carries the sword on his shoulder, weight on the back leg.
Rounds leave green tracer light; blasts are white at the core, lime in the body and dark green at the edge.

## What I chose not to build

- No manual reload: a reload happens only on an empty chamber, so a reload is always a decision the chamber made, and J never does two things at once.
- No ammunition on MP: the chamber is the only round count. Spell skills' shells are MP, so Wellspring helps and the chamber stays simple.
- No ranged string: every J blow is a sword cut. Shots are the abilities, the parry and the Trigger blast.
- No charge-up blows: J held is the shared warp.
