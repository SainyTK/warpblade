// Claude Code permission modes the studio offers, as in the PWA Chat page. dontAsk is not offered.
export type PermissionModeId = 'auto' | 'default' | 'acceptEdits' | 'plan' | 'bypassPermissions';

export const PERMISSION_MODES: readonly { id: PermissionModeId; label: string }[] = [
  { id: 'auto', label: 'Auto' },
  { id: 'default', label: 'Ask first' },
  { id: 'acceptEdits', label: 'Accept edits' },
  { id: 'plan', label: 'Plan' },
  { id: 'bypassPermissions', label: 'Bypass permissions' },
];

export const DEFAULT_PERMISSION_MODE: PermissionModeId = 'auto';
