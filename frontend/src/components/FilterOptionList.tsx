import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import FilterOptionDisplay from "./FilterOptionDisplay";
import type { FilterOption } from "../classes/FilterOption";
import StyledButton from "./Styledbutton";

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
            option={option}
            format={format}
            onChange={(newOption) => {
              updateFilterOption(option, newOption);
            }}
          ></FilterOptionDisplay>
          <StyledButton
            text={removeText}
            onClick={() => removeFilterOption(option)}
          />
        </div>
      ))}
      <br></br>
      <StyledButton text={addText} onClick={() => addNewFilterOption()} />
    </>
  );
}

export default FilterOptionList;
