/** The few fields the harness reads from the game's own modules, as the dev server serves them. */
interface EnemyFields {
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
export interface StateModule {
  game: {
    mode: string;
    wave: number;
    lull: string;
    kills: number;
    coins: number;
    enemies: EnemyFields[];
  };
  hero: {
    x: number;
    y: number;
    hp: number;
    mp: number;
    stamina: number;
    state: string;
    face: number;
    ground: boolean;
  };
  progress: {
    level: number;
    picks: number;
    ultimate: string | null;
    stats: { hp: number; mp: number };
  };
  character: { id: string };
}
export interface MenuStateModule {
  menuContext(): string | null;
  menuScreen(): string;
}
export interface RunEndModule {
  lastRun(): { outcome: string; wave: number; coins: number };
}
export interface CharactersModule {
  CHARACTERS: readonly { id: string; name: string }[];
}
