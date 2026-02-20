import { useCallback, useRef, useState } from "react";
import type { DataField } from "../classes/DataField";
import type { DataRecord } from "../classes/DataRecord";
import type { IApiCaller } from "../classes/IApiCaller";
import AddNewDataField from "./AddNewDataField";
import { FieldRenderer } from "./Fieldrenderer";
import DialogComponent from "./DialogComponent";
import type { DialogObject } from "./DialogComponent";

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
    id = Math.max(...record.dataFields.map((f) => f.id)) + 1;
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
  caller,
  onChange,
}: Props) {
  const recordRef = useRef(record);
  recordRef.current = record;
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<DataField | null>(null);
  const [msg, setmg] = useState("");

  const handleFieldChange = useCallback(
    (updatedField: DataField) => {
      onChange(UpdateField(recordRef.current, updatedField, updatedField));
    },
    [onChange],
  );

  const handleAddField = useCallback(
    (newField: DataField) => {
      onChange(AddNewField(recordRef.current, newField));
    },
    [onChange],
  );

  const handleRemoveField = useCallback(
    (idToRemove: number) => {
      onChange(RemoveField(recordRef.current, idToRemove));
    },
    [onChange],
  );

  const handleDeleteRequest = useCallback((fieldId: number) => {
    const currentRecord = recordRef.current;
    const field = currentRecord.dataFields.find((f) => f.id === fieldId);
    if (!field) return;
    setmg(`Möchten Sie das Feld "${field.name}" wirklich löschen?`);
    setFieldToDelete(field);
    setOpenDeleteDialog(true);
  }, []);

  const dialogDelete: DialogObject = {
    isOpen: openDeleteDialog,
    title: "Feld löschen?",
    body: msg,
    yes: "Löschen",
    no: "Abbrechen",
    yesAction: async () => {
      confirmDelete();
    },
    noAction: async () => {
      cancelDelete();
    },
  };

  const confirmDelete = () => {
    if (fieldToDelete) {
      handleRemoveField(fieldToDelete.id);
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
            caller={caller}
            onChange={handleFieldChange}
            onAdd={handleAddField}
            onDelete={handleDeleteRequest}
            setOpenDialog={setOpenDeleteDialog}
          />
          <br />
        </div>
      ))}
      {displayEditButtons && (
        <AddNewDataField
          isEditMode={isEditMode}
          addNewField={handleAddField}
        />
      )}

      <DialogComponent dialogObject={dialogDelete} />
    </>
  );
}

export default DataRecordDisplay;
