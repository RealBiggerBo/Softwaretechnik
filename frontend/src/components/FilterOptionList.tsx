import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import FilterOptionDisplay from "./FilterOptionDisplay";
import type { FilterOption } from "../classes/FilterOption";
import StyledButton from "./Styledbutton";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box, Fab, Icon, IconButton, Paper, Stack } from "@mui/material";

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
        <Paper elevation={5} sx={{ padding: "7px", marginTop: "10px" }}>
          <Stack
            spacing={0.5}
            direction="row"
            sx={{
              alignItems: "flex-start",
              justifyContent: "space-between",
              width: "100%",
            }}
            key={option.id}
          >
            <Box sx={{ flexGrow: 1 }}>
              <FilterOptionDisplay
                option={option}
                format={format}
                onChange={(newOption) => {
                  updateFilterOption(option, newOption);
                }}
              ></FilterOptionDisplay>
            </Box>
            <Box
              sx={{
                height: 56, // height of one autocomplete
                display: "flex",
                alignItems: "center",
              }}
            >
              <Fab
                color="error"
                aria-label={removeText}
                onClick={() => removeFilterOption(option)}
              >
                <DeleteIcon />
              </Fab>
            </Box>
          </Stack>
        </Paper>
      ))}
      <StyledButton
        text={addText}
        onClick={() => addNewFilterOption()}
        sx={{ marginTop: "10px" }}
      />
    </>
  );
}

export default FilterOptionList;
