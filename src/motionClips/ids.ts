import type { DrillClips, DrillStrikeId, PoseClip } from "../types/motionClip";

export const SINGLE_CLIPS = [
  "idle",
  "run",
  "brake",
  "jump",
  "dashJump",
  "land",
  "dash",
  "airDash",
  "kick",
  "wall",
  "guard",
  "airGuard",
  "stagger",
  "parry",
  "spell",
  "warpThrow",
  "warpFlight",
  "warpArrival",
] as const satisfies readonly Exclude<keyof DrillClips, "strikes" | "tiers">[];

const STRIKES = ["first", "second", "third", "air"] as const satisfies readonly DrillStrikeId[];
const TIERS = [1, 2, 3, 4] as const;

type SingleClip = (typeof SINGLE_CLIPS)[number];
export type DrillClipId = SingleClip | `strikes/${DrillStrikeId}` | `tiers/${(typeof TIERS)[number]}`;

export const DRILL_CLIP_IDS: readonly DrillClipId[] = [
  ...SINGLE_CLIPS,
  ...STRIKES.map((id) => `strikes/${id}` as const),
  ...TIERS.map((level) => `tiers/${level}` as const),
];

export function clipEntries(clips: DrillClips): [DrillClipId, PoseClip][] {
  return [
    ...SINGLE_CLIPS.map((id): [DrillClipId, PoseClip] => [id, clips[id]]),
    ...STRIKES.map((id): [DrillClipId, PoseClip] => [`strikes/${id}`, clips.strikes[id]]),
    ...TIERS.map((level): [DrillClipId, PoseClip] => [`tiers/${level}`, clips.tiers[level - 1] as PoseClip]),
  ];
}

export function clipsFromEntries(entries: Readonly<Partial<Record<string, PoseClip>>>, owner: string): DrillClips {
  const missing = DRILL_CLIP_IDS.filter((id) => !entries[id]);
  if (missing.length) {
    throw new Error(`${owner} has no motion clip for ${missing.join(", ")}`);
  }
  const unknown = Object.keys(entries).filter((id) => !(DRILL_CLIP_IDS as readonly string[]).includes(id));
  if (unknown.length) {
    throw new Error(`${owner} has motion clips no move plays: ${unknown.join(", ")}`);
  }
  const clip = (id: DrillClipId) => entries[id] as PoseClip;
  const singles = Object.fromEntries(SINGLE_CLIPS.map((id) => [id, clip(id)])) as Record<SingleClip, PoseClip>;
  return {
    ...singles,
    strikes: {
      first: clip("strikes/first"),
      second: clip("strikes/second"),
      third: clip("strikes/third"),
      air: clip("strikes/air"),
    },
    tiers: [clip("tiers/1"), clip("tiers/2"), clip("tiers/3"), clip("tiers/4")],
  };
}

function clipIn(clips: DrillClips, id: DrillClipId): PoseClip {
  const [group, name] = id.split("/");
  if (group === "strikes") {
    return clips.strikes[name as DrillStrikeId];
  }
  if (group === "tiers") {
    return clips.tiers[Number(name) - 1] as PoseClip;
  }
  return clips[id as SingleClip];
}

export function replaceClip(clips: DrillClips, id: DrillClipId, next: PoseClip): void {
  Object.assign(clipIn(clips, id), { frames: next.frames, snaps: next.snaps });
}

export const isDrillClipId = (id: string): id is DrillClipId => (DRILL_CLIP_IDS as readonly string[]).includes(id);
