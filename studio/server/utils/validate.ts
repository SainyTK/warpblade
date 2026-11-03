// Checks request bodies before the server acts on them.
import type { DecisionRequest, JobRequest, TurnRequest } from '../../shared/api';
import { PERMISSION_MODES, type PermissionModeId } from '../../shared/permissionModes';
import type { Sketch } from '../../shared/sketch';
import { MAX_EXPORT_IMAGES, MAX_INSTRUCTION_LENGTH } from '../constants';
import { StudioError } from './errors';
import { ID_PATTERN } from './ids';

const EXPORT_NAME = /^[a-z0-9-]{1,60}\.png$/;
const PNG_DATA_URL = /^data:image\/png;base64,[A-Za-z0-9+/=]+$/;

type Body = Record<string, unknown>;

function object(value: unknown, what: string): Body {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new StudioError(400, `${what} is missing.`);
  }
  return value as Body;
}

function text(value: unknown, what: string, limit: number): string {
  if (typeof value !== 'string' || value.length > limit) {
    throw new StudioError(400, `${what} is not valid.`);
  }
  return value;
}

function mode(value: unknown): PermissionModeId {
  const found = PERMISSION_MODES.find((option) => option.id === value);
  if (!found) {
    throw new StudioError(400, 'Unknown permission mode.');
  }
  return found.id;
}

export function parseSketch(value: unknown): Sketch {
  const sketch = object(value, 'The sketch');
  const motion = object(sketch.motion, 'The motion');
  const effect = object(sketch.effect, 'The effect');
  if (
    typeof sketch.id !== 'string' ||
    !ID_PATTERN.test(sketch.id) ||
    !Array.isArray(motion.keys) ||
    !Array.isArray(effect.cels)
  ) {
    throw new StudioError(400, 'The sketch is not valid.');
  }
  text(sketch.name, 'The sketch name', 200);
  return value as Sketch;
}

export function parseJobRequest(value: unknown): JobRequest {
  const body = object(value, 'The request');
  const include = object(body.include, 'What to build');
  const instruction = text(body.instruction, 'The instruction', MAX_INSTRUCTION_LENGTH).trim();
  if (!instruction) {
    throw new StudioError(400, 'Write what the agent should build.');
  }
  if (!include.motion && !include.effect) {
    throw new StudioError(400, 'Send the motion, the effect or both.');
  }
  if (body.target !== 'worktree' && body.target !== 'checkout') {
    throw new StudioError(400, 'Unknown target.');
  }
  if (!Array.isArray(body.images) || body.images.length > MAX_EXPORT_IMAGES) {
    throw new StudioError(400, 'The images are not valid.');
  }
  const images = body.images.map((raw) => {
    const image = object(raw, 'An image');
    if (
      typeof image.name !== 'string' ||
      !EXPORT_NAME.test(image.name) ||
      typeof image.dataUrl !== 'string' ||
      !PNG_DATA_URL.test(image.dataUrl)
    ) {
      throw new StudioError(400, 'An image is not a PNG.');
    }
    return { name: image.name, dataUrl: image.dataUrl };
  });
  return {
    sketch: parseSketch(body.sketch),
    instruction,
    include: { motion: include.motion === true, effect: include.effect === true },
    model: text(body.model, 'The model', 200),
    permissionMode: mode(body.permissionMode),
    target: body.target,
    images,
  };
}

export function parseTurn(value: unknown): TurnRequest {
  const body = object(value, 'The message');
  const message = text(body.text, 'The message', MAX_INSTRUCTION_LENGTH).trim();
  if (!message) {
    throw new StudioError(400, 'Write a message.');
  }
  return {
    text: message,
    model: text(body.model, 'The model', 200),
    permissionMode: mode(body.permissionMode),
  };
}

export function parseMode(value: unknown): PermissionModeId {
  return mode(object(value, 'The mode').permissionMode);
}

export function parseDecision(value: unknown): DecisionRequest {
  const body = object(value, 'The decision');
  if (body.decision !== 'allow' && body.decision !== 'always' && body.decision !== 'deny') {
    throw new StudioError(400, 'Unknown decision.');
  }
  let answers: Record<string, string> | null = null;
  if (body.answers !== null && body.answers !== undefined) {
    const raw = object(body.answers, 'The answers');
    answers = Object.fromEntries(
      Object.entries(raw).map(([key, answer]) => [key, text(answer, 'An answer', 2000)]),
    );
  }
  return { decision: body.decision, answers };
}
