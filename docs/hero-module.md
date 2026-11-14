# How to add a hero

A hero is a self-contained module.
Everything that belongs to one hero lives in `src/heroes/<id>/`, and shared code reads heroes only through the roster.
A complete hero is built by editing files in its own folder and nothing else.
Kael (`src/heroes/kael/`) is the worked example; every hook below shows how he fills it.

## The roster

| File | Layer | What it holds |
| --- | --- | --- |
| `src/heroes/roster.ts` | data | `ROSTER`, every hero's `CharacterDef` by id in hero screen order, `CHARACTERS` and the `HeroId` type |
| `src/heroes/index.ts` | code | `heroModule(id)`, every hero's `HeroModule` by id |
| `src/heroes/stub.ts` | data | `stubCharacter`, the stand-in a hero uses until it is built |

The nine heroes are registered in both files already, in this order: kael, cerise, aldric, vesper, saya, yun, brynn, zafir, calder.
Nobody edits the roster files to build a hero.

Each hero has two entry files, one per layer:

- `src/heroes/<id>/character.ts` exports the hero's `CharacterDef` (`src/types/character.ts`): data the menus, the stores and the rig read without running the hero's code.
- `src/heroes/<id>/index.ts` exports the hero's `HeroModule` (`src/types/heroModule.ts`): the kit, the moves, the skill code, the ultimate, the icons, the touch art and the meter.

The two layers exist because the data is read while modules load (the save, the achievements, the first frame's skin) and the code reaches back into the game.
Keep the export names the roster imports: `<ID>` from `character.ts` and `<ID>_MODULE` from `index.ts` (`KAEL` and `KAEL_MODULE`, `CERISE` and `CERISE_MODULE`).

## What a hero owns

For hero `<id>`:

| Path | Holds |
| --- | --- |
| `src/heroes/<id>/character.ts` | the data entry |
| `src/heroes/<id>/index.ts` | the code entry |
| `src/heroes/<id>/constants/` | numbers, clips (`constants/clips/`), skill rows (`constants/skills/`), Controls text |
| `src/heroes/<id>/types/` | the hero's own types: states, move ids, memory shapes, skill events |
| `src/heroes/<id>/look/` | colours, head rows, the sword, the off-hand item, rig parts and extras |
| `src/heroes/<id>/game/` | the kit and everything it runs: moves, abilities, the ultimate, skill code, effects |
| `src/heroes/<id>/ui/` | skill icons and touch button art |
| `docs/heroes/<id>.md` | the design note: identity, kit, numbers |
| `docs/skills/<id>.md` | the 20 skills as designed and as built |

A hero touches no other file.
If a hero seems to need a change in shared code, the shared code is missing a hook: say so in the report and work inside the folder with what exists.

Kael's folder shows the shape:

```
src/heroes/kael/
  character.ts            KAEL: CharacterDef
  index.ts                KAEL_MODULE: HeroModule
  constants/              guard.ts, spells.ts, string.ts, skillBlows.ts, nova.ts, controls.ts, ...
    clips/                index.ts (KAEL_CLIPS), string.ts, ground.ts, air.ts, finishers.ts, skills.ts, wounded.ts
    skills/               index.ts (KAEL_SKILL_DEFS) and one file per skill
  types/                  moves.ts (move and clip names), spell.ts, state.ts
  look/                   index.ts (KAEL_SKIN), colors.ts, head.ts, blade.ts
  game/                   kit.ts, pose.ts, readActions.ts, chooseMove.ts, warpStyle.ts, guardStyle.ts, spell.ts, state.ts, ...
    moves/                index.ts (KAEL_MOVES), chain.ts, air.ts, finishers.ts, skills.ts, slashes.ts
    spells/               bolt.ts, burst.ts, fire.ts, ice.ts, lightning.ts, ...
    ultimate/             crystalNova.ts, nova/
    skills/               index.ts (KAEL_SKILLS) and one file per skill with code
    effects/              crystalWave.ts, echo.ts, thrownSword.ts
  ui/
    icons/                index.ts (KAEL_SKILL_ICONS), skills.ts, evolved.ts, parts.ts
    touchArt.ts           kaelArt
```

## Rules of the folder

- Import shared code and your own folder only. A hero never imports a file inside another hero's folder, Kael's included.
- `character.ts`, `constants/`, `look/` and `types/` stay free of game state. They may import `src/constants`, `src/types`, `src/utils`, `src/engine` and `src/rig`, and nothing under `src/game`, `src/ui`, `src/store`, `src/scene` or `src/services`.
- Shared code never imports a file inside a hero's folder.
- `npm run lint` enforces all three (`biome.json`, `noRestrictedImports`).
- Module-level code in a hero's `game/` and `ui/` files must not read game state or the registry while the module loads. Declare constants and functions, register per-seat memory, and read state inside functions.
- Ids must be unique across heroes: every skill id starts with the hero's own prefix (`k_` for Kael; use the first letters of the id, such as `ce_`, `al_`, `ve_`, `sa_`, `yu_`, `br_`, `za_`, `ca_`), every icon id is a skill id or starts with `<id>_`, every achievement id starts with `<id>-`, and every hero stat starts with `<id>.`.
- Move ids and clip names are looked up in the hero's own tables, so they need no prefix.
- Any module-level state of the hero or its pose is per seat for co-op: register it with `rememberPerSeat` (`src/game/seatMemory.ts`, `docs/multiplayer.md`). Keep sprites, pixel arrays, foes and effect lists `hostOnly`.
- A draw function never changes game state and never reads the game `rng`.
- Numbers live in the hero's `constants/`, and any text that shows a number reads the constant.

## Replacing a stand-in

Each of the eight new heroes starts as a stand-in: `character.ts` calls `stubCharacter` and `index.ts` re-exports Kael's module, so the hero plays as Kael under its own id and name.
`CharacterDef.stub` marks it, and the hero screen titles it "Not built yet".
To build the hero, replace both files with the hero's own and stop importing `../stub` and `../kael`.
A finished hero has no `stub` field.
When no hero calls `stubCharacter`, `src/heroes/stub.ts` and the `stub` field are deleted by whoever integrates the last hero.

## The data entry: `CharacterDef`

```ts
export const KAEL: CharacterDef = {
  id: "kael",
  name: "Kael",
  title: "The last warp knight",
  blurb: "Throws his crystal sword and appears where it lands. ...",
  accent: "#7fe3ff",
  price: 0,
  special: { id: "crystalNova", name: "Crystal Nova" },
  base: { ad: 10, ap: 10, hp: 100, mp: 100, stamina: 100, crit: 0.05, move: 1, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.1, mp: 0.45 },
  skills: KAEL_SKILL_DEFS,
  comboHits: 4,
  skin: KAEL_SKIN,
  clips: KAEL_CLIPS,
  controls: KAEL_CONTROLS,
  achievements: [],
  sourceIcons: { attacks: "kael_attacks", abilities: "kael_abilities", ultimate: "kael_ultimate" },
};
```

| Field | Read by |
| --- | --- |
| `id`, `name`, `title`, `blurb` | the hero screen, the result screen, the co-op lobby, the save |
| `accent` | the hero's menu colour: its tile, frame and stat bars on the hero screen, and its ability tabs unless a tab sets a tint; the hero screen needs no CSS per hero |
| `price` | coins to unlock; 0 is open from the start. The prices are fixed: kael 0, cerise 0, aldric 300, vesper 400, saya 550, yun 750, brynn 1000, zafir 1350, calder 1800 |
| `special` | the ultimate on U: `name` shows on the HUD in capitals and on the hero screen; `id` goes into the run report |
| `base`, `growth` | stats at level 1 and per level (`src/utils/stats.ts`) |
| `skills` | the hero's 20 `SkillDef`s (`docs/skill-design.md`) |
| `comboHits` | blows in the ground string for the whole run |
| `skin` | the look on the rig (next section) |
| `clips` | `actions`: the clips the hero's moves and states play, by the hero's own names; `idle`: the rest clip, whose first frame is the stand on the hero screen |
| `controls` | the hero's lines on the Controls screen and the touch controller, over the shared ones |
| `achievements` | the hero's own achievements; the trial for clearing wave 10 is added for every hero by `src/constants/achievements.ts` |
| `sourceIcons` | the icon id of the hero's attacks, abilities and ultimate on the end of run screen |

## The look: `HeroSkin`

Every hero is drawn on the shared rig (`src/rig/`), pure drawing from a pose and a skin.
`drawHero` draws back to front: ropes, far arm, far leg, coat tails, near leg, torso, head, sword arm.
A skin fills these fields (`src/types/character.ts`, `src/types/rig.ts`):

| Field | What it is | Kael |
| --- | --- | --- |
| `colors` | `HeroColors`, each material deep to glint | `{ ...BASE_HERO_COLORS }` in `look/colors.ts`; spread the base and set the materials that differ |
| `head`, `headBack` | 24 by 22 image pixel rows, facing right and from behind; the letters are listed on `HeroSkin.head` | `look/head.ts` |
| `blade` | the sword: `reach` in pixels from hand to tip, and `draw(s, hand, angle, state)` | `look/blade.ts`, the crystal longsword |
| `offhand` | an item of the sword style: `held(s, hand, angle, front, rig)` in the far hand, `hip(s, rig)` at the hip | none |
| `parts` | the hero's own drawing of a shared part: `trails`, `arm`, `leg`, `coatTails`, `torso`, `head` | none: he wears the shared parts |
| `extras` | pieces the shared parts lack, each at a layer: `behind`, `underTorso`, `overTorso`, `overHead`, `front` | none |
| `scarfAt` | where the scarf's rope hangs from: `"neck"` (default) or `"belt"` for a sash | neck |
| `ramp`, `glow`, `sparks` | the colours of slashes, floor rings, afterimages, the warp line, the blade's light and hit sparks | `PAL.crystal`, `SPARKS.crystal` |

How the sword plugs in:

```ts
export const KAEL_BLADE: BladeLook = {
  reach: 17,
  draw(s, hand, angle) {
    const at = heldAxis(hand, angle); // at(d, w): d pixels along the blade from the hand, w across it
    s.begin();
    s.poly([at(2.4, -0.9), at(2.4, 1.1), at(15, 0.9), at(17, 0), at(15, -0.8)], HC.blade);
    s.commit();
    drawFitting(s, () => s.dot(...at(-3, 0), 0.85, HC.trim)); // a pommel in the trim colours
  },
};
```

- The sword is drawn in the near hand at the pose's `sa` angle whenever the hero holds it.
- The same drawing flies in the warp: `drawThrownBlade` (`src/game/effects/thrownWeapon.ts`) turns the blade along the flight, so the thrown sword always matches the one held. A kit may draw its own in `WarpStyle.drawThrown`, as Kael does.
- `reach` sets the blade's light on the stage. Sword trails (`createSlash`), sparks (`createImpact`) and the warp line take the skin's `ramp` and `sparks` unless a call passes its own.
- The pose has two keys for the hero's own use: `oa`, the angle of the item in the far hand (as `sa` is the sword's), and `bs`, the blade state passed to `blade.draw` as `state` and readable from `rig.pose.bs` (a katana half drawn at 0.5, sheathed at 1; an open chamber; a raised shield). Set them in the hero's clips; they are 1.15 and 0 in the shared poses.
- `RigFrame` (`src/types/rig.ts`) gives a part, an extra or an off-hand item everything about the frame: the pose, both shoulders, elbows and hands, the rope points, the coat flare, whether the back is turned, and `armed` (false while the sword flies).
- A part that keeps most of the shared drawing calls it and adds to it: `torso: (s, rig) => { drawTorso(s, rig.pose, rig.back); /* then the hero's own */ }`. The shared parts and helpers are exported from `src/rig` (`drawArm`, `drawLeg`, `drawTorso`, `drawCoatTails`, `drawHead`, `drawTrails`, `armReach`, `legReach`, `toePoint`, `heldAxis`, `drawFitting`).
- Draw with `HERO_COLORS` (`src/constants/palette.ts`), never with the hero's own colour constants: the hero screen portrait and co-op swap the colours in before drawing.
- Everything in `look/` is pure: it draws into the `SpriteCanvas` it is given from the rig frame and nothing else, so one drawing serves the stage, the portrait, the afterimages and the thrown sword.

The hero screen portrait, the tiles, the stage sprite and the afterimages all come from the skin; nothing else needs to be drawn.

Room to draw in, in pixels from the feet with the hero facing right:

| Canvas | Behind | Ahead | Above the floor | Below |
| --- | --- | --- | --- | --- |
| the stage sprite and the afterimages (`HERO_CANVAS` in `src/constants/hero.ts`) | 56 | 56 | 78 | 18 |
| the hero screen portrait and tile, drawn in the rest pose | 30 | 34 | 50 | 6 |
| the thrown sword, from its point back along the blade | 40 | 40 | 40 | 40 |

Anything drawn outside a canvas is cut off, so pose a long sword's rest so it fits the portrait.

## Clips and poses

A clip is an `ActionClip` of keyed poses (`src/types/pose.ts`), written with `pose({...})` and `frame(n)` from `src/constants/hero.ts`.
The shared clips (`src/constants/clips/`) pose every hero's free and held states (idle, walk, run, jump, fall, dash, hurt, dead, guard, charge, ultimate, throwWait) and the shared actions (`cast`, `throw`, `warpStrike`).
A hero's own clips go in `constants/clips/` and into `CharacterDef.clips.actions`; a combo move names its clip there.

A kit's `pose(h, t)` returns the hero's pose for the frame, or null to use the shared clips.
Every hero should pass its pose through the motion layer (`src/game/hero/motion`, rules in `docs/motion-standard.md`), which adds the travel load, the landing, the stop settle and the hand-over between clips:

```ts
function statePose(h: Hero, t: number, frame: MotionFrame): Pose {
  if (h.state === "jump") return sampleKeys(STATE_CLIPS.jump.keys, jumpClock(h, frame.fresh, frame.dt));
  if (h.state === "guard") return sampleKeys(KAEL_GUARD_CLIP.keys, h.st);
  return clipPose(h, t); // the shared clips, and the hero's own move clips
}
export const kaelPose = (h: Hero, t: number): Pose => motionPose(h, t, statePose);
```

Call `resetMotion()` in the kit's `reset`.
`motionPose` takes the hero's own jump crouch as an optional fourth argument: the pose the hero sinks into while a jump loads from a stand.
`clipPose` (`src/game/hero/clipPose.ts`) plays the clip of the combo move under way from the hero's own `clips.actions`.

### The hero's own states

The shared loop runs the shared states (`SharedHeroState` in `src/types/hero.ts`).
A kit that runs states of its own names them by declaration merging, from its own types file:

```ts
declare module "../../../types/hero" {
  interface KitStates {
    cerise: "lunge" | "riposte";
  }
}
```

After that `setState("lunge")` and `hero.state === "lunge"` type-check everywhere, and the kit's `runState` runs them and returns true.
`cast` is a shared state a kit may use for an ability: the shared runner ends it when the shared `cast` clip is over, and the kit lets the ability loose in its `runState` (Kael's `runCast`), returning false.

## The code entry: `HeroModule`

```ts
export const KAEL_MODULE: HeroModule = {
  kit: KAEL_KIT,
  moves: KAEL_MOVES,
  skills: KAEL_SKILLS,
  castUltimate: castCrystalNova,
  icons: KAEL_SKILL_ICONS,
  touch: {
    art: (action, ability, known) => kaelArt(action, ability as KaelAbility, known as KaelAbility[]),
    tint: (ability) => ABILITY_COLOR[(ability || "lance") as KaelAbility],
  },
};
```

| Field | What it is |
| --- | --- |
| `kit` | the `HeroKit` (`src/types/kit.ts`): how the hero plays |
| `moves` | the combo moves by id, played by the shared combo engine |
| `skills` | `SkillBehavior`s by skill id, for skills that act on their own or answer events |
| `castUltimate(level)` | the ultimate let loose at charge level 1 to 4 |
| `icons` | 16 by 16 icon drawings by id: every skill id, `<skill id>_evo` for evolved forms, and the three `sourceIcons` |
| `touch` | `art(action, ability, known)`, the face of each touch button, and `tint(ability)`, the rim colour of buttons that follow the selected ability |
| `meter` | optional: the hero's own bar on the HUD |

### The kit

The shared loop (`src/game/hero/updateHero.ts`) runs the moveset every hero shares (`docs/moveset-design.md`) and calls the kit for what is the hero's own.
Required: `tick`, `readActions`, `chooseMove`, `runState`, `pose`, `afterStrike`, `warp`, `guard`, `abilities`, `absorbHurt`, `hurtScale`, `drivesMotion`, `gravityScale`, `reset`.
Optional hooks, each documented on `HeroKit`:

| Hook | Use |
| --- | --- |
| `shapeHit`, `keenWindow`, `alwaysKeen`, `attackRate` | reshape a combo blow, the Keen timing and the string's speed |
| `mayAct`, `cutForAction` | when shared actions may cut the kit's own state, and how the kit ends it |
| `walkSpeed`, `stride` | the walk speed and the ground one stride covers |
| `damageScale`, `hitBonus`, `takenBonus` | a buff on every hit, a bonus on the hero's own hits, a bonus on what a foe takes |
| `steadfast` | armour: the blow takes its HP with no flinch, knockback or lost combo |
| `airDodge`, `dodge` | a dodge in the air; what happens as the front dodge starts, passes a foe and ends |
| `landed`, `onKill` | one of the hero's own hits landed; a foe fell to the hero |
| `heroAlpha` | how visible the sprite is |
| `drawFloor`, `drawBack`, `draw`, `drawOver` | drawing in the world on the floor, behind the hero, over the hero, and over everything |

Kael's kit (`game/kit.ts`) is the smallest complete example: it reads J through the shared combo engine (`use("attack", pressAttack)`), jumps with the shared `jump`, and adds his counter, blink and spells.

Shared helpers a kit uses:

| Need | Helper |
| --- | --- |
| read a press | `use(action, fn)`, `take`, `isHeld` (`src/game/input.ts`); J and I queue `attack` and `cast` on a tap, `warp` and `castWide` on a long press |
| the string on J | `pressAttack`, `comboOpen`, `endCombo` (`src/game/hero/combo.ts`) |
| jump and lift | `jump` (`src/game/hero/jump.ts`), `lift` (`src/game/hero/lift.ts`) |
| states | `setState`, `settle`, `isFree` (`src/game/hero/actions.ts`) |
| a sword blow | `meleeHit(boxes, blow)` (`src/game/meleeHit.ts`) with `boxAhead`, `boxBehind`, `newSwing` (`src/game/world.ts`) |
| any other damage | `dealDamage(foe, amount, options)` (`src/game/damage.ts`) with a `source`: `"attacks"`, `"abilities"`, `"ultimate"` or a skill's id |
| the trail of a blow, sparks, rings | `createSlash`, `createImpact`, `createFloorRing`, `createThrownWeapon`, `drawCastRing` (`src/game/effects/`) |
| skills | `skillLevel`, `skillValues`, `skillEvolved`, `withCharms` (`src/game/skills/query.ts`), `emitSkillEvent` |
| the ultimate's skill | `ultimateValues()` (`src/game/hero/ultimate.ts`) |
| the warp | `sharedWarpStrike`, `warpSlash`, `refundWarp`, `warpBeside` (`src/game/hero/warp.ts`) |
| stamina, MP refusals | `refundStamina` (`src/game/hero/stamina.ts`), `deny` (`src/game/hero/deny.ts`) |
| a travel move ended | `travelEnded()` (`src/game/hero/travelEnd.ts`), which the shop's Aftershock answers |
| foe statuses | `staggerFoe`, `addStacks`, `stacksOf`, `consumeStacks`, `markFoe`, `ignite`, and the fields on `Enemy`: `halt`, `pinned`, `blind`, `frozen`, `chill`, `shock` |
| areas | `raiseWard` and `lowerWard` (`src/game/shotWards.ts`) break foe shots in a circle; `raiseField` and `lowerField` (`src/game/timeFields.ts`) slow foes and their shots |
| sound | `sfx.swing`, `sfx.hit`, `sfx.cast`, and for the hero's own sounds `sfx.tone` and `sfx.noise` (`src/services/audio.ts`), wrapped in a function in the hero's folder |
| per-seat memory | `rememberPerSeat(objectMemory(state))`, with `true` for host-only state |

Every shop item helps every hero (`docs/meta-progress.md`): deal damage from `progress.stats.ad` and `progress.stats.ap`, spend stamina on defence or travel and MP on the ultimate, walk at `progress.stats.move`, call `travelEnded()` when a travel move lands, and let blows reach `hurtHero`.

### Moves and the combo engine

A `MoveDef` (`src/types/move.ts`) is one move of the string: its clip, its blows (`hits` with boxes, power, knockback, feel), its cancel time, and optional footwork and callbacks.
The kit's `chooseMove(situation)` returns the id of the move J starts now; the engine plays it, lands its blows through `meleeHit`, and handles the queue, the link, Keen timing and the finisher.
Kael's tables are `game/moves/`, typed by his own ids:

```ts
export const KAEL_MOVES: Record<KaelMoveId, MoveDef> = { ...CHAIN_MOVES, ...SKILL_MOVES, ...AIR_MOVES, ...FINISHER_MOVES };
```

The string contract in `docs/combo-design.md` holds for every hero: the same string every time, no blow that turns the hero, and nothing picked from where foes stand.

### Warp, guard and abilities

- `warp: WarpStyle` gives the shared warp its look and one small extra (`strike`, `arrived`, `tune`, `stat`, `drawThrown`). The numbers are shared.
- `guard: GuardStyle` sets the block's `chip` and `blockCost` and the hero's parry reward (`parried`). The shared guard counts one block per touch and stays down after a break until K is pressed again.
- `abilities: AbilitySlot[]` lists the abilities on I in the order O turns through them: each has an id, a tab label in capitals, `known`, `wait`, `full`, `affordable`, `cast(wide)`, and optionally a `tint` (any CSS colour), `evolved` and a `cost` text. The HUD tabs and the touch I and O buttons are built from this list.

### The ultimate

`castUltimate(level)` is the whole ultimate; the shared code has already taken the MP, set the state and played the release flash.
The hero's one `kind: "ultimate"` skill upgrades it; read its numbers with `ultimateValues()`.

### Skills, icons and events

The 20 skills follow `docs/skill-design.md`.
Rows go in `constants/skills/`, code in `game/skills/` (or in the kit for a skill that reshapes a move), icons in `ui/icons/`.
A kit adds its own skill events by augmenting `SkillEvents`:

```ts
declare module "../../../types/skillBehavior" {
  interface SkillEvents {
    drawCut: { foe: Enemy };
  }
}
```

An icon is a function `(s: SpriteCanvas) => void` on a 16 by 16 canvas; `src/ui/skills/icons/parts.ts` has shared shapes.

### The meter

A hero with a resource of its own gives the HUD one bar under stamina:

```ts
meter: {
  label: "RD",                 // two capitals, as HP, MP and ST
  tint: "#9ad0ff",             // any CSS colour
  share: () => rounds / 6,     // 0 to 1
  cells: () => 6,              // optional: notches between equal cells
  lit: () => rounds === 6,     // optional: the bar glows
  flash: () => denied > 0,     // optional: a press it could not pay for
  text: () => `${rounds}/6`,   // optional: a short figure after the bar
},
```

Kael has no meter.
The functions read the hero's per-seat state; the HUD calls them every frame for the hero in play.

### Achievements

A hero's own achievements go in `CharacterDef.achievements` with a goal on one of the hero's own stats:

```ts
{ id: "cerise-ripostes", name: "...", text: "As Cerise, ...", group: "Skill", goal: { kind: "hero", stat: "cerise.ripostes", need: 30 }, reward: 60 }
```

The kit counts the stat with `feat` (`src/game/feat.ts`): `feat({ kind: "heroCount", stat: "cerise.ripostes", add: 1 })` adds to a lifetime count, and `feat({ kind: "heroBest", stat: "cerise.runRipostes", value: n })` keeps the best value ever reached.
The stats are saved with the player's other tracked stats.

### Controls and touch

`CharacterDef.controls` holds the hero's own lines: `actions` for the keyboard rows of the Controls screen (over `SHARED_ACTION_TEXT` in `src/constants/input.ts`), `touch` for each touch button's label, hint and rim colour (over `SHARED_TOUCH_TEXT` in `src/constants/touch.ts`; a null accent follows the selected ability), and `stick` when the stick's directions differ.
Kael's are in `constants/controls.ts`.
`HeroModule.touch.art` returns the pixel face of each button as an `IconArt`, up to 13 by 13; reuse `JUMP`, `DODGE` and `NOVA` from `src/ui/touch/icons/sharedArt.ts` where the hero has nothing of its own.
The touch layout and the keys are the same for every hero.
A hero needs no CSS: the HUD meter, the ability tabs and the hero screen take their colours from the module.

## Run and playtest one hero

The dev server: `npx vite --port <port> --strictPort`, then open `http://localhost:<port>/`.
A hero that costs coins is locked in a normal browser; run `localStorage.setItem("warpblade-playtest", "1")` in the console and reload to unlock every hero (dev builds only; achievements are not tracked while it is set).
`?wave=N&level=L&build=<skill id>:8,evolve:<skill id>,might:5` starts a run late with skills held.

The playtest harness (`agent-studio/playtest/README.md`) reads the roster at run time and needs no entry per hero:

```sh
cd agent-studio
npm run -s playtest -- smoke --hero <id>                                   # the menu, every key, the HUD, no page errors
npm run -s playtest -- bot --hero <id> --policy skilled                    # a whole run: wave, level, kills, coins, picks
npm run -s playtest -- bot --hero <id> --policy mash
npm run -s playtest -- bot --hero <id> --policy skilled --start-wave 11 --start-level 12
npm run -s playtest -- scenario <file.ts> --hero <id> [--viewport 844x390] [--start-wave N --start-level L]
```

Each command starts its own dev server on a free port, so runs in several worktrees do not meet.
The bots read only the hero's position, HP and MP, the foes and the HUD, and press the shared moveset: J to attack, J held when the WARP tab is ready, L to dodge, I when the selected ability tab is ready, O to switch, U when the ultimate's pips are lit.
A hero whose tabs and pips tell the truth is played sensibly without any settings.
With no auto-turn, a scenario must turn the hero toward a foe that got behind it.
J and I act on key-up for a tap, so a scenario advances a frame after a tap before it reads state.
After hot reloads a page that imports game modules by path gets stale copies; restart the dev server before such a test.

## Checks a hero must pass

- `npm run typecheck`, `npm run lint` and `npm run build` pass, with `npm run format` run on the hero's files.
- `git status` shows changes only under `src/heroes/<id>/`, `docs/heroes/<id>.md` and `docs/skills/<id>.md`.
- The smoke check passes for the hero with no page errors.
- A skilled bot run and a mash bot run finish without errors, and the hero's wave is in line with Kael's (skilled: wave 5, level 6, 17 kills, 27 coins on the foundation commit).
- The hero is played in a browser at 1280 by 720 and at 844 by 390 with touch: the hero screen, a run, the pick screen, the result screen, the Controls screen.
- The hero holds a sword in every pose, the thrown sword and the trails match it, and nothing in the look or the names comes from an existing game.
- Co-op: every module-level state is per seat.
- 20 skills to the contract in `docs/skill-design.md`, one of them the ultimate's, each with an icon; an evolved form may have its own (`<skill id>_evo`) and otherwise keeps the skill's.
- The design note and the skill note are written.
