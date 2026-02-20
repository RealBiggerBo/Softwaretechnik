import React from "react";
import { type DataField, type ListField } from "../classes/DataField";
import { FieldRenderer } from "./Fieldrenderer";
import type { IApiCaller } from "../classes/IApiCaller";

interface Props {
  listField: ListField;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (field: DataField) => void;
  onDelete: (id: number) => void;
  onAdd: (id: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
}

function AddFieldInList({
  listField,
  isEditMode,
  caller,
  onChange,
  onDelete,
  onAdd,
  setOpenDialog,
}: Props) {
  return (
    <>
      <label>NOT IMPLEMENTED</label>
      {/* {listField.element.map((e) => (
        <React.Fragment key={e.id}>
          <FieldRenderer
            caller={caller}
            field={e}
            isEditMode={isEditMode}
            onChange={onChange}
            onDelete={onDelete}
            onAdd={onAdd}
            setOpenDialog={setOpenDialog}
          />
          <br />
        </React.Fragment>
      ))} */}
    </>
  );
}
export default AddFieldInList;
