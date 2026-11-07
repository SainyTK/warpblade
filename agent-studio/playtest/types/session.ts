import type { Page } from "playwright-core";
import type { GameSnapshot, HeroInfo } from "./snapshot";

export interface Viewport {
  width: number;
  height: number;
}
/** begin the run at a later wave with the hero already levelled (dev server only; the game reads ?wave= and ?level=) */
export interface RunStart {
  wave: number;
  level: number;
  /** skills, charms and evolutions held from the start, as the game's `?build=` reads them: `k_familiar:8,evolve:a_flame,might:5` */
  build?: string;
}
export interface OpenGameOptions {
  /** the game repository to serve; defaults to the repository the harness lives in */
  root?: string;
  /** start a run with this hero through the menu; leave out to stay on the start menu */
  hero?: string;
  viewport?: Viewport;
  start?: RunStart;
}
export interface SessionOptions {
  hero?: string;
  viewport?: Viewport;
  start?: RunStart;
}
export interface StillResult {
  path: string;
  width: number;
  height: number;
}
export interface RecordOptions {
  /** output width in pixels, scaled nearest-neighbour; 640 by default */
  width?: number;
}
export interface RecordResult {
  mp4: string;
  gif: string;
  poster: string;
  width: number;
  height: number;
  seconds: number;
  bytes: { mp4: number; gif: number; poster: number };
}
/** A browser page with the game in it, where time only passes when the session says so. */
export interface Session {
  page: Page;
  heroes(): Promise<HeroInfo[]>;
  state(): Promise<GameSnapshot>;
  /** let this much game time pass */
  advance(ms: number): Promise<void>;
  /** game time this session has let pass */
  elapsedMs(): number;
  keyDown(key: string): Promise<void>;
  keyUp(key: string): Promise<void>;
  /** hold a key for this long, then let go */
  press(key: string, ms?: number): Promise<void>;
  hold(keys: readonly string[], ms: number): Promise<void>;
  /** a quick press: down, one frame, up */
  tap(key: string): Promise<void>;
  waitFor(predicate: (state: GameSnapshot) => boolean, timeoutMs: number, label?: string): Promise<GameSnapshot>;
  /** from any menu or mid-run, through the real menu: Start, then the hero's card */
  startRun(heroId: string): Promise<void>;
  /** answer the open skill pick with the card at this index, through the real dialog keys */
  choosePick(index: number): Promise<void>;
  /** play on with the skilled bot until this wave starts; throws if the hero falls first */
  jumpToWave(wave: number): Promise<GameSnapshot>;
  evaluate: Page["evaluate"];
  still(path: string): Promise<StillResult>;
  /** record the stage while play runs, then write base.mp4, base.gif and base.png */
  record(basePath: string, play: () => Promise<void>, options?: RecordOptions): Promise<RecordResult>;
  /** page errors and console errors seen so far */
  errors(): string[];
  close(): Promise<void>;
}
