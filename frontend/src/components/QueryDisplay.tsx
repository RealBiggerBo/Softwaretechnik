import { type DataRecord } from "../classes/DataRecord";
import { type DisplayAction } from "../classes/DisplayAction";
import { Button } from "@mui/material";
import DisplayActionDisplay from "./DisplayActionDisplay";
import { ToUiItem, type UiItem, type UiQuery } from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionDisplay from "./FilterOptionDisplay";

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
        ToUiItem({ type: "Empty", fieldId: -1 }),
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
      {query.value.displayActions.map((action, i) => (
        <div key={i}>
          <DisplayActionDisplay
            action={action}
            format={format}
            onChange={(newAction) =>
              onChange(UpdateDisplayAction(query, action, newAction))
            }
          ></DisplayActionDisplay>
          <Button onClick={() => onChange(RemoveDisplayAction(query, action))}>
            Entfernen
          </Button>
        </div>
      ))}
      <br></br>
      <Button onClick={() => onChange(AddDisplayAction(query))}>
        Neues Anzeigeaktion
      </Button>

      {query.value.filterOptions.map((option, i) => (
        <div key={i}>
          <FilterOptionDisplay
            action={option}
            format={format}
            onChange={(newOption) => {
              alert(
                JSON.stringify(UpdateFilterOption(query, option, newOption)),
              );
              onChange(UpdateFilterOption(query, option, newOption));
            }}
          ></FilterOptionDisplay>
          <Button onClick={() => onChange(RemoveFilterOption(query, option))}>
            Entfernen
          </Button>
        </div>
      ))}
      <br></br>
      <Button onClick={() => onChange(AddFilterOption(query))}>
        Neue Filteroption
      </Button>
    </>
  );
}

export default QueryDisplay;
