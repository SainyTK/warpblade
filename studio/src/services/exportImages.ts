// Renders the sketch into the PNG contact sheets an agent reads, with the browser's canvas.
import type { ExportImage } from '@shared/api';
import type { Sketch } from '@shared/sketch';
import { EXPORT_SCALE } from '@/constants/stage';
import type { Raster } from '@/types/studio';
import { type Box, contentBox } from '@/utils/crop';
import { byFrame, lastCelFrame, lastKeyFrame } from '@/utils/frames';
import { motionFrames } from '@/utils/motionFrames';
import { rgba } from '@/utils/raster';
import { type StageLayers, stageRaster } from '@/utils/stageRaster';

const LABEL_HEIGHT = 22;
const GAP = 8;
const COLUMNS = 6;
const CROP_PAD = 6;
const FRAME_SHEET_SCALE = 3;
/** Cells show the backdrop and ground line, so a lift off the ground reads. */
const CELL: Partial<StageLayers> = { background: true };
const BASE: StageLayers = {
  hero: null,
  heroAlpha: 1,
  onions: [],
  pixels: null,
  pixelOnions: [],
  grid: false,
  background: false,
};

interface Cell {
  raster: Raster;
  label: string;
}

/** Cells in a grid, each cropped to `box`, drawn `scale` times larger, with a label above. */
function sheet(cells: readonly Cell[], box: Box, scale: number): string {
  const columns = Math.min(COLUMNS, cells.length);
  const rows = Math.ceil(cells.length / columns);
  const cellW = box.w * scale;
  const cellH = box.h * scale + LABEL_HEIGHT;
  const canvas = document.createElement('canvas');
  canvas.width = columns * cellW + (columns + 1) * GAP;
  canvas.height = rows * cellH + (rows + 1) * GAP;
  const context = canvas.getContext('2d');
  if (!context) {
    throw new Error('The browser cannot draw the export.');
  }
  context.fillStyle = '#05040a';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = false;
  context.font = '14px "IBM Plex Mono", monospace';
  context.textBaseline = 'middle';
  cells.forEach((cell, index) => {
    const x = GAP + (index % columns) * (cellW + GAP);
    const y = GAP + Math.floor(index / columns) * (cellH + GAP);
    context.fillStyle = '#e6e4f0';
    context.fillText(cell.label, x + 2, y + LABEL_HEIGHT / 2);
    const full = document.createElement('canvas');
    full.width = cell.raster.w;
    full.height = cell.raster.h;
    full.getContext('2d')?.putImageData(new ImageData(rgba(cell.raster), cell.raster.w), 0, 0);
    context.drawImage(full, box.x, box.y, box.w, box.h, x, y + LABEL_HEIGHT, cellW, box.h * scale);
  });
  return canvas.toDataURL('image/png');
}

function keyLabel(frame: number, snap: boolean, hit: boolean): string {
  return [`frame ${frame}`, snap ? 'snap' : '', hit ? 'HIT' : ''].filter(Boolean).join('  ');
}

function motionImages(sketch: Sketch): ExportImage[] {
  const keys = byFrame(sketch.motion.keys);
  if (!keys.length) {
    return [];
  }
  const { hitFrame } = sketch.motion;
  const frames = motionFrames(keys, lastKeyFrame(keys));
  const box = contentBox(
    frames.map((hero) => stageRaster({ ...BASE, hero })),
    CROP_PAD,
  );
  const frameCells = frames.map((hero, frame) => ({
    raster: stageRaster({ ...BASE, ...CELL, hero }),
    label: keyLabel(frame, false, frame === hitFrame),
  }));
  const keyCells = keys.map((key) => ({
    raster: frameCells[key.frame]?.raster ?? stageRaster(BASE),
    label: keyLabel(key.frame, key.snap, key.frame === hitFrame),
  }));
  return [
    { name: 'motion-keys.png', dataUrl: sheet(keyCells, box, EXPORT_SCALE) },
    { name: 'motion-frames.png', dataUrl: sheet(frameCells, box, FRAME_SHEET_SCALE) },
  ];
}

function effectImages(sketch: Sketch): ExportImage[] {
  const cels = byFrame(sketch.effect.cels);
  if (!cels.length) {
    return [];
  }
  const keys = sketch.motion.keys;
  const frames = keys.length
    ? motionFrames(keys, Math.max(lastKeyFrame(keys), lastCelFrame(cels)))
    : [];
  const layers = cels.map((cel) => ({
    ...BASE,
    hero: frames[cel.frame] ?? frames.at(-1) ?? null,
    heroAlpha: 0.35,
    pixels: cel.pixels,
  }));
  const box = contentBox(
    layers.map((layer) => stageRaster(layer)),
    CROP_PAD,
  );
  const cells = cels.map((cel, index) => ({
    raster: stageRaster({ ...(layers[index] ?? BASE), ...CELL }),
    label: `frame ${cel.frame}  hold ${cel.hold}`,
  }));
  return [{ name: 'effect-cels.png', dataUrl: sheet(cells, box, EXPORT_SCALE) }];
}

/** The PNGs for a job: the motion's snapshots and frames, and the effect's frames, as asked. */
export function exportImages(
  sketch: Sketch,
  include: { motion: boolean; effect: boolean },
): ExportImage[] {
  return [
    ...(include.motion ? motionImages(sketch) : []),
    ...(include.effect ? effectImages(sketch) : []),
  ];
}
