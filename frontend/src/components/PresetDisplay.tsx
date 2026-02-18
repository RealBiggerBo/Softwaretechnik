import { type DataRecord } from "../classes/DataRecord";
import {
  ToUiItem,
  type UiItem,
  type UiPreset,
  type UiQuery,
} from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionList from "./FilterOptionList";
import QueryList from "./QueryList";

interface Props {
  preset: UiItem<UiPreset>;
  format: DataRecord;
  onChange: (query: UiItem<UiPreset>) => void;
}

function UpdateQuery(
  oldPreset: UiItem<UiPreset>,
  queryToReplace: UiItem<UiQuery>,
  newQuery: UiItem<UiQuery>,
): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      queries: oldPreset.value.queries.map((currentQuery, _) =>
        currentQuery === queryToReplace ? newQuery : currentQuery,
      ),
    },
  };
}

function UpdateGlobalFilterOption(
  oldPreset: UiItem<UiPreset>,
  optionToReplace: UiItem<FilterOption>,
  newOption: UiItem<FilterOption>,
): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      globalFilterOptions: oldPreset.value.globalFilterOptions.map(
        (currentOption, i) =>
          currentOption.id === optionToReplace.id ? newOption : currentOption,
      ),
    },
  };
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

function RemoveQuery(
  oldPreset: UiItem<UiPreset>,
  queryToRemove: UiItem<UiQuery>,
): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      queries: oldPreset.value.queries.filter(
        (query) => !(query === queryToRemove),
      ),
    },
  };
}

function RemoveGlobalFilterOption(
  oldPreset: UiItem<UiPreset>,
  optionToRemove: UiItem<FilterOption>,
): UiItem<UiPreset> {
  return {
    ...oldPreset,
    value: {
      ...oldPreset.value,
      globalFilterOptions: oldPreset.value.globalFilterOptions.filter(
        (option) => !(option === optionToRemove),
      ),
    },
  };
}

function PresetDisplay({ preset, format, onChange }: Props) {
  return (
    <>
      <FilterOptionList
        filterOptions={preset.value.globalFilterOptions}
        format={format}
        addText="Neue globale Filteroption"
        removeText="Entfernen"
        updateFilterOption={(optionToUpdate, newOption) =>
          onChange(UpdateGlobalFilterOption(preset, optionToUpdate, newOption))
        }
        addNewFilterOption={() => onChange(AddGlobalFilterOption(preset))}
        removeFilterOption={(optionToRemove) =>
          onChange(RemoveGlobalFilterOption(preset, optionToRemove))
        }
      />

      <QueryList
        queries={preset.value.queries}
        format={format}
        addText="Neue Query"
        removeText="Entfernen"
        updateQuery={(queryToUpdate, newQuery) =>
          onChange(UpdateQuery(preset, queryToUpdate, newQuery))
        }
        addNewQuery={() => onChange(AddQuery(preset))}
        removeQuery={(queryToRemove) =>
          onChange(RemoveQuery(preset, queryToRemove))
        }
      />
    </>
  );
}

export default PresetDisplay;
