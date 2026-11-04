/** Sites allowed to call the public routes from a browser. */
export const ALLOWED_ORIGINS: readonly string[] = [
  "https://warpblade.sainytk.com",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:4173",
  "http://127.0.0.1:4173",
];

export const GAME_VERSION_MAX = 20;
export const PUBLIC_LIST_LIMIT = 200;
export const STUDIO_DEFAULT_STATUSES = "new,planned";

/** Posts one player (IP hash) may make. */
export const POST_LIMITS = { perHour: 5, perDay: 20 } as const;

export const HOUR_MS = 60 * 60 * 1000;
export const DAY_MS = 24 * HOUR_MS;
