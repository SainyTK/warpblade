import type {
  DecisionRequest,
  JobRequest,
  JobSummary,
  JobView,
  PreviewState,
  StudioSettings,
  TurnRequest,
} from '@shared/api';
import type { PermissionModeId } from '@shared/permissionModes';
import { request, send } from './api';

export const getSettings = () => request<StudioSettings>('/api/settings');
export const listJobs = () => request<JobSummary[]>('/api/jobs');
export const getJob = (id: string) => request<JobView>(`/api/jobs/${id}`);
export const createJob = (body: JobRequest) => send<JobSummary>('/api/jobs', 'POST', body);
export const sendTurn = (id: string, body: TurnRequest) =>
  send<{ ok: true }>(`/api/jobs/${id}/turns`, 'POST', body);
export const stopJob = (id: string) => send<{ ok: true }>(`/api/jobs/${id}/stop`, 'POST');
export const setJobMode = (id: string, permissionMode: PermissionModeId) =>
  send<{ ok: true }>(`/api/jobs/${id}/mode`, 'POST', { permissionMode });
export const decide = (id: string, approvalId: string, body: DecisionRequest) =>
  send<{ ok: true }>(`/api/jobs/${id}/approvals/${approvalId}`, 'POST', body);
export const startPreview = (id: string) => send<PreviewState>(`/api/jobs/${id}/preview`, 'POST');
export const stopPreview = (id: string) =>
  send<{ ok: true }>(`/api/jobs/${id}/preview?action=stop`, 'POST');
