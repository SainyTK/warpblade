import type { Draft } from '@shared/draft';
import type { MotionId } from '@shared/motionId';
import type { ClipFrames } from '@/types/studio';
import { request, send } from './api';

export const listDrafts = () => request<Draft[]>('/api/drafts');

export const saveDraft = (motion: MotionId, { frames, snaps }: ClipFrames) =>
  send<Draft>(`/api/drafts/${motion}`, 'PUT', { frames, snaps });
