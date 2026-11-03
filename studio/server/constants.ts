/** Request bodies: a new job carries the sketch and its rendered PNGs. */
export const JSON_BODY_LIMIT = 24 * 1024 * 1024;
export const MAX_INSTRUCTION_LENGTH = 20_000;
export const MAX_EXPORT_IMAGES = 24;

/** An agent process with no turn running closes after this long. The next message resumes the session. */
export const RUN_IDLE_MS = 15 * 60 * 1000;
/** After Stop, the process gets this long to end the turn before it is closed. */
export const STOP_GRACE_MS = 4000;
export const MAX_ACTIVE_RUNS = 4;
/** Events kept per job so a reloaded page can catch up. */
export const JOB_EVENT_BUFFER = 4000;

export const MODEL_CACHE_MS = 60_000;
export const PROXY_TIMEOUT_MS = 5000;
export const SSE_HEARTBEAT_MS = 15_000;
/** How long a job's game preview may take to print its URL. */
export const PREVIEW_START_MS = 60_000;

/** Proxy model IDs that are not chat models Claude Code can drive. */
export const NON_CHAT_MODEL = /^(gpt-image|codex-auto-review|dall-e|text-embedding|whisper|tts)/;

/** Environment the agent process inherits from the server. Everything else is left out. */
export const INHERITED_ENV = [
  'PATH',
  'HOME',
  'USER',
  'LOGNAME',
  'SHELL',
  'LANG',
  'LC_ALL',
  'TMPDIR',
  'TERM',
];

/** Told to every studio agent, so it knows how its replies are shown. */
export const STUDIO_SYSTEM_PROMPT = [
  'You are working for the owner through Warpblade Studio, a local page that shows your replies as Markdown next to the sketch they made.',
  'Images you read or capture show as thumbnails in the page.',
  'The owner reads your final reply to decide what to look at, so end each turn with what changed and how to see it in the game.',
].join(' ');

/** Images a tool result may carry, by media type, with the file extension the media route serves. */
export const IMAGE_TYPES: Readonly<Record<string, string>> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/gif': 'gif',
  'image/webp': 'webp',
};
