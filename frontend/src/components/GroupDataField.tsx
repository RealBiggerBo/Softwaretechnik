import { type DataField, type GroupField } from "../classes/DataField";
import { Box, Stack, TextField as Tf } from "@mui/material";
import { memo } from "react";
import DataRecordDisplay from "./DataRecordDisplay";
import type { IApiCaller } from "../classes/IApiCaller";
import AddNewDataField from "./AddNewDataField";

interface Props {
  groupField: GroupField;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (field: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
  onAdd: (fieldToAdd: DataField) => void;
}

function GroupDataField({
  groupField,
  isEditMode,
  caller,
  onChange,
  setOpenDialog,
  onAdd,
}: Props) {
  function handleAddField() {}

  return (
    <Box>
      <Stack direction="column" spacing={2} alignItems="left">
        {!isEditMode && (
          <>
            <label>{groupField.name}</label>
            <br />
          </>
        )}
        {isEditMode && (
          <Tf
            type="text"
            onChange={(e) => {
              onChange({ ...groupField, name: e.target.value });
            }}
            value={groupField.name}
          ></Tf>
        )}
        <DataRecordDisplay
          record={groupField.element}
          displayEditButtons={false} //always false here. We will display the editing somwhere else
          isEditMode={isEditMode} //same here
          caller={caller}
          onChange={(toChange) =>
            onChange({
              ...groupField,
              element: toChange,
            })
          }
        />
        {isEditMode && (
          <AddNewDataField isEditMode={isEditMode} addNewField={onAdd} />
        )}
      </Stack>
    </Box>
  );
}

export default memo(GroupDataField);
