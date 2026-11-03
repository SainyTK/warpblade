// The first prompt a job's agent gets: the owner's instruction, the sketch's files and how to work.
import type { JobRequest } from '../../shared/api';

export interface BriefInput {
  request: JobRequest;
  cwd: string;
  branch: string | null;
  target: JobRequest['target'];
  exportsDir: string;
  /** Exported files the agent can read, by name. */
  files: string[];
  clip: string | null;
  hitFrame: number | null;
}

const FILE_NOTES: Record<string, string> = {
  'motion-keys.png':
    'every snapshot the owner took, in timeline order, labelled with its frame number (30 frames a second). Kael faces right with his feet on the ground line, drawn 4 times larger than in the game.',
  'motion-frames.png':
    'every animation frame of the motion as the game samples it, frame 0 first, so you can check the in-betweens.',
  'effect-cels.png':
    'each drawn effect frame over a faint Kael in his pose at that frame, labelled with its frame and hold, at 4 times the game scale.',
  'effect.json': `the effect frames as pixel rows: \`x\` and \`y\` are the top-left of the rows in art pixels from where Kael's feet stand at the start of the motion (he faces right, negative y is up), "." is empty and \`colors\` maps each row character to a color.`,
  'motion-clip.ts': "the motion in the game's clip format (see src/constants/clips).",
  'sketch.json': 'the full sketch as the studio saved it.',
};

function fileLines(input: BriefInput): string[] {
  return input.files.map((name) => {
    const note = FILE_NOTES[name] ?? 'an image the studio rendered from the sketch.';
    return `- \`${input.exportsDir}/${name}\`: ${note}`;
  });
}

function workLines(input: BriefInput): string[] {
  const { include } = input.request;
  const lines = [
    "Read the repository's CLAUDE.md and README before you change code, and follow its structure and code style.",
  ];
  if (include.motion) {
    lines.push(
      "The motion is a set of exact rig poses for Kael (`Pose` in src/types/pose.ts). Use the keyframes as they are, with the same frames and snaps, unless the instruction asks for changes. A `feet at` comment is where Kael's feet are at that key, in art pixels from where the move starts (x forward, negative y up): carry that travel with the game's move data (strides, step, lift); the pose stays relative to the feet. Wire the clip to the move or state the instruction names: moves and actions play clips from src/constants/clips, and the free and held states (idle, walk, run, jump, fall, dash, hurt, dead, hang, charge, ultimate, throwWait) play theirs from src/constants/clips/locomotion.ts and held.ts. When it names none, add it where it fits the existing moves and say how to trigger it.",
    );
  }
  if (include.effect) {
    lines.push(
      "The drawn effect is a pixel reference at the game scale: one art pixel is one game pixel, the origin is where Kael's feet stand at the start of the motion and he faces right. Build it in code the way the game's other effects are built (src/game/effects, src/engine/frame.ts, the ramps in src/constants/palette.ts) so it flips with Kael and follows his position. Match its shape, colors and frame timing. Fall back to pixel rows only for detail that code cannot express.",
    );
  }
  lines.push(
    'Check your work in the running game with a headless browser: trigger it, capture the frames and compare them with the studio images. Fix what does not match before you report.',
    'Run `npm run typecheck` and `npm run lint` and keep both passing.',
  );
  lines.push(
    input.target === 'worktree'
      ? `Commit your work on branch \`${input.branch}\` when it is done. Do not merge or push.`
      : 'Do not commit; the owner reviews the changes in this checkout.',
  );
  lines.push(
    'End with a short reply: what you changed, how to trigger it in the game, and anything that does not match the sketch.',
  );
  return lines.map((line) => `- ${line}`);
}

export function buildBrief(input: BriefInput): string {
  const { request } = input;
  const parts: string[] = [
    `The owner sketched this in Warpblade Studio ("${request.sketch.name}") and wants you to build it in the game.`,
    '',
    `Working folder: \`${input.cwd}\`${input.branch ? ` on branch \`${input.branch}\`` : ''}.`,
    '',
    '## Instruction',
    '',
    request.instruction.trim(),
    '',
    '## Sketch files',
    '',
    ...fileLines(input),
  ];
  if (input.clip) {
    parts.push(
      '',
      '## Motion as a clip',
      '',
      `Keyframes at 30 frames a second. ${input.hitFrame === null ? 'The owner marked no hit frame.' : `The owner marked frame ${input.hitFrame} as the hit.`}`,
      '',
      '```ts',
      input.clip,
      '```',
    );
  }
  parts.push('', '## How to work', '', ...workLines(input));
  return parts.join('\n');
}
