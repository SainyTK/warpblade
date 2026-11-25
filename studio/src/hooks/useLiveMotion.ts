import { parseClip } from '@game/motionClips';
import { motionId, parseMotionId } from '@shared/motionId';
import { useEffect } from 'react';
import { HERO_MOTION } from '@/constants/heroMotion';
import { onClipChange } from '@/services/liveMotion';
import { useMotionStore } from '@/store/motionStore';

/** Takes clips and drafts changed on disk, by an agent or another studio tab, without reloading the page. */
export function useLiveMotion(): void {
  const receive = useMotionStore((state) => state.receive);
  useEffect(
    () =>
      onClipChange((source, { hero, clip, data }) => {
        const ref = parseMotionId(`${hero}/${clip}`);
        const id = ref && motionId(ref.hero, ref.clip);
        if (!id || !HERO_MOTION.has(id)) {
          return;
        }
        try {
          receive(source, id, parseClip(id, data));
        } catch (problem) {
          console.warn(problem);
        }
      }),
    [receive],
  );
}
