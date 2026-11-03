// The sketch's motion as TypeScript in the game's clip format (src/constants/clips), ready to paste.
import { STAND } from '../../../src/constants/hero';
import { POSE_KEYS, type Pose } from '../../../src/types/pose';
import type { MotionKey } from '../sketch';

/** Joint values to one decimal and the sword angle to two, as the game's clips write them. */
function rounded(key: string, value: number): number {
  const places = key === 'sa' ? 100 : 10;
  return Math.round(value * places) / places;
}

const frameTime = (frame: number): string => (frame === 0 ? '0' : `frame(${frame})`);

/** `pose({...})` with only the joints that differ from the standing pose. */
export function poseSource(pose: Pose): string {
  const parts = POSE_KEYS.flatMap((key) => {
    const value = rounded(key, pose[key]);
    return value === rounded(key, STAND[key]) ? [] : [`${key}: ${value}`];
  });
  return `pose({ ${parts.join(', ')} })`;
}

export function clipSource(keys: readonly MotionKey[], hitFrame: number | null): string {
  const sorted = [...keys].sort((a, b) => a.frame - b.frame);
  const last = sorted.at(-1)?.frame ?? 0;
  const lines = sorted.map((key) => {
    const snap = key.snap ? ', "snap"' : '';
    const travel =
      key.root.x || key.root.y
        ? ` // feet at x ${rounded('x', key.root.x)}, y ${rounded('y', key.root.y)}`
        : '';
    return `    [${frameTime(key.frame)}, ${poseSource(key.pose)}${snap}],${travel}`;
  });
  return [
    '{',
    `  dur: ${frameTime(last)},`,
    `  hit: ${frameTime(hitFrame ?? 0)},`,
    '  keys: [',
    ...lines,
    '  ],',
    '}',
  ].join('\n');
}
