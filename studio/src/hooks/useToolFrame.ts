import { useEditorStore } from '@/store/editorStore';

/** The frame the tool panels edit: the playhead, held where playback started while it plays. */
export const useToolFrame = (): number => useEditorStore((state) => state.heldFrame ?? state.frame);
