import { useEditorStore } from '@/store/editorStore';
import { PaintPanel } from '../effect/PaintPanel';
import { PosePanel } from '../motion/PosePanel';

/** The left panel: the tools of the current mode. */
export function ToolPanel() {
  const mode = useEditorStore((state) => state.mode);
  return mode === 'motion' ? <PosePanel /> : <PaintPanel />;
}
