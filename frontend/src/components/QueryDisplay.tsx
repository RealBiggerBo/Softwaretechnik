import { type DataRecord } from "../classes/DataRecord";
import { type DisplayAction } from "../classes/DisplayAction";
import { TextField } from "@mui/material";
import { ToUiItem, type UiItem, type UiQuery } from "../classes/UiItems";
import type { FilterOption } from "../classes/FilterOption";
import FilterOptionList from "./FilterOptionList";
import DisplayActionList from "./DisplayActionList";
import { memo, useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  query: UiItem<UiQuery>;
  format: DataRecord;
  setQuery: Dispatch<SetStateAction<UiItem<UiQuery>>>;
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

function QueryDisplay({ query, format, setQuery }: Props) {
  const handleTitleChange = useCallback(
    (value: string) => {
      setQuery((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          queryTitle: value,
        },
      }));
    },
    [setQuery],
  );

  const handleUpdateDisplayActionById = useCallback(
    (actionId: string, newAction: UiItem<DisplayAction>) => {
      setQuery((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          displayActions: prev.value.displayActions.map((action) =>
            action.id === actionId
              ? { ...newAction, id: actionId }
              : action,
          ),
        },
      }));
    },
    [setQuery],
  );

  const handleAddDisplayAction = useCallback(() => {
    setQuery(AddDisplayAction);
  }, [setQuery]);

  const handleRemoveDisplayActionById = useCallback(
    (actionId: string) => {
      setQuery((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          displayActions: prev.value.displayActions.filter(
            (action) => action.id !== actionId,
          ),
        },
      }));
    },
    [setQuery],
  );

  const handleUpdateFilterOptionById = useCallback(
    (optionId: string, nextOption: UiItem<FilterOption>) => {
      setQuery((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          filterOptions: prev.value.filterOptions.map((option) =>
            option.id === optionId ? { ...nextOption, id: optionId } : option,
          ),
        },
      }));
    },
    [setQuery],
  );

  const handleAddFilterOption = useCallback(() => {
    setQuery(AddFilterOption);
  }, [setQuery]);

  const handleRemoveFilterOptionById = useCallback(
    (optionId: string) => {
      setQuery((prev) => ({
        ...prev,
        value: {
          ...prev.value,
          filterOptions: prev.value.filterOptions.filter(
            (option) => option.id !== optionId,
          ),
        },
      }));
    },
    [setQuery],
  );

  return (
    <>
      <TextField
        label={"Titel"}
        value={query.value.queryTitle ? query.value.queryTitle : ""}
        onChange={(e) => handleTitleChange(e.target.value)}
      />

      <DisplayActionList
        displayActions={query.value.displayActions}
        format={format}
        addText="Neue Anzeigeoption"
        removeText="Entfernen"
        addNewDisplayAction={handleAddDisplayAction}
        updateDisplayActionById={handleUpdateDisplayActionById}
        removeDisplayActionById={handleRemoveDisplayActionById}
      />

      <FilterOptionList
        filterOptions={query.value.filterOptions}
        format={format}
        addText="Neue Filteroption"
        removeText="Entfernen"
        addNewFilterOption={handleAddFilterOption}
        updateFilterOptionById={handleUpdateFilterOptionById}
        removeFilterOptionById={handleRemoveFilterOptionById}
      />
    </>
  );
}

export default memo(QueryDisplay);
