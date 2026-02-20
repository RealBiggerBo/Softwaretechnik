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
  maxId: number;
  onChange: (field: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
  //onAdd: (fieldToAdd: DataField) => void;
}

function ListDataField({
  listField,
  isEditMode,
  caller,
  maxId,
  onChange,
  setOpenDialog,
  //onAdd,
}: Props) {
  function duplicate(listField: ListField) {
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
      {!isEditMode &&
        listField.records.map((record, indexOuter) => (
          <>
            <DataRecordDisplay
              record={record}
              displayEditButtons={false} //always false here. We will display the editing somwhere else
              isEditMode={isEditMode} //same here
              caller={caller}
              onChange={(toChange) =>
                onChange({
                  ...listField,
                  records: listField.records.map((record, indexInner) =>
                    indexOuter == indexInner ? toChange : record,
                  ),
                })
              }
            />
            <StyledButton
              text="Eintrag löschen"
              color="error"
              onClick={() =>
                onChange({
                  ...listField,
                  records: listField.records.filter((r, i) => i !== indexOuter),
                })
              }
            />
          </>
        ))}
      {isEditMode && (
        <>
          <DataRecordDisplay
            record={listField.element}
            displayEditButtons={true}
            isEditMode={true}
            caller={caller}
            onChange={(toChange) =>
              onChange({
                ...listField,
                element: toChange,
                records: listField.records.map(() => toChange),
              })
            }
          />
        </>
      )}
      {isEditMode && (
        <AddNewDataField
          isEditMode={isEditMode}
          addNewField={(toAdd) => {
            const fieldToAdd: DataField = { ...toAdd, id: maxId + 1 };
            console.log("Added new dataField in List with id: " + maxId + 1);

            onChange({
              ...listField,
              element: { dataFields: [...listField.element.dataFields, toAdd] },
              records: listField.records.map((r) => {
                return { dataFields: [...r.dataFields, toAdd] };
              }),
            });
          }}
        />
      )}
      {!isEditMode && (
        <StyledButton
          text={text}
          size="small"
          variant="outlined"
          onClick={() => onChange(duplicate(listField))}
        />
      )}
    </Stack>
  );
}

export default memo(ListDataField);
