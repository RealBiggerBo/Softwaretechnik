import { useState } from "react";
import type { DataField } from "../classes/DataField";
import type { DataRecord } from "../classes/DataRecord";
import type { IApiCaller } from "../classes/IApiCaller";
import AddNewDataField from "./AddNewDataField";
import { FieldRenderer } from "./Fieldrenderer";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import StyledButton from "./Styledbutton";

interface Props {
  record: DataRecord;
  displayEditButtons: boolean;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (record: DataRecord) => void;
}

function AddNewField(record: DataRecord, newField: DataField): DataRecord {
  if (record === null) {
    return { dataFields: [] };
  }
  let id;
  if (record.dataFields.length === 0) {
    id = 1;
  } else {
    id = record.dataFields[record.dataFields.length - 1].id + 1;
  }

  const fieldWithId = {
    ...newField,
    id,
  };
  return { ...record, dataFields: [...record.dataFields, fieldWithId] };
}

function UpdateField(
  record: DataRecord,
  fieldToUpdate: DataField,
  newField: DataField,
): DataRecord {
  return {
    ...record,
    dataFields: record.dataFields.map((field) =>
      field.id == fieldToUpdate.id ? newField : field,
    ),
  };
}

function RemoveField(record: DataRecord, idToRemove: number): DataRecord {
  return {
    ...record,
    dataFields: record.dataFields.filter((field) => field.id !== idToRemove),
  };
}

function DataRecordDisplay({
  record,
  displayEditButtons,
  isEditMode,
  onChange,
}: Props) {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<DataField | null>(null);

  const handleDeleteClick = (field: DataField) => {
    setFieldToDelete(field);
    setOpenDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (fieldToDelete) {
      onChange(RemoveField(record, fieldToDelete.id));
    }
    setOpenDeleteDialog(false);
    setFieldToDelete(null);
  };

  const cancelDelete = () => {
    setOpenDeleteDialog(false);
    setFieldToDelete(null);
  };

  return (
    <>
      {record?.dataFields.map((field) => (
        <div key={field.id}>
          <FieldRenderer
            field={field}
            isEditMode={isEditMode}
            onChange={(toUpdate) =>
              onChange(UpdateField(record, field, toUpdate))
            }
            onDelete={() => handleDeleteClick(field)}
          />
          <br />
        </div>
      ))}
      {displayEditButtons && (
        <AddNewDataField
          isEditMode={isEditMode}
          addNewField={(newField) => onChange(AddNewField(record, newField))}
        />
      )}

      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Feld löschen?</DialogTitle>
        <DialogContent>
          Möchten Sie das Feld "{fieldToDelete?.name}" wirklich löschen?
        </DialogContent>
        <DialogActions>
          <StyledButton onClick={cancelDelete} text="Abbrechen" />
          <StyledButton color="error" onClick={confirmDelete} text="Löschen" />
        </DialogActions>
      </Dialog>
    </>
  );
}

export default DataRecordDisplay;
