import { Button } from "@mui/material";
import type { DataRecord } from "../classes/DataRecord";
import type { UiItem } from "../classes/UiItems";
import type { DisplayAction } from "../classes/DisplayAction";
import DisplayActionDisplay from "./DisplayActionDisplay";

interface Props {
  displayActions: UiItem<DisplayAction>[];
  format: DataRecord;
  addText: string;
  removeText: string;
  updateDisplayAction: (
    optionToUpdate: UiItem<DisplayAction>,
    newOption: UiItem<DisplayAction>,
  ) => void;
  addNewDisplayAction: () => void;
  removeDisplayAction: (optionToRemove: UiItem<DisplayAction>) => void;
}

function DisplayActionList({
  displayActions,
  format,
  addText,
  removeText,
  updateDisplayAction,
  addNewDisplayAction,
  removeDisplayAction,
}: Props) {
  return (
    <>
      {displayActions.map((action, _) => (
        <div key={action.id}>
          <DisplayActionDisplay
            action={action}
            format={format}
            onChange={(newAction) => {
              updateDisplayAction(action, newAction);
            }}
          ></DisplayActionDisplay>
          <Button onClick={() => removeDisplayAction(action)}>
            {removeText}
          </Button>
        </div>
      ))}
      <br></br>
      <Button onClick={() => addNewDisplayAction()}>{addText}</Button>
    </>
  );
}

export default DisplayActionList;
