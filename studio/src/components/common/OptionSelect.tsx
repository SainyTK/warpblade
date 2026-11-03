import {
  Select,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface Option {
  value: string;
  label: string;
}

interface OptionSelectProps {
  label: string;
  value: string | null;
  options: readonly Option[];
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

/** A labelled select over plain string options. */
export function OptionSelect({
  label,
  value,
  options,
  onChange,
  placeholder,
  className,
}: OptionSelectProps) {
  return (
    <Select
      value={value}
      items={options.map((option) => ({ value: option.value, label: option.label }))}
      onValueChange={(next) => {
        if (typeof next === 'string') {
          onChange(next);
        }
      }}
    >
      <SelectTrigger aria-label={label} className={cn('h-8 w-full text-sm', className)}>
        <SelectValue placeholder={placeholder ?? label} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <SelectItemText>{option.label}</SelectItemText>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
