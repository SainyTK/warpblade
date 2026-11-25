import { useEffect } from 'react';
import { SAVE_DELAY_MS } from '@/constants/stage';
import { saveDraft } from '@/services/draftApi';
import { useMotionStore } from '@/store/motionStore';

/** Saves the open clip's draft shortly after each change, and at once when another clip is opened. */
export function useAutosave(): void {
  const motion = useMotionStore((state) => state.motion);
  const revision = useMotionStore((state) => state.revision);
  const setSaveStatus = useMotionStore((state) => state.setSaveStatus);
  const sending = useMotionStore((state) => state.sending);
  useEffect(() => {
    if (revision === 0) {
      return;
    }
    let saved = false;
    const save = () => {
      const draft = useMotionStore.getState().drafts[motion];
      if (saved || !draft) {
        return;
      }
      saved = true;
      setSaveStatus('saving');
      sending(motion, draft);
      saveDraft(motion, draft)
        .then(() => setSaveStatus('saved'))
        .catch(() => setSaveStatus('failed'));
    };
    const timer = setTimeout(save, SAVE_DELAY_MS);
    return () => {
      clearTimeout(timer);
      if (useMotionStore.getState().motion !== motion) {
        save();
      }
    };
  }, [motion, revision, setSaveStatus, sending]);
}
