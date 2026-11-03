import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';

interface NumberFieldProps {
  label: string;
  value: number;
  step: number;
  onChange: (value: number) => void;
  /** Called when a change starts, so it can be undone in one step. */
  onBegin?: () => void;
}

/** A compact labelled number input that accepts a value once it parses. */
export function NumberField({ label, value, step, onChange, onBegin }: NumberFieldProps) {
  const decimals = step < 1 ? 2 : 0;
  const shown = String(Number((Math.round(value / step) * step).toFixed(decimals)));
  const [text, setText] = useState(shown);
  useEffect(() => setText(shown), [shown]);
  return (
    <label className="flex min-w-0 items-center gap-1.5 text-muted-foreground text-xs">
      <span className="shrink-0">{label}</span>
      <Input
        type="number"
        inputMode="decimal"
        step={step}
        value={text}
        onFocus={onBegin}
        onChange={(event) => {
          setText(event.target.value);
          const parsed = Number(event.target.value);
          if (event.target.value !== '' && Number.isFinite(parsed)) {
            onChange(parsed);
          }
        }}
        className="h-7 min-h-7 px-1.5 text-foreground text-xs tabular-nums"
      />
    </label>
  );
}
