import { useState } from "react";
import { type DataField, type ListField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import AddFieldInList from "./AddFieldInList";
import AddNewDataField from "./AddNewDataField";
import StyledButton from "./Styledbutton";
import { memo } from "react";
import DataRecordDisplay from "./DataRecordDisplay";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  listField: ListField;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (field: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
  onAdd: (fieldToAdd: DataField) => void;
}

function ListDataField({
  listField,
  isEditMode,
  caller,
  onChange,
  setOpenDialog,
  onAdd,
}: Props) {
  const [value, setValue] = useState("");
  const [touched, setTouched] = useState(false);
  const isError = touched && value.trim() === "" && listField.required;

  function duplucate(listField: ListField) {
    listField.records.push(listField.element);
    return listField;
  }

  const text: string = `${listField.name} hinzufügen`;
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
      {listField.records.map((record) => (
        <DataRecordDisplay
          record={record}
          displayEditButtons={false} //always false here. We will display the editing somwhere else
          isEditMode={false} //same here
          caller={caller}
          onChange={(toChange) =>
            onChange({
              ...listField,
              records: listField.records.map((record) =>
                record.dataFields == toChange.dataFields ? toChange : record,
              ),
            })
          }
        />
      ))}
      {!isEditMode && (
        <StyledButton
          text={text}
          size="small"
          variant="outlined"
          onClick={() => onChange(duplucate(listField))}
        />
      )}
      {/* <AddFieldInList
        listField={listField}
        isEditMode={isEditMode}
        onAdd={onAdd}
        onChange={(fieldToChange) =>
          onChange({
            ...listField,
            element: listField.element.map((field) =>
              field.id === fieldToChange.id ? fieldToChange : field,
            ),
          })
        }
        onDelete={(fieldIdToDelete) => {
          onChange({
            ...listField,
            element: listField.element.filter(
              (field) => field.id !== fieldIdToDelete,
            ),
          });
          setOpenDialog(true);
        }}
        setOpenDialog={setOpenDialog}
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
      /> */}
      {/*<StyledButton text="List duplizieren" onClick={()=> duplucate(listField)}/>*/}
    </Stack>
  );
}

export default memo(ListDataField);
