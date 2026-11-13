# Moveset design: one layout for every hero

The rework asked for on 13 November 2026 (task T-mac-253).
Owner feedback: only Kael and Sable were strong enough to clear the stage, because both reach far (Kael's warp strike, Sable's bolts).
Every hero now plays on the same buttons, with the reach and the defence the strong two had, and each hero still plays as their own.

## The layout

| Key | Action | Shared code |
| --- | --- | --- |
| J tapped | The hero's own string, the same as before | the kit |
| J held | The warp move: throw the weapon, warp to it, strike on arrival | `src/game/hero/warp.ts` |
| K | Guard, held; a parry (perfect guard) when pressed just as a blow lands | `src/game/hero/heroGuard.ts` |
| L | The front dodge, Kael's dash, for everyone | `src/game/hero/dash.ts` |
| I tapped | The selected ability; on a recharging one, the next ready one | `src/game/hero/abilityBar.ts` |
| I held | The wide form of the selected ability, where it has one | `src/game/hero/abilityBar.ts` |
| O | Switch ability by hand | `src/game/hero/abilityBar.ts` |
| U | The hero's one ultimate, charged by holding | `src/game/hero/ultimate.ts` |
| W, Up | Jump | the kit |

`updateHero` reads presses in this order: the dodge, then the kit's own `readActions` (jump, J tapped, and any press its states take over), then the warp, guard, ability, switch and ultimate.
A kit that needs a press first (Hulda's throw while she holds a foe) takes it in its own `readActions`, and the shared reader never sees it.

## Tap and long press

J and I tell a tap from a long press in `src/game/input.ts`.
The key going down queues nothing.
Let go within `HOLD_STEPS` (30 simulation steps, 0.25 seconds) and the tap is queued (`attack`, `cast`).
Hold on to `HOLD_STEPS` and the long press is queued at once (`warp`, `castWide`), with no tap after it.
So a long press never also plays the tap's move, and a tap costs only as long as the finger stays on the key.
`holdShare("attack")` says how far a held J is toward the warp, for any look that wants to show it.

## The warp move

Every hero's warp is the same move in numbers.
The throw, the flight speed, the reach (`WARP.reach`), the cost (`COST.warp`, 10 MP), the recharge (`WARP.cooldown`, 2 seconds), the moment nothing can touch the hero, and the arrival blow's power (`WARP.power` plus a bonus for distance travelled) are shared.
A kit's `WarpStyle` gives it its look and one small extra:

- `drawThrown`: the weapon in flight.
- `strike`: the arrival blow, when the hero's weapon strikes differently (a ranged hero's shot). It deals the `power` it is given, no more.
- `arrived`: a small extra after the blow (a grab, a Wick, a Boom). The blow carries the power; the extra is flavour and utility.
- `tune`: the numbers the hero's warp skill changes, read on every warp.
- `stat: "ap"`: the warp grows with ability power, for a hero whose damage comes mostly from it, so every warp hits about as hard.
- `ranged`: the throw goes away from the nearest foe, the hero lands at a safe distance and strikes that foe from there.

The arrival blow may be cut by a guard, a dodge or an ability once it has struck (`WARP.cut`).

## Guard and parry

Holding K keeps the guard up.
It blocks blows from the front for stamina (`GuardStyle.blockCost`) and lets a share of the damage through (`GuardStyle.chip`).
Out of stamina, the guard breaks and the blow lands.
A blow from behind always lands.
A blow that meets the guard within `HERO_GUARD.parryWindow` (0.15 seconds) of the press is a parry: nothing is taken, a minion attacker reels, the world slows a beat, MP and stamina come back, Flow rises, the `parry` skill event fires, and then the hero's own `GuardStyle.parried` reward fires.
K still held when the hero becomes able again raises the guard with no parry window, so a parry always needs a fresh press.
Guards differ by hero: how much they let through, what a block costs, and above all what a parry gives.

## Abilities on I

A kit lists its abilities in `HeroKit.abilities` (`AbilitySlot` in `src/types/moveset.ts`): its base abilities and the spell skills it holds, in the order O turns through them.
Each ability has its own recharge, and casting one adds no wait to any other.
I casts the selected one; when it is recharging or cannot be paid for, I casts the next ready one in order and selects it.
`cast(wide)` returns false when the hero cannot cast right now, which keeps the press waiting a moment.
The HUD's ability tabs (`src/ui/abilityTabs.ts`) and the touch I button read the same list, so every hero's tabs look and behave alike.

## The ultimate

Every hero keeps the ultimate they start with (`CharacterDef.special`) for the whole run.
Ultimate skills that replaced it are gone.
Each hero has one ultimate skill (`kind: "ultimate"`), named for their ultimate, that upgrades it level by level; `ultimateValues()` in `src/game/hero/ultimate.ts` reads it.

## Balance targets

- Warp: the same numbers for every hero. A kit's extra is worth at most about a fifth of the arrival blow.
- Guard: a block lets through 0 to 50 percent and costs 8 to 25 stamina; the trade sits in the parry reward. A strong parry reward pairs with a weak block, and the other way round.
- Dodge: the same for every hero.
- Abilities: as before, now without a shared wait.

## The final foe

The Unblinking now takes every hit, shows the damage, and has HP no run can wear down (`ENEMIES.unblinking.hp`).
Its lances, tears and gaze hit far harder than anything else in the stage (`ABYSS_HITS`).
How it is beaten stays in the code only (see `agent-studio/charter.md`, Secrets).
