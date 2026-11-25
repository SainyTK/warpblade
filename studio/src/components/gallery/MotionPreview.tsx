import { RES } from '@game/constants/stage';
import type { HeroSkin } from '@game/types/character';
import { useRef } from 'react';
import { THUMB } from '@/constants/stage';
import { usePreview } from '@/hooks/usePreview';
import { useTick } from '@/hooks/useTick';
import type { ClipFrames } from '@/types/studio';

const WIDTH = THUMB.w * RES;
const HEIGHT = THUMB.h * RES;

/** A clip playing on a loop at the speed the game plays it. */
export function MotionPreview({
  skin,
  clip,
  fps,
}: {
  skin: HeroSkin;
  clip: ClipFrames;
  fps: number;
}) {
  const pictures = usePreview(skin, clip);
  const canvas = useRef<HTMLCanvasElement>(null);
  const shown = useRef(-1);
  useTick((seconds) => {
    const context = canvas.current?.getContext('2d');
    if (!context || !pictures?.length) {
      return;
    }
    const index = Math.floor(seconds * fps) % pictures.length;
    const picture = pictures[index];
    if (picture && index !== shown.current) {
      shown.current = index;
      context.drawImage(picture, 0, 0);
    }
  });
  return (
    <canvas
      ref={canvas}
      width={WIDTH}
      height={HEIGHT}
      className="w-full rounded-sm bg-stage [image-rendering:pixelated]"
      style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
    />
  );
}
