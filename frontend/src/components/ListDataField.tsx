import { useState } from "react";
import { type DataField, type ListField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import AddFieldInList from "./AddFieldInList";
import AddNewDataField from "./AddNewDataField";
import StyledButton from "./Styledbutton";

interface Props {
  listField: ListField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  onDelete: (id: number) => void;
  onAdd: (fieldToAdd: DataField) => void;
}

function ListDataField({
  listField,
  isEditMode,
  onChange,
  onDelete,
  onAdd,
}: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isError = touched && value.trim() === "" && listField.required;

  /*function duplucate(listField: ListField){

  }*/

  return (
    <Stack direction="column" spacing={2} alignItems="left">
      {!isEditMode && (
        <>
          <label>{listField.name}</label>
          <br />
        </>
      )}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({ ...listField, name: e.target.value });
          }}
          value={listField.name}
        ></Tf>
      )}
      <AddFieldInList
        listField={listField}
        isEditMode={isEditMode}
        onAdd={onAdd}
        onChange={onChange}
        onDelete={onDelete}
      />
      <br />
      <AddNewDataField
        isEditMode={true}
        addNewField={(newField) =>
          onChange({
            ...listField,
            element: [...listField.element, newField],
          })
        }
      />
      {/*<StyledButton text="List duplizieren" onClick={()=> duplucate(listField)}/>*/}
    </Stack>
  );
}

export default ListDataField;
