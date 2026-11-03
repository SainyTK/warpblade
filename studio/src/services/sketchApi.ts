import type { Sketch, SketchSummary } from '@shared/sketch';
import { request, send } from './api';

export const listSketches = () => request<SketchSummary[]>('/api/sketches');
export const getSketch = (id: string) => request<Sketch>(`/api/sketches/${id}`);
export const saveSketch = (sketch: Sketch) =>
  send<SketchSummary>(`/api/sketches/${sketch.id}`, 'PUT', sketch);
export const deleteSketch = (id: string) => send<{ ok: true }>(`/api/sketches/${id}`, 'DELETE');
