import type { JobTarget } from '@shared/api';
import { DEFAULT_PERMISSION_MODE, type PermissionModeId } from '@shared/permissionModes';
import { useState } from 'react';
import { exportImages } from '@/services/exportImages';
import { createJob } from '@/services/jobApi';
import { useEditorStore } from '@/store/editorStore';
import { useSketchStore } from '@/store/sketchStore';
import { useSettings } from './useSettings';

/** The build form's state, and sending the sketch to a new agent job. */
export function useBuildJob(onCreated: () => void) {
  const settings = useSettings();
  const sketch = useSketchStore((state) => state.sketch);
  const [instruction, setInstruction] = useState('');
  const [motion, setMotion] = useState(true);
  const [effect, setEffect] = useState(true);
  const [model, setModel] = useState<string | null>(null);
  const [permissionMode, setPermissionMode] = useState<PermissionModeId>(DEFAULT_PERMISSION_MODE);
  const [target, setTarget] = useState<JobTarget>('worktree');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasMotion = (sketch?.motion.keys.length ?? 0) > 1;
  const hasEffect = (sketch?.effect.cels.length ?? 0) > 0;
  const include = { motion: motion && hasMotion, effect: effect && hasEffect };
  const chosenModel = model ?? settings?.defaultModel ?? null;
  const ready = Boolean(
    sketch &&
      chosenModel &&
      instruction.trim() &&
      (include.motion || include.effect) &&
      !settings?.proxyError,
  );

  const submit = async () => {
    if (!sketch || !chosenModel || !ready) {
      return;
    }
    setSending(true);
    setError(null);
    try {
      const job = await createJob({
        sketch,
        instruction,
        include,
        model: chosenModel,
        permissionMode,
        target,
        images: exportImages(sketch, include),
      });
      useEditorStore.getState().set({ jobId: job.id });
      setInstruction('');
      onCreated();
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'The job could not start.');
    } finally {
      setSending(false);
    }
  };

  return {
    sketch,
    instruction,
    setInstruction,
    motion,
    setMotion,
    effect,
    setEffect,
    hasMotion,
    hasEffect,
    model: chosenModel,
    setModel,
    permissionMode,
    setPermissionMode,
    target,
    setTarget,
    sending,
    error: error ?? settings?.proxyError ?? null,
    ready,
    submit,
  };
}
