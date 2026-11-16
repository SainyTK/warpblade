# Vesper, the twin blade

The fourth hero of the sword roster (patch 0.11.0).
Id `vesper`, name Vesper (she/her), title "The twin blade".
Blurb: "A long blade for reach, a short one for speed. Every blow that lands quickens her, and she keeps foes in the air until the dusk takes them."
Price 400 coins, accent `#b8a0ff` (violet dusk).
Her module is `src/heroes/vesper/`, laid out as `docs/hero-module.md` describes; her skills are in `docs/skills/vesper.md`.

## Identity

Vesper lives in the air and gets faster the longer she keeps hitting.
She carries an uneven pair: a long pale blade in the sword hand for reach and launches, and a short dark blade in the other hand for quick follow-up cuts.
Every blow that lands adds a stack of Tempo, and every stack makes her string and her walk faster.
Her loop is to land the string, throw the foe up with its last press, follow it into the longest air string of the nine, and keep Tempo from falling.

## Look

A wanderer in an asymmetric outfit, drawn on the shared rig with her own parts (`look/`).

- Pale silver hair with a lilac cast, worn long, with a long fringe that falls over the front of her face and hides one eye; the other eye is large and violet.
- A plum coat with one long sleeve on the far arm under a single silver-edged pauldron, and a bare sword arm with ash wraps from the elbow over the hand.
- A thin silver strap across the chest, a violet sash knotted at the hip, and an uneven coat: a short front panel and one long tail behind that flares with speed.
- A long violet scarf that runs on past the shared scarf rope and ends in a split tail.
- The long blade: slender, pale, with a faint curve near the point, a swept silver guard holding the violet warp crystal, and a ring pommel (reach 20 px).
- The short blade: dark, broad and leaf shaped with a violet edge line (reach 10 px), held at the pose's `oa` in the far hand.
- At rest she stands with her weight on the back leg, the long blade hanging across the front of her legs with its point trailing behind her, the short blade reverse-gripped by the far hip.

Her effects are violet dusk (`DUSK_RAMP`) for the long blade and a deeper night violet (`NIGHT_RAMP`) for the short blade, so each blow shows which blade struck.

## Base kit by button

| Button | What it does |
| --- | --- |
| J | The ground string of four presses, two blows each, the same every time: dusk cross (long 0.7, short 0.5 AD), rising pair (0.7, 0.5), scissor turn (0.75, 0.55), moonrise (short 0.6, then the long blade 1.6 AD that throws the foe up as she leaps 30 px after it). |
| J (air) | The air string of four presses: swallow cut (0.9), wing cut (0.8, pops the foe up), twin wheel (0.65 and 0.6, throws up), nightfall (1.0, spikes, then a landing that cuts both sides for 1.2 and knocks foes down). The last air press is always the nightfall. |
| J (Keen) | The shared Keen timing: a press just after a blow lands makes the next press a sure crit. Her reward: a Keen press that lands adds two Tempo stacks. |
| J held | The shared warp. She throws the long blade, keeps the short one, and lands with both for a cross cut at the shared power. Her extra: 2 Tempo. |
| K | Crossed blades: an average block (25% through, 14 stamina). |
| K (parry) | The short blade turns the blow aside: a cut at once (0.9 AD, sure crit), 3 Tempo, and for 1.4 s every blow of hers counts as from behind and breaks guards. |
| L | The shared dodge. |
| I | Twin Crescent or Stitch, then the spells her skills teach. |
| I during the string | Her cancel rule: after a blow has landed, the ability goes off at once and the string goes on from where it was. |
| I held | The wide form for half again the MP. |
| O | Switch ability. |
| U | Dusk Waltz. |
| Up | Jump; Up again in the air is the double jump. |

Base abilities:

- Twin Crescent (10 MP, 3.5 s): the long blade's wave and the short blade's wave leave her hands angled together and cross 38 px ahead, 1.3 AP each, each cutting a foe once. Held: a second, steeper pair crosses higher for fliers.
- Stitch (12 MP, 5 s): she darts to up to 3 foes within 72 px, nearest first, cutting each for 1.1 AP, and comes back to where she started. She cannot be touched while it runs, and it ends within about a quarter of a second. Held: 5 foes within 110 px.

A woven ability may be cut by the warp, the guard, the dodge, another ability or the ultimate once it has left her hands; the stitch cannot be cut and always brings her back first.
A press made during either waits for that moment, or for the moment the stitch settles, so none is lost.
When nothing cuts a woven ability, the string goes on after it as before.

## Tempo (TP)

The meter under stamina, label TP, one cell a stack, glowing at the top (`constants/tempo.ts`).

- 0 to 10 stacks; Unbroken Rhythm raises the top.
- A blow of the string that lands adds 1, a Keen one 2; a warp arrival adds 2 and a parry 3.
- Each stack plays her moves 3% faster and makes her walk 1.5% faster, so the full top is 30% on the string.
- After 1.3 s without a blow landing, a stack falls every 0.3 s.
- A blow taken costs half the stacks.
- At the top, each short-blade blow that lands sends an echo cut (a small night cross, 0.35 AD) at each foe it struck.

## Ultimate: Dusk Waltz

Her afterimage dances through every foe in reach (80, 130, 200 px, then the whole screen at charge level 4) and cuts each 2 times plus one more for every 4 Tempo stacks.
Each foe takes 75% of the charge level's power, the same budget as Crystal Nova, plus 4% for each Tempo stack.
She stands faint where she was while her afterimage dances, and the dance leaves a trail of afterimages from foe to foe.
Its skill is Dusk Waltz (`ve_waltz`).

## Numbers

`base: { ad: 10, ap: 9, hp: 92, mp: 95, stamina: 100, crit: 0.06, move: 1.06, aspd: 1.05, haste: 1 }`, growth `{ hp: 1, mp: 0.45 }`, `comboHits: 4`.
She is a little lighter than Kael (92 HP to his 100) and a little quicker on her feet and in her string.

Tempo of the string with J pressed in time, before Tempo: about 0.1 s between the two blows of a press and about 0.45 s from one press to the next (`STRING_CANCEL` in `constants/string.ts`).
Hit feel is light and short (`STRING_FEEL`), with the moonrise launch and the nightfall landing the heaviest.

## How she differs from the other eight

- Kael casts elemental spells into his string and blinks behind the attacker after a parry. Vesper has no element; she weaves abilities into the string without ending it, and her parry opens every foe for a moment.
- Cerise pins one foe on a long thin line with single thrusts and chains ripostes. Vesper's blows come in pairs over a short reach, and her parry gives one cut and an opening, never a chain.
- Aldric attacks from behind a raised shield and has the best block. Vesper's block is average and her defence is staying in the air and in motion.
- Saya stores cuts and releases them at the sheathe, a burst in beats with pauses. Vesper's damage is a steady rising stream that pays for never pausing.
- Yun repeats his blows through spirit swords at range. Vesper has nothing that repeats her blows at range; her echo cuts land on the foe she has just struck.
- Brynn swings slowly through hits with armour. Vesper is the fastest string in the roster and has no armour.
- Zafir walks while he attacks and cuts on both sides with bleeding wounds. Vesper plants her feet on the floor and goes up; her damage over time is dusk sigils, night and afterglow, never bleeding.
- Calder fires a round at the moment of impact and manages a chamber. Vesper has no ammunition; her resource fills by landing blows and falls when she stops.

## What was left out

- No bleed: bleeding belongs to Zafir, so her damage over time is sigils, night and afterglow.
- No spirit copies that repeat her blows at range: Twin Phantom and Dusk Shade strike on their own with their own cuts.
- No long travel: Stitch returns her to where she started, and the waltz is danced by her afterimage while she stays put.
- No combo length growth: the ground string stays at four presses; only Ascending Step lengthens the air string.

## Notes for the code

- Her own states are `weave` (an ability under way) and `stitch`; both are declared in `types/state.ts`.
- Air presses run on their own count (`airHits`, read by `chooseMove`), so the ground string's count never caps the air string.
- Spells use the crossing swing clip of Twin Crescent for their cast; walk, run, jump and fall use the shared gait clips with her short blade carried reverse-gripped.
