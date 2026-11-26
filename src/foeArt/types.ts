export interface FoeArtClip {
  frames: readonly number[];
  fps: number;
  loop: boolean;
}

export interface FoeArtSheet {
  imagePixelsPerArtPixel: number;
  frames: readonly (readonly [x: number, y: number, w: number, h: number, originX: number, originY: number])[];
  clips: Readonly<Record<string, FoeArtClip>>;
}
