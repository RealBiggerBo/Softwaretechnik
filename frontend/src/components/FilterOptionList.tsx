import { Button } from "@mui/material";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import FilterOptionDisplay from "./FilterOptionDisplay";
import type { FilterOption } from "../classes/FilterOption";

interface Props {
  filterOptions: UiItem<FilterOption>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateFilterOption: (
    optionToUpdate: UiItem<FilterOption>,
    newOption: UiItem<FilterOption>,
  ) => void;
  addNewFilterOption: () => void;
  removeFilterOption: (optionToRemove: UiItem<FilterOption>) => void;
}

function FilterOptionList({
  filterOptions,
  format,
  addText,
  removeText,
  updateFilterOption,
  addNewFilterOption,
  removeFilterOption,
}: Props) {
  return (
    <>
      {filterOptions.map((option, _) => (
        <div key={option.id}>
          <FilterOptionDisplay
            action={option}
            format={format}
            onChange={(newOption) => {
              updateFilterOption(option, newOption);
            }}
          ></FilterOptionDisplay>
          <Button onClick={() => removeFilterOption(option)}>
            {removeText}
          </Button>
        </div>
      ))}
      <br></br>
      <Button onClick={() => addNewFilterOption()}>{addText}</Button>
    </>
  );
}

export default FilterOptionList;
