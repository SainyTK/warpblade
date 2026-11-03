import { CLIP_NAMES, GAME_CLIPS, POSE_PRESETS, STRIKING_CLIPS } from '@/constants/presets';
import { usePoseEditor } from '@/hooks/usePoseEditor';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { clipKeys } from '@/utils/sketch';
import { replaceMotion } from '@/utils/sketchEdits';
import { OptionSelect } from '../common/OptionSelect';

const CLIP_OPTIONS = CLIP_NAMES.map((name) => ({ value: name, label: name }));
const POSE_OPTIONS = POSE_PRESETS.map((preset) => ({ value: preset.id, label: preset.label }));

/** Start from one of the game's clips (it replaces the snapshots; undo brings them back) or one of its poses. */
export function StartFrom() {
  const change = useSketchStore((state) => state.change);
  const seek = useEditorStore((state) => state.seek);
  const editor = usePoseEditor();
  return (
    <div className="grid gap-2">
      <OptionSelect
        label="Game clip"
        value={null}
        options={CLIP_OPTIONS}
        onChange={(name) => {
          const clip = GAME_CLIPS[name];
          if (!clip) {
            return;
          }
          const { keys, hitFrame } = clipKeys(clip, STRIKING_CLIPS.has(name));
          change((sketch) => replaceMotion(sketch, keys, hitFrame));
          seek(0);
        }}
      />
      <OptionSelect
        label="Game pose"
        value={null}
        options={POSE_OPTIONS}
        onChange={(id) => {
          const preset = POSE_PRESETS.find((option) => option.id === id);
          if (preset) {
            editor.setPose({ ...preset.pose });
          }
        }}
      />
    </div>
  );
}
