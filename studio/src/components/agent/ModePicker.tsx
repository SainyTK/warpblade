import { PERMISSION_MODES, type PermissionModeId } from '@shared/permissionModes';
import { Shield } from 'lucide-react';
import { AgentPicker } from './AgentPicker';

const OPTIONS = PERMISSION_MODES.map((mode) => ({
  value: mode.id,
  label: mode.label,
  dangerous: mode.id === 'bypassPermissions',
}));

export function ModePicker({
  value,
  onChange,
}: {
  value: PermissionModeId;
  onChange: (mode: PermissionModeId) => void;
}) {
  return (
    <AgentPicker
      label="Permission mode"
      icon={<Shield />}
      value={value}
      options={OPTIONS}
      dangerous={value === 'bypassPermissions'}
      onChange={(next) => {
        const mode = PERMISSION_MODES.find((option) => option.id === next);
        if (mode) {
          onChange(mode.id);
        }
      }}
    />
  );
}
