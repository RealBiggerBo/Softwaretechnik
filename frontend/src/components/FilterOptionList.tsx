import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import FilterOptionDisplay from "./FilterOptionDisplay";
import type { FilterOption } from "../classes/FilterOption";
import StyledButton from "./Styledbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Fab, Paper, Stack } from "@mui/material";
import { memo, useCallback } from "react";

interface Props {
  filterOptions: UiItem<FilterOption>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateFilterOptionById: (
    optionId: string,
    nextOption: UiItem<FilterOption>,
  ) => void;
  addNewFilterOption: () => void;
  removeFilterOptionById: (optionId: string) => void;
}

function FilterOptionList({
  filterOptions,
  format,
  addText,
  removeText,
  updateFilterOptionById,
  addNewFilterOption,
  removeFilterOptionById,
}: Props) {
  const handleAdd = useCallback(() => {
    addNewFilterOption();
  }, [addNewFilterOption]);

  return (
    <>
      {filterOptions.map((option) => (
        <FilterOptionRow
          key={option.id}
          option={option}
          format={format}
          removeText={removeText}
          updateFilterOptionById={updateFilterOptionById}
          removeFilterOptionById={removeFilterOptionById}
        />
      ))}
      <StyledButton
        text={addText}
        onClick={handleAdd}
        sx={{ marginTop: "10px" }}
      />
    </>
  );
}

interface FilterOptionRowProps {
  option: UiItem<FilterOption>;
  format: DataRecord;
  removeText: string;
  updateFilterOptionById: (
    optionId: string,
    nextOption: UiItem<FilterOption>,
  ) => void;
  removeFilterOptionById: (optionId: string) => void;
}

const FilterOptionRow = memo(function FilterOptionRow({
  option,
  format,
  removeText,
  updateFilterOptionById,
  removeFilterOptionById,
}: FilterOptionRowProps) {
  const handleChange = useCallback(
    (newOption: UiItem<FilterOption>) => {
      updateFilterOptionById(option.id, newOption);
    },
    [option.id, updateFilterOptionById],
  );

  const handleRemove = useCallback(() => {
    removeFilterOptionById(option.id);
  }, [option.id, removeFilterOptionById]);

  return (
    <Paper elevation={5} sx={{ padding: "7px", marginTop: "10px" }}>
      <Stack
        spacing={0.5}
        direction="row"
        sx={{
          alignItems: "flex-start",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <FilterOptionDisplay
            option={option}
            format={format}
            onChange={handleChange}
          />
        </Box>
        <Box
          sx={{
            height: 56, // height of one autocomplete
            display: "flex",
            alignItems: "center",
          }}
        >
          <Fab color="error" aria-label={removeText} onClick={handleRemove}>
            <DeleteIcon />
          </Fab>
        </Box>
      </Stack>
    </Paper>
  );
});

export default memo(FilterOptionList);
