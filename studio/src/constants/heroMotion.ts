import { clipSpans, drillMotion } from '@game/drill';
import { heroModule } from '@game/heroes';
import { HERO_CLIPS } from '@game/heroes/motion';
import { CHARACTERS, type HeroId } from '@game/heroes/roster';
import { clipEntries, type DrillClipId } from '@game/motionClips';
import type { HeroSkin } from '@game/types/character';
import type { DrillProfile, DrillStrikeId, PoseClip } from '@game/types/drill';
import { type MotionId, motionId } from '@shared/motionId';

export interface HeroMotion {
  id: MotionId;
  hero: HeroId;
  clip: DrillClipId;
  label: string;
  /** Seconds into the clip the blow lands or the ultimate strikes, or null. */
  hit: number | null;
  /** How long the clip lasts in the game when it is spread over its state or a run stride, or null when it plays in time at 30 frames a second. */
  timing: ClipTiming | null;
}

export interface ClipTiming {
  seconds: number;
  /** True when the clip repeats over its span, as the run does over a stride. */
  loop: boolean;
}

export interface StudioHero {
  id: HeroId;
  name: string;
  skin: HeroSkin;
  groups: readonly { title: string; motions: readonly HeroMotion[] }[];
}

const LABELS: Readonly<Record<Exclude<DrillClipId, `tiers/${string}`>, string>> = {
  idle: 'Idle',
  run: 'Run',
  brake: 'Brake',
  land: 'Land',
  dash: 'Dash',
  jump: 'Jump',
  dashJump: 'Dash jump',
  airDash: 'Air dash',
  wall: 'Wall slide',
  kick: 'Wall kick',
  'strikes/first': 'Slash 1',
  'strikes/second': 'Slash 2',
  'strikes/third': 'Slash 3',
  'strikes/air': 'Air slash',
  guard: 'Guard',
  airGuard: 'Air guard',
  parry: 'Parry',
  stagger: 'Stagger',
  spell: 'Spell cast',
  warpThrow: 'Warp throw',
  warpFlight: 'Warp flight',
  warpArrival: 'Warp arrival',
};

const GROUPS: readonly { title: string; clips: readonly DrillClipId[] }[] = [
  { title: 'Ground', clips: ['idle', 'run', 'brake', 'land', 'dash'] },
  { title: 'Air', clips: ['jump', 'dashJump', 'airDash', 'wall', 'kick'] },
  {
    title: 'Sword string',
    clips: ['strikes/first', 'strikes/second', 'strikes/third', 'strikes/air'],
  },
  { title: 'Guard', clips: ['guard', 'airGuard', 'parry', 'stagger'] },
  { title: 'Spell and warp', clips: ['spell', 'warpThrow', 'warpFlight', 'warpArrival'] },
  { title: 'Ultimate', clips: ['tiers/1', 'tiers/2', 'tiers/3', 'tiers/4'] },
];

function drillOf(hero: HeroId): DrillProfile {
  const drill = heroModule(hero).drill;
  if (!drill) {
    throw new Error(`${hero} has no drill profile`);
  }
  return drill;
}

function motion(
  hero: HeroId,
  drill: DrillProfile,
  spans: Partial<Record<DrillClipId, ClipTiming>>,
  clip: DrillClipId,
): HeroMotion {
  const [group, name] = clip.split('/');
  const tier = group === 'tiers' ? drill.tiers[Number(name) - 1] : undefined;
  const strike = group === 'strikes' ? drill.strikes[name as DrillStrikeId] : undefined;
  return {
    id: motionId(hero, clip),
    hero,
    clip,
    label: tier?.name ?? LABELS[clip as keyof typeof LABELS],
    hit: strike?.hit ?? tier?.intro ?? null,
    timing: spans[clip] ?? null,
  };
}

/** Every hero, in the hero screen's order, with their motion clips in the groups the gallery shows. */
export const STUDIO_HEROES: readonly StudioHero[] = CHARACTERS.map((character) => {
  const hero = character.id as HeroId;
  const drill = drillOf(hero);
  const spans: Partial<Record<DrillClipId, ClipTiming>> = clipSpans(
    drillMotion(drill),
    drill.strikes,
  );
  return {
    id: hero,
    name: character.name,
    skin: character.skin,
    groups: GROUPS.map((group) => ({
      title: group.title,
      motions: group.clips.map((clip) => motion(hero, drill, spans, clip)),
    })),
  };
});

export const HEROES: ReadonlyMap<HeroId, StudioHero> = new Map(
  STUDIO_HEROES.map((hero) => [hero.id, hero]),
);

export function studioHero(id: HeroId): StudioHero {
  const hero = HEROES.get(id);
  if (!hero) {
    throw new Error(`The studio has no hero ${id}`);
  }
  return hero;
}

export const HERO_MOTION: ReadonlyMap<MotionId, HeroMotion> = new Map(
  STUDIO_HEROES.flatMap((hero) =>
    hero.groups.flatMap((group) => group.motions.map((entry) => [entry.id, entry] as const)),
  ),
);

/** Every hero's clips as the game loaded them when the studio opened. */
export const GAME_CLIPS = Object.fromEntries(
  STUDIO_HEROES.flatMap((hero) =>
    clipEntries(HERO_CLIPS[hero.id]).map(([clip, frames]) => [motionId(hero.id, clip), frames]),
  ),
) as Record<MotionId, PoseClip>;

export const FIRST_MOTION: MotionId = 'kael/strikes/first';
