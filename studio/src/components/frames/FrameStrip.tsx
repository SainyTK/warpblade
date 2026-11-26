import { useMotionStore } from '@/store/motionStore';
import { FrameCard } from './FrameCard';

/** Every frame of the open clip in order. */
export function FrameStrip() {
  const frames = useMotionStore((state) => state.current.frames);
  return (
    <div className="flex gap-2 overflow-x-auto px-3 pb-3">
      {frames.map((pose, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: a frame is its position in the clip.
        <FrameCard key={index} index={index} pose={pose} />
      ))}
    </div>
  );
}
