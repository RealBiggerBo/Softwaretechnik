import { Button, Paper, Stack, Box, Fab } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { memo, useCallback } from "react";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import type { DisplayAction } from "../classes/DisplayAction";
import DisplayActionDisplay from "./DisplayActionDisplay";

interface Props {
  displayActions: UiItem<DisplayAction>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateDisplayActionById: (
    actionId: string,
    nextOption: UiItem<DisplayAction>,
  ) => void;
  addNewDisplayAction: () => void;
  removeDisplayActionById: (actionId: string) => void;
}

function DisplayActionList({
  displayActions,
  format,
  addText,
  removeText,
  updateDisplayActionById,
  addNewDisplayAction,
  removeDisplayActionById,
}: Props) {
  const handleAdd = useCallback(() => {
    addNewDisplayAction();
  }, [addNewDisplayAction]);

  return (
    <>
      {displayActions.map((action) => (
        <DisplayActionRow
          key={action.id}
          action={action}
          format={format}
          removeText={removeText}
          updateDisplayActionById={updateDisplayActionById}
          removeDisplayActionById={removeDisplayActionById}
        />
      ))}
      <Button onClick={handleAdd} sx={{ mt: 1 }}>
        {addText}
      </Button>
    </>
  );
}

interface DisplayActionRowProps {
  action: UiItem<DisplayAction>;
  format: DataRecord;
  removeText: string;
  updateDisplayActionById: (
    actionId: string,
    nextOption: UiItem<DisplayAction>,
  ) => void;
  removeDisplayActionById: (actionId: string) => void;
}

function areDisplayActionRowsEqual(
  prev: DisplayActionRowProps,
  next: DisplayActionRowProps,
) {
  return (
    prev.format === next.format &&
    prev.removeText === next.removeText &&
    prev.updateDisplayActionById === next.updateDisplayActionById &&
    prev.removeDisplayActionById === next.removeDisplayActionById &&
    prev.action.id === next.action.id &&
    prev.action.value.type === next.action.value.type &&
    prev.action.value.fieldId === next.action.value.fieldId &&
    prev.action.value.title === next.action.value.title
  );
}

const DisplayActionRow = memo(function DisplayActionRow({
  action,
  format,
  removeText,
  updateDisplayActionById,
  removeDisplayActionById,
}: DisplayActionRowProps) {
  const handleChange = useCallback(
    (newAction: UiItem<DisplayAction>) => {
      updateDisplayActionById(action.id, newAction);
    },
    [action.id, updateDisplayActionById],
  );

  const handleRemove = useCallback(() => {
    removeDisplayActionById(action.id);
  }, [action.id, removeDisplayActionById]);

  return (
    <Paper elevation={2} sx={{ padding: 1, marginTop: 1 }}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="flex-start"
        sx={{ width: "100%" }}
      >
        <Box sx={{ flexGrow: 1 }}>
          <DisplayActionDisplay
            action={action}
            format={format}
            onChange={handleChange}
          />
        </Box>
        <Box
          sx={{
            height: 56,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Fab
            color="error"
            aria-label={removeText}
            onClick={handleRemove}
            size="small"
          >
            <DeleteIcon />
          </Fab>
        </Box>
      </Stack>
    </Paper>
  );
}, areDisplayActionRowsEqual);

export default memo(DisplayActionList);
