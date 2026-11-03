import { Eraser, type LucideIcon, PaintBucket, Pencil, Pipette, Slash } from 'lucide-react';
import type { PaintTool } from '@/types/studio';

export const PAINT_TOOLS: readonly {
  id: PaintTool;
  label: string;
  icon: LucideIcon;
  shortcut: string;
}[] = [
  { id: 'pencil', label: 'Pencil', icon: Pencil, shortcut: 'B' },
  { id: 'eraser', label: 'Eraser', icon: Eraser, shortcut: 'E' },
  { id: 'line', label: 'Line', icon: Slash, shortcut: 'L' },
  { id: 'fill', label: 'Fill', icon: PaintBucket, shortcut: 'G' },
  { id: 'picker', label: 'Pick color', icon: Pipette, shortcut: 'I' },
];

export const BRUSH_SIZES = [1, 2, 3] as const;
