# Saya, the quiet draw

The fifth hero of the sword roster (patch 0.11.0, task T-mac-260).
Id `saya`, name Saya (she/her), title "The quiet draw".
Blurb: "Her katana stays in its lacquered scabbard until the moment it is needed. Every cut she makes waits in the foe, and all of them land at once when the blade clicks home."
Price 550 coins, the fifth price in roster order.
Accent `#8fa2ff`, indigo light, the menu colour of her ink and moonlight.
Her module is `src/heroes/saya/`, laid out as `docs/hero-module.md` describes; her skills are in `docs/skills/saya.md`.

## Identity

Saya is a calm swordswoman who fights in beats: she draws, cuts, and sheathes.
A cut of hers lands a little at once and stores the rest in the foe as a thin ink line.
When her katana clicks back into the scabbard, every foe she cut takes all of its stored cuts in one burst.
She is the only hero whose damage lands late and all at once.

The loop is draw, cut, sheathe, breathe.
The pause between her strings is part of the kit: while the blade rests she gathers Focus, and a breath of Focus makes the next draw cut reach farther and store more.

## Look

- A white short robe with indigo lining, tied with a dark indigo cord sash whose ends trail from the belt.
- Wide dark indigo trousers that flare at the ankle and swing behind her, and dark sandal boots.
- Long black hair tied high in a long tail that sways and settles, with a fringe swept to one side and blue-black glints.
- The katana: a long curved single-edged blade, a round dark guard with a moon-white warp crystal set in it, and a wrapped grip.
- The scabbard: black lacquer with an indigo shine and a white cord, worn at the left hip, edge up.
- Her blade is in the scabbard whenever she is not attacking, so she walks, runs, jumps and guards with it sheathed.
- Her effects are black ink brush strokes with a white edge: her slashes are ink crescents rimmed in white, her stored cuts hang on the foe as thin white-edged ink lines, and a release bursts them in ink splashes.
- Her ramp runs from ink black through indigo to moon white (`look/ramp.ts`).

The silhouette reads from the high tail, the flared trousers and the long scabbard at the hip.

## Base kit by button

| Key | Saya |
| --- | --- |
| A / D | Walk; a double tap runs |
| W | Jump; a second jump in the air |
| J tapped | The string: draw cut, return cut, sheathe. In the air, one falling draw |
| J held | The warp: she throws the katana, arrives past the foe with the blade drawn, and sheathes |
| K | Guard with the sheathed katana; a parry is the counter draw |
| L | The shared front dodge |
| I tapped | The selected ability: Brushline or Moonrise, or a spell skill; on a recharging one, the next ready one |
| I held | The wide form: Brushline cuts there and back; Moonrise rises on both sides |
| O | Switch ability |
| U | Silent Moon, charged by holding |

### J: the string

Three presses, the same every time (`constants/string.ts`, `game/moves/string.ts`).

1. Draw cut: her hand goes to the hilt and the blade leaves the scabbard in one level cut, the longest reach of her string; it breaks a raised guard, so the cut it stores always lands.
2. Return cut: the blade comes back up and across from the other side.
3. Sheathe: she flicks the ink off the blade and slides it home; the click strikes a short blow ahead and releases every stored cut.

Each of the first two blows deals a share at once and stores the rest in every foe it struck.
The sheathe's release knocks the foes it lands on down, so the next string's draw cut meets them on the floor.
The string is three hits for the whole run (`comboHits: 3`).

Stored cuts:

- A foe keeps every cut stored on it, from any of her blows, abilities or the warp, until her next sheathe.
- A sheathe releases them all on every foe at once, wherever the foe is, as one hit per foe.
- A keyed sheathe releases them in full: the string's sheathe, the warp's arrival, the end of each ability, the landing of the falling draw, the counter draw and Silent Moon.
- When the blade goes home without a sheathe of its own (she stops between blows, guards, dodges or is hurt), the cuts release at a lower share (`RELEASE.early`).
- So stopping never loses a cut, and finishing the string pays.

Timing reward: a sheathe pressed in the Keen beat just after the return cut lands is a clean sheathe.
Its release is a sure critical hit on every foe, and it gives a breath of Focus.

### J in the air: the falling draw

One per airtime: she draws as she drops, cutting down and ahead, and the blow drives a foe in the air down.
It stores like a draw cut and spends a breath like one.
When she lands, the blade clicks home and the cuts release in full.

### Focus (FO bar)

A bar of three breaths under stamina, in moon white, that glows when full (`constants/focus.ts`).

- A breath fills every `FOCUS.rest` seconds while the blade rests and she is not hurt.
- A parry, a perfect dodge and a clean sheathe each give one at once.
- Each draw cut and falling draw spends one breath when she has one: that draw reaches `FOCUS.reach` px farther and stores `FOCUS.store` times as much.

The bar fills between strings, so a pause pays for the next burst.

### J held: the warp

The shared warp in every number: the throw, the flight, 10 MP, the 2 s recharge, the reach and the arrival's power.
Her style (`game/warpStyle.ts`):

- She arrives past the foe, still facing the way she travelled, with the blade drawn at the end of its cut.
- The arrival deals a small share at once and stores the rest, a fifth larger, in the foe.
- A beat later she sheathes and the stored cut releases with every other.
- J tapped after `WARP.cut` starts the string at once, and the stored arrival cut waits for that string's sheathe.

When the foe stands against the edge of the stage she arrives beside it as every hero does.

### K: guard and counter draw

A scabbard block: she holds the sheathed katana across her body in both hands.

- A blocked blow lets a quarter through and costs 14 stamina, an average block.
- The parry is the counter draw: the blade leaves the scabbard at once in one cut at the attacker, a sure critical hit, the hardest single hit any parry gives in the roster.
- The counter draw ends in a sheathe, so it releases every stored cut, and the parry gives a breath of Focus.

### I: abilities

Both cost MP and have their own recharges, and either may cut into the string once a blow has landed.
An ability ends in a sheathe, so casting one mid-string cashes in the string's stored cuts at full value: that is her cancel rule.

- Brushline (`LINE`): she dashes a short way along a line through the foes ahead with the blade drawn and stops past them, cutting every foe on the line; the cut is stored and she sheathes at the end of the line. She cannot be hit during the dash. Held, she cuts back along the same line to where she began, so each foe is cut twice.
- Moonrise (`RISE`): a rising draw that lifts her a little and sends an ink wave up and ahead that throws foes into the air and stores a cut in each. A falling draw from the top of it meets the foes she threw. Held, a second wave rises behind her.

### U: Silent Moon

The foes on screen are held still, ink lines cross the stage through them one after another while Saya stands with the blade drawn, then she sheathes and every line bursts.
A foe takes a burst for each line through it, and its stored cuts release with the lines.
Higher charge levels draw more lines and hit harder; her one ultimate skill, Silent Moon, adds to it.

## Numbers

All in `src/heroes/saya/constants/`.

| What | Value |
| --- | --- |
| Base stats | AD 11, AP 8, HP 95, MP 90, stamina 100, crit 8%, move 1.04 |
| Growth per level | HP 1.0, MP 0.4 |
| Draw cut | 0.55 AD at once, 1.35 AD stored, reach 38 px, breaks guards |
| Return cut | 0.55 AD at once, 1.35 AD stored |
| Sheathe | a 0.4 AD click, then the release, which knocks down |
| Early release | 60% of the stored cuts |
| Focus | 3 breaths, one per 1.4 s at rest; a breath gives the draw +14 px and 1.6 times its store |
| Guard | chip 25%, 14 stamina; counter draw 3.4 AD, a sure critical hit |
| Warp | the shared power: 20% at once, 80% stored with a fifth more |
| Brushline | 12 MP, 3.5 s; 44 px dash; 0.3 AP at once and 2.4 AP stored per foe |
| Moonrise | 14 MP, 4.5 s; 0.6 AP at once with a launch, 1.6 AP stored |
| Wide forms | half again the MP |

## How she differs from the other eight

- Kael casts elemental spells into his string and blinks behind the attacker after a parry. Saya casts no elements; her abilities are sword cuts whose damage waits for the sheathe, and her parry answers in one cut with no second press.
- Cerise pins one foe on a long thin line with many quick thrusts and chains ripostes from Keen presses. Saya swings three wide cuts, and her parry is one hard counter that ends in a sheathe, never a chain.
- Aldric advances behind a shield and turns blocks into Valor. Saya's block is average and her guard is a moment of stillness; she gains from parries, never from blocks.
- Vesper lives in the air and grows faster the longer she keeps hitting. Saya has one air blow, and her meter fills while she is not attacking.
- Yun's spirit swords repeat his blows at range. Saya's cuts are delayed in the foe she cut and come out at the sheathe, with nothing sent out to strike again.
- Brynn swings through hits with armour and clears crowds with one wide blow. Saya has no armour; a crowd falls to her when she has cut each of them and sheathes once.
- Zafir keeps walking while he spins and cuts both sides. Saya plants her feet for every blow and cuts only ahead, apart from Moonrise's wide form.
- Calder fires rounds on impact and counts a chamber. Saya's resource refills by resting, and her timing reward is the clean sheathe.

## Checks

The bots on the finished kit reach wave 5 at level 6 with 16 kills (skilled) and wave 5 at level 5 with 15 kills (mash), against Kael's wave 5, level 6, 17 kills and wave 5, level 5, 14 kills on the same commit.
From wave 11 her skilled runs at start levels 12, 13 and 14 reach waves 11, 14 and 12, and Kael's 12, 12 and 13.
The skill measurements and their limits are in `docs/skills/saya.md`, "Balance".

## What I chose not to build

- No stance switch or held draw on J: a held J is the shared warp, and the old heroes' held and charged attacks were what the owner found slow.
- No cut that turns her around or picks a target: the warp keeps her facing the way she travelled.
- No timer that throws stored cuts away: every cut releases at the next sheathe, and an interrupted string still pays a share.
- No long travel: Brushline covers 44 px and Moonrise lifts her about 20 px, inside her jump.
