/** modules the dev server serves; importing them in the page gives the instances the game itself uses */
export const GAME_MODULES = {
  state: "/src/game/state.ts",
  menuState: "/src/ui/menu/menuState.ts",
  runEnd: "/src/game/runEnd.ts",
  characters: "/src/constants/characters/index.ts",
} as const;
export const SELECTORS = {
  stage: "#stage",
  hud: "#stage .hud",
  boss: "#boss",
  menu: "#menu",
  pickDialog: "dialog.level-up",
  pickCard: "dialog.level-up .pick",
  hudTab: ".hud .elements .el",
  ultRow: ".hud .ult",
  ultPip: "#ultPips i.on",
  waveText: "#wave",
  levelText: "#level",
  hpFill: "#hpFill",
} as const;
/** pages other agents may add next to the game; the smoke test loads each one that exists */
export const EXTRA_PAGES = ["/patches/", "/feedback/"] as const;
/** fake clock start, so every session begins at the same time */
export const CLOCK_START_MS = 1_800_000_000_000;
/** one display frame of the fake clock */
export const FRAME_MS = 16;
