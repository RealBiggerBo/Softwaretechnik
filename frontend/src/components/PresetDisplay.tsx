import { type DataRecord } from "../classes/DataRecord";
import { memo, useCallback } from "react";
import {
  ToUiItem,
  type UiItem,
  type UiPreset,
  type UiQuery,
} from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionList from "./FilterOptionList";
import QueryList from "./QueryList";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  preset: UiItem<UiPreset>;
  format: DataRecord;
  onChange: Dispatch<SetStateAction<UiItem<UiPreset> | null>>;
}

function AddQuery(oldPreset: UiItem<UiPreset>): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      queries: [
        ...oldPreset.value.queries,
        ToUiItem({ queryTitle: "", displayActions: [], filterOptions: [] }),
      ],
    },
  };
}

function AddGlobalFilterOption(oldPreset: UiItem<UiPreset>): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      globalFilterOptions: [
        ...oldPreset.value.globalFilterOptions,
        ToUiItem({ type: "Empty", fieldId: -1 }),
      ],
    },
  };
}

function PresetDisplay({ preset, format, onChange }: Props) {
  const applyPresetUpdate = useCallback(
    (updater: (prev: UiItem<UiPreset>) => UiItem<UiPreset>) => {
      onChange((prev) => (prev ? updater(prev) : prev));
    },
    [onChange],
  );

  const handleUpdateGlobalFilterOption = useCallback(
    (optionId: string, nextOption: UiItem<FilterOption>) => {
      applyPresetUpdate((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          globalFilterOptions: prev.value.globalFilterOptions.map((option) =>
            option.id === optionId ? { ...nextOption, id: optionId } : option,
          ),
        },
      }));
    },
    [applyPresetUpdate],
  );

  const handleAddGlobalFilterOption = useCallback(() => {
    applyPresetUpdate(AddGlobalFilterOption);
  }, [applyPresetUpdate]);

  const handleRemoveGlobalFilterOption = useCallback(
    (optionId: string) => {
      applyPresetUpdate((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          globalFilterOptions: prev.value.globalFilterOptions.filter(
            (option) => option.id !== optionId,
          ),
        },
      }));
    },
    [applyPresetUpdate],
  );

  const handleAddQuery = useCallback(() => {
    applyPresetUpdate(AddQuery);
  }, [applyPresetUpdate]);

  const handleUpdateQueryById = useCallback(
    (
      queryId: string,
      updater: (prev: UiItem<UiQuery>) => UiItem<UiQuery>,
    ) => {
      applyPresetUpdate((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          queries: prev.value.queries.map((query) =>
            query.id === queryId ? updater(query) : query,
          ),
        },
      }));
    },
    [applyPresetUpdate],
  );

  const handleRemoveQueryById = useCallback(
    (queryId: string) => {
      applyPresetUpdate((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          queries: prev.value.queries.filter((query) => query.id !== queryId),
        },
      }));
    },
    [applyPresetUpdate],
  );

  return (
    <>
      <FilterOptionList
        filterOptions={preset.value.globalFilterOptions}
        format={format}
        addText="Neue globale Filteroption"
        removeText="Entfernen"
        updateFilterOptionById={handleUpdateGlobalFilterOption}
        addNewFilterOption={handleAddGlobalFilterOption}
        removeFilterOptionById={handleRemoveGlobalFilterOption}
      />

      <QueryList
        queries={preset.value.queries}
        format={format}
        addText="Neue Query"
        removeText="Entfernen"
        addNewQuery={handleAddQuery}
        updateQueryById={handleUpdateQueryById}
        removeQueryById={handleRemoveQueryById}
      />
    </>
  );
}

export default memo(PresetDisplay);
