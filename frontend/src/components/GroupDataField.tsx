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

interface Props {
  groupField: GroupField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
}

function GroupDataField({
  groupField,
  isEditMode,
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
      {groupField.element.map((field) => (
        <FieldRenderer
          key={field.id}
          field={field}
          isEditMode={isEditMode}
          onChange={(toChange) =>
            onChange({
              ...groupField,
              element: groupField.element.map((field) =>
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
      ))}
      {/*<StyledButton text="List duplizieren" onClick={()=> duplucate(listField)}/>*/}
    </Stack>
  );
}

export default memo(GroupDataField);
