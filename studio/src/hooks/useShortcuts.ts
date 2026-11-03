import { useEffect } from 'react';
import { PAINT_TOOLS } from '@/constants/paintTools';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { byFrame } from '@/utils/frames';
import { usePoseEditor } from './usePoseEditor';

/** Keys typed into a field, or used inside an open list, menu or dialog, belong to that control. */
const ownKeys = (target: EventTarget | null): boolean =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
    target.closest('[role="listbox"], [role="menu"], [role="dialog"]') !== null);

/** Keyboard control of the editor; keys typed into a field are left alone. */
export function useShortcuts(): void {
  const { takeSnapshot } = usePoseEditor();
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (ownKeys(event.target) || event.altKey) {
        return;
      }
      const editor = useEditorStore.getState();
      const sketch = useSketchStore.getState();
      const command = event.metaKey || event.ctrlKey;
      const key = event.key.toLowerCase();
      if (command && key === 'z') {
        event.preventDefault();
        if (event.shiftKey) {
          sketch.redo();
        } else {
          sketch.undo();
        }
        return;
      }
      if (command && key === 'y') {
        event.preventDefault();
        sketch.redo();
        return;
      }
      if (command) {
        return;
      }
      if (event.key === ' ') {
        event.preventDefault();
        editor.togglePlay();
        return;
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        const forward = event.key === 'ArrowRight';
        if (!event.shiftKey) {
          editor.seek(editor.frame + (forward ? 1 : -1));
          return;
        }
        const items: readonly { frame: number }[] =
          editor.mode === 'motion'
            ? (sketch.sketch?.motion.keys ?? [])
            : (sketch.sketch?.effect.cels ?? []);
        const marks = byFrame(items).map((item) => item.frame);
        const target = forward
          ? marks.find((at) => at > editor.frame)
          : marks.filter((at) => at < editor.frame).at(-1);
        if (target !== undefined) {
          editor.seek(target);
        }
        return;
      }
      if (editor.mode === 'motion' && key === 's') {
        takeSnapshot();
        return;
      }
      const tool = PAINT_TOOLS.find((option) => option.shortcut.toLowerCase() === key);
      if (editor.mode === 'effect' && tool) {
        editor.set({ tool: tool.id });
      }
    };
    // Capture, so toolbar buttons that move focus with the arrows do not swallow frame stepping.
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [takeSnapshot]);
}
