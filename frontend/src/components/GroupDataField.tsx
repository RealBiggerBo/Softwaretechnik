import { useState } from "react";
import {
  type DataField,
  type GroupField,
  type ListField,
} from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import AddFieldInList from "./AddFieldInList";
import AddNewDataField from "./AddNewDataField";
import StyledButton from "./Styledbutton";
import { FieldRenderer } from "./Fieldrenderer";
import { memo } from "react";
import DataRecordDisplay from "./DataRecordDisplay";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  groupField: GroupField;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (field: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
}

function GroupDataField({
  groupField,
  isEditMode,
  caller,
  onChange,
  setOpenDialog,
}: Props) {
  return (
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
        isEditMode={false} //same here
        caller={caller}
        onChange={(toChange) =>
          onChange({
            ...groupField,
            element: toChange,
          })
        }
      />
      {/* {groupField.element.dataFields.map((field) => (
        <DataRecordDisplay
          key={field.id}
          field={field}
          isEditMode={isEditMode}
          onChange={(toChange) =>
            onChange({
              ...groupField,
              element: groupField.element.dataFields.map((field) =>
                field.id === toChange.id ? toChange : field,
              ),
            })
          }
          onAdd={(toAdd) =>
            onChange({
              ...groupField,
              element: [...groupField.element, toAdd],
            })
          }
          onDelete={(toDelete) =>
            onChange({
              ...groupField,
              element: groupField.element.filter(
                (field) => field.id !== toDelete,
              ),
            })
          }
          setOpenDialog={setOpenDialog}
        />
      ))} */}
      {/*<StyledButton text="List duplizieren" onClick={()=> duplucate(listField)}/>*/}
    </Stack>
  );
}

export default memo(GroupDataField);
