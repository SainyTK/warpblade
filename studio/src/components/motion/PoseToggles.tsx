import { usePoseEditor } from '@/hooks/usePoseEditor';
import { SwitchRow } from '../common/SwitchRow';

/**
 * Kael's back to the camera (tw), the whole pose mirrored to face behind him (mr), and each elbow bent the other way
 * (fe, be).
 */
export function PoseToggles() {
  const editor = usePoseEditor();
  return (
    <div className="grid gap-2">
      <SwitchRow
        label="Back turned"
        checked={editor.pose.tw >= 0.5}
        onChange={(on) => editor.setPose({ ...editor.pose, tw: on ? 1 : 0 })}
      />
      <SwitchRow
        label="Mirrored"
        checked={editor.pose.mr >= 0.5}
        onChange={(on) => editor.setPose({ ...editor.pose, mr: on ? 1 : 0 })}
      />
      <SwitchRow
        label="Sword elbow flipped"
        checked={editor.pose.fe >= 0.5}
        onChange={(on) => editor.setPose({ ...editor.pose, fe: on ? 1 : 0 })}
      />
      <SwitchRow
        label="Far elbow flipped"
        checked={editor.pose.be >= 0.5}
        onChange={(on) => editor.setPose({ ...editor.pose, be: on ? 1 : 0 })}
      />
    </div>
  );
}
