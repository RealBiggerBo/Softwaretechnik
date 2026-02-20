import { Button } from "@mui/material";
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
      <br></br>
      <Button onClick={handleAdd}>{addText}</Button>
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
    <div>
      <DisplayActionDisplay
        action={action}
        format={format}
        onChange={handleChange}
      />
      <Button onClick={handleRemove}>{removeText}</Button>
    </div>
  );
}, areDisplayActionRowsEqual);

export default memo(DisplayActionList);
