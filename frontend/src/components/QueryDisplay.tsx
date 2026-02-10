import { type DataRecord } from "../classes/DataRecord";
import { type DisplayAction } from "../classes/DisplayAction";
import { Button } from "@mui/material";
import DisplayActionDisplay from "./DisplayActionDisplay";
import { ToUiItem, type UiItem, type UiQuery } from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionDisplay from "./FilterOptionDisplay";
import FilterOptionList from "./FilterOptionList";
import DisplayActionList from "./DisplayActionList";

interface Props {
  query: UiItem<UiQuery>;
  format: DataRecord;
  onChange: (query: UiItem<UiQuery>) => void;
}

function UpdateDisplayAction(
  oldQuery: UiItem<UiQuery>,
  actionToReplace: UiItem<DisplayAction>,
  newAction: UiItem<DisplayAction>,
): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      displayActions: oldQuery.value.displayActions.map((currentAction, i) =>
        currentAction === actionToReplace ? newAction : currentAction,
      ),
    },
  };
}

function UpdateFilterOption(
  oldQuery: UiItem<UiQuery>,
  optionToReplace: UiItem<FilterOption>,
  newOption: UiItem<FilterOption>,
): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      filterOptions: oldQuery.value.filterOptions.map((currentOption, i) =>
        currentOption.id === optionToReplace.id ? newOption : currentOption,
      ),
    },
  };
}

function AddDisplayAction(oldQuery: UiItem<UiQuery>): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      displayActions: [
        ...oldQuery.value.displayActions,
        ToUiItem({ type: "Empty", fieldId: -1, title: "" }),
      ],
    },
  };
}

function AddFilterOption(oldQuery: UiItem<UiQuery>): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      filterOptions: [
        ...oldQuery.value.filterOptions,
        ToUiItem({ type: "Empty", fieldId: -1 }),
      ],
    },
  };
}

function RemoveDisplayAction(
  oldQuery: UiItem<UiQuery>,
  actionToRemove: UiItem<DisplayAction>,
): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      displayActions: oldQuery.value.displayActions.filter(
        (action) => !(action === actionToRemove),
      ),
    },
  };
}

function RemoveFilterOption(
  oldQuery: UiItem<UiQuery>,
  actionToRemove: UiItem<FilterOption>,
): UiItem<UiQuery> {
  return {
    ...oldQuery,
    value: {
      ...oldQuery.value,
      filterOptions: oldQuery.value.filterOptions.filter(
        (action) => !(action === actionToRemove),
      ),
    },
  };
}

function QueryDisplay({ query, format, onChange }: Props) {
  return (
    <>
      <DisplayActionList
        displayActions={query.value.displayActions}
        format={format}
        addText="Neue Anzeigeoption"
        removeText="Entfernen"
        updateDisplayAction={(actionToUpdate, newAction) =>
          onChange(UpdateDisplayAction(query, actionToUpdate, newAction))
        }
        addNewDisplayAction={() => onChange(AddDisplayAction(query))}
        removeDisplayAction={(actionToRemove) =>
          onChange(RemoveDisplayAction(query, actionToRemove))
        }
      />

      <FilterOptionList
        filterOptions={query.value.filterOptions}
        format={format}
        addText="Neue Filteroption"
        removeText="Entfernen"
        updateFilterOption={(optionToUpdate, newOption) =>
          onChange(UpdateFilterOption(query, optionToUpdate, newOption))
        }
        addNewFilterOption={() => onChange(AddFilterOption(query))}
        removeFilterOption={(optionToRemove) =>
          onChange(RemoveFilterOption(query, optionToRemove))
        }
      />
    </>
  );
}

export default QueryDisplay;
