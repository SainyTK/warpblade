import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { useMotionStore } from '@/store/motionStore';
import { setFrame } from '@/utils/clipEdits';

/** Keys typed into a field, or used inside an open list, menu or dialog, belong to that control. */
const ownKeys = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.closest('[role="listbox"], [role="menu"], [role="dialog"]') !== null);

/** Undo and redo, play, step frames, and copy and paste a pose. Keys typed into a field are left alone. */
export function useShortcuts(): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (ownKeys(event.target) || event.altKey) {
        return;
      }
      const editor = useEditorStore.getState();
      const motion = useMotionStore.getState();
      const command = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (command && (key === 'y' || (key === 'z' && event.shiftKey))) {
        event.preventDefault();
        motion.redo();
      } else if (command && key === 'z') {
        event.preventDefault();
        motion.undo();
      } else if (command && key === 'c' && !window.getSelection()?.toString()) {
        const pose = motion.current.frames[editor.frame];
        editor.set({ copied: pose ? { ...pose } : null });
      } else if (command && key === 'v' && editor.copied) {
        event.preventDefault();
        const pose = editor.copied;
        motion.change((clip) => setFrame(clip, editor.frame, { ...pose }));
      } else if (!command && event.key === ' ') {
        event.preventDefault();
        editor.togglePlay();
      } else if (!command && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
        event.preventDefault();
        const count = motion.current.frames.length;
        const step = event.key === 'ArrowRight' ? 1 : -1;
        editor.seek((editor.frame + step + count) % count);
      }
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, []);
}
