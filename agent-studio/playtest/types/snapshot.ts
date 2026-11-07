/** A plain copy of what the game shows at one moment, read from the page. */
export interface FoeSnapshot {
  type: string;
  rank: string;
  x: number;
  y: number;
  hp: number;
  state: string;
  face: number;
  stun: number;
  air: boolean;
}
export interface HeroSnapshot {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stamina: number;
  state: string;
  face: number;
  ground: boolean;
}
/** a HUD tab such as WARP or FIRE: shown once learned, ready when recharged */
export interface HudTab {
  id: string;
  label: string;
  visible: boolean;
  ready: boolean;
  selected: boolean;
}
export interface HudSnapshot {
  waveText: string;
  levelText: string;
  hpWidth: string;
  tabs: HudTab[];
  ultVisible: boolean;
  /** ultimate levels the MP bar pays for right now */
  ultPips: number;
}
export interface MenuSnapshot {
  /** "title", "pause" or null while playing */
  context: string | null;
  screen: string;
  title: string;
  /** the focused entry's text, its data-opens and its data-hero */
  focus: { text: string; opens: string; hero: string } | null;
}
export interface PickCard {
  index: number;
  kind: string;
  branch: string;
  name: string;
  /** the level the card reaches (a new skill or charm is 1); 0 for a boon */
  level: number;
  selected: boolean;
}
export interface RunResultSnapshot {
  outcome: string;
  wave: number;
  coins: number;
}
export interface GameSnapshot {
  mode: string;
  wave: number;
  lull: string;
  kills: number;
  coins: number;
  level: number;
  /** skill points waiting for a pick */
  picks: number;
  ultimate: string | null;
  hero: HeroSnapshot;
  enemies: FoeSnapshot[];
  hud: HudSnapshot;
  menu: MenuSnapshot;
  pick: PickCard[];
  lastRun: RunResultSnapshot;
}
export interface HeroInfo {
  id: string;
  name: string;
}
