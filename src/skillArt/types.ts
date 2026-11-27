export interface SkillArtSheet {
  size: number;
  columns: number;
  icons: readonly string[];
}

export interface SpriteSheet {
  sprites: Readonly<Record<string, readonly number[]>>;
}

export interface ArtSprite {
  w: number;
  h: number;
  colors: Uint32Array;
}
