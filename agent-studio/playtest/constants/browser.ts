/** the Chromium build Playwright installed, under the user's home folder; PLAYTEST_CHROMIUM overrides it */
export const CHROMIUM_IN_HOME =
  "Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";
export const CHROMIUM_ENV = "PLAYTEST_CHROMIUM";
/** the stage scales by whole numbers: 1280 x 720 holds it at exactly 4 device pixels per art pixel */
export const DEFAULT_VIEWPORT = { width: 1280, height: 720 } as const;
/** tsx compiles with esbuild's keepNames, which wraps functions sent to the page in __name(); the page needs a stand-in */
export const NAME_SHIM = "globalThis.__name = (fn) => fn;";
/**
 * The fake clock starts each page a millisecond or two apart, and the game keeps the first performance.now() it reads,
 * so its 120 Hz steps would fall at different points between frames from one session to the next. Rounding
 * performance.now() down to the 16 ms frame grid makes the steps fall the same way every time.
 */
export const FRAME_GRID_SHIM = `{
  const perf = globalThis.performance;
  const raw = perf.now.bind(perf);
  globalThis.__playtestRawNow = raw;
  perf.now = () => Math.floor(raw() / 16) * 16;
}`;
