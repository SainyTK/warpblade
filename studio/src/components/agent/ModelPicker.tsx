import { Sparkles } from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';
import { AgentPicker } from './AgentPicker';

export function ModelPicker({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (model: string) => void;
}) {
  const settings = useSettings();
  return (
    <AgentPicker
      label="Model"
      icon={<Sparkles />}
      value={value}
      options={(settings?.models ?? []).map((model) => ({ value: model.id, label: model.label }))}
      onChange={onChange}
    />
  );
}
