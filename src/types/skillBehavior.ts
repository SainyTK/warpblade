import type { HeroSource, SourceId } from "./build";
import type { Enemy } from "./enemy";
import type { MoveId } from "./move";

/**
 * Everything the hero did or took that a skill can answer, by event name, with each event's payload. Design:
 * docs/skill-design.md. The shared loop emits these; a kit adds its own events (a grab, a throw) by augmenting this
 * interface from its own types file, without editing this one:
 *
 *   declare module "../skillBehavior" { interface SkillEvents { grab: { foe: Enemy } } }
 */
export interface SkillEvents {
  /** one of the hero's own hits landed (not a damage over time tick): from J, an ability or the ultimate */
  blow: {
    foe: Enemy;
    /** damage dealt, after every multiplier */
    damage: number;
    source: HeroSource;
    /** the combo move the blow belongs to; null outside a move (a bolt in flight, a spell, the ultimate) */
    move: MoveId | null;
    /** the last blow of the ground string (`chain` has reached `comboHits`) */
    finisher: boolean;
    /** a sword, glaive, kick or fist blow, as opposed to a bolt or a spell */
    melee: boolean;
    back: boolean;
    crit: boolean;
    airborne: boolean;
    /** a Keen press: a sure crit */
    keen: boolean;
  };
  /** an ability went off; `ability` is the kit's own id for it (Kael's element, Ysra's rite, `snare`, `bellow`) */
  cast: { ability: string };
  /** a dash ended, with the foes the hero passed through on the way */
  dash: { dir: number; foes: readonly Enemy[] };
  /** the hero arrived somewhere by a warp or blink, beside `foe` when it was aimed at one */
  warp: { x: number; y: number; foe: Enemy | null };
  jump: { air: boolean };
  /** any kit's perfect dodge, through `rewardPerfectDodge`, at the hero's x */
  perfectDodge: { at: number };
  /** the shared guard's parry, for every hero */
  parry: { fromX: number };
  /** the shared guard stopped a blow from the front, outside the parry window */
  block: { fromX: number };
  kill: { foe: Enemy; source: SourceId };
  hurt: { damage: number; fromX: number };
  ultimate: { level: number };
}

export type SkillEventType = keyof SkillEvents;
/** one event with its name */
export type SkillEventOf<K extends SkillEventType> = { type: K } & SkillEvents[K];
export type SkillEvent = { [K in SkillEventType]: SkillEventOf<K> }[SkillEventType];

/** what a skill remembers between steps: timers, angles, its live projectiles and summons */
export type SkillMemory = Record<string, unknown>;

/** the skill's level (1 to 8) and whether it is evolved, passed to every call */
export interface SkillState {
  level: number;
  evolved: boolean;
}

/** one answer to an event */
export type SkillListener<K extends SkillEventType> = (
  memory: SkillMemory,
  event: SkillEventOf<K>,
  state: SkillState,
) => void;

/**
 * Code for a skill that acts on its own or answers events. Called once per hero who holds it, with that hero swapped
 * in (`hero`, `progress` and `character` are theirs). Registered in `src/game/skills/<hero>/index.ts`.
 */
export interface SkillBehavior {
  /** memory for a hero who has just taken the skill */
  create(): SkillMemory;
  /** every step of play while the hero stands */
  update?(memory: SkillMemory, state: SkillState, dt: number): void;
  /** drawn in front of the hero */
  draw?(memory: SkillMemory, state: SkillState): void;
  /** drawn behind the hero and foes */
  drawBack?(memory: SkillMemory, state: SkillState): void;
  /** answers to events, by event type */
  on?: { [K in SkillEventType]?: SkillListener<K> };
}
