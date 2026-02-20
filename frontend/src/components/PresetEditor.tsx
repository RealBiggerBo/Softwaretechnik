import { memo, useEffect, useState } from "react";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem, UiPreset } from "../classes/UiItems";
import PresetDisplay from "./PresetDisplay";

interface Props {
  preset: UiItem<UiPreset> | null;
  format: DataRecord;
  onPresetChange: (preset: UiItem<UiPreset> | null) => void;
}

function PresetEditor({ preset, format, onPresetChange }: Props) {
  const [localPreset, setLocalPreset] = useState<UiItem<UiPreset> | null>(
    preset,
  );

  useEffect(() => {
    setLocalPreset(preset);
  }, [preset]);

  useEffect(() => {
    onPresetChange(localPreset);
  }, [localPreset, onPresetChange]);

  if (!localPreset) return null;

  return (
    <PresetDisplay
      preset={localPreset}
      onChange={setLocalPreset}
      format={format}
    />
  );
}

export default memo(PresetEditor);
