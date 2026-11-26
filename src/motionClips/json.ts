import type { PoseClip } from "../types/motionClip";
import { POSE_KEYS, type Pose } from "../types/pose";

const DECIMALS = 2;

function readPose(source: string, index: number, value: unknown): Pose {
  if (typeof value !== "object" || value === null) {
    throw new Error(`${source}: frame ${index} is not an object`);
  }
  const fields = value as Record<string, unknown>;
  const pose = {} as Pose;
  for (const key of POSE_KEYS) {
    const field = fields[key];
    if (typeof field !== "number" || !Number.isFinite(field)) {
      throw new Error(`${source}: frame ${index} needs a number for "${key}"`);
    }
    pose[key] = field;
  }
  const unknown = Object.keys(fields).filter((key) => !(POSE_KEYS as readonly string[]).includes(key));
  if (unknown.length) {
    throw new Error(`${source}: frame ${index} has unknown keys ${unknown.join(", ")}`);
  }
  return pose;
}

function readSnaps(source: string, value: unknown, count: number): number[] {
  if (value === undefined) {
    return [];
  }
  if (!Array.isArray(value) || !value.every((index) => Number.isInteger(index) && index >= 0 && index < count)) {
    throw new Error(`${source}: "snaps" must list frame numbers from 0 to ${count - 1}`);
  }
  return [...new Set(value as number[])].sort((a, b) => a - b);
}

export function parseClip(source: string, data: unknown): PoseClip {
  const { frames, snaps } = (data ?? {}) as { frames?: unknown; snaps?: unknown };
  if (!Array.isArray(frames) || frames.length === 0) {
    throw new Error(`${source}: "frames" must be a list of at least one pose`);
  }
  return {
    frames: frames.map((frame, index) => readPose(source, index, frame)),
    snaps: readSnaps(source, snaps, frames.length),
  };
}

function number(value: number): string {
  const rounded = Number(value.toFixed(DECIMALS));
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

export function formatClip({ frames, snaps }: PoseClip): string {
  const lines = frames.map((pose) => `    { ${POSE_KEYS.map((key) => `"${key}": ${number(pose[key])}`).join(", ")} }`);
  const snapLine = snaps.length ? `  "snaps": [${snaps.join(", ")}],\n` : "";
  return `{\n${snapLine}  "frames": [\n${lines.join(",\n")}\n  ]\n}\n`;
}
