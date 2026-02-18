import React from "react";
import { type DataField, type ListField } from "../classes/DataField";
import { FieldRenderer } from "./Fieldrenderer";

interface Props {
  listField: ListField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  onDelete: (id: number) => void;
  onAdd: (id: DataField) => void;
  setOpenDialog: (showDialog: boolean) => void;
}

function AddFieldInList({
  listField,
  isEditMode,
  onChange,
  onDelete,
  onAdd,
  setOpenDialog,
}: Props) {
  return (
    <>
      {listField.element.map((e) => (
        <React.Fragment key={e.id}>
          <FieldRenderer
            field={e}
            isEditMode={isEditMode}
            onChange={onChange}
            onDelete={onDelete}
            onAdd={onAdd}
            setOpenDialog={setOpenDialog}
          />
          <br />
        </React.Fragment>
      ))}
    </>
  );
}
export default AddFieldInList;
