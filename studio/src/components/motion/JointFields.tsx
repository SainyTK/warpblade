import { ANGLE_SNAP, JOINT_FIELDS, JOINT_SNAP } from '@/constants/joints';
import { usePoseEditor } from '@/hooks/usePoseEditor';
import { cn } from '@/lib/utils';
import { NumberField } from '../common/NumberField';

const ROW = 'grid grid-cols-[5.5rem_1fr_1fr] items-center gap-1.5';

/** Every joint of the pose as numbers, in pixels from the feet, the chest bend in pixels and the angles in radians. */
export function JointFields() {
  const editor = usePoseEditor();
  return (
    <div className="grid gap-1.5">
      {JOINT_FIELDS.map((group) => (
        <div key={group.label} className={ROW}>
          <span className="truncate text-xs">{group.label}</span>
          {group.keys.map((key) => (
            <div key={key} className={cn(group.keys.length === 1 && 'col-span-2')}>
              <NumberField
                label={group.keys.length === 1 ? group.unit : key.endsWith('x') ? 'x' : 'y'}
                value={editor.pose[key]}
                step={group.unit === 'rad' ? ANGLE_SNAP : JOINT_SNAP}
                onBegin={editor.beginGesture}
                onChange={(value) =>
                  editor.setPose({ ...editor.pose, [key]: value }, editor.root, false)
                }
              />
            </div>
          ))}
        </div>
      ))}
      <div className={ROW}>
        <span className="text-xs">Feet</span>
        <NumberField
          label="x"
          value={editor.root.x}
          step={1}
          onBegin={editor.beginGesture}
          onChange={(x) => editor.setPose(editor.pose, { ...editor.root, x }, false)}
        />
        <NumberField
          label="y"
          value={editor.root.y}
          step={1}
          onBegin={editor.beginGesture}
          onChange={(y) =>
            editor.setPose(editor.pose, { ...editor.root, y: Math.min(0, y) }, false)
          }
        />
      </div>
    </div>
  );
}
