import type { DataField } from "../classes/DataField";
import type { DataRecord } from "../classes/DataRecord";
import type { IApiCaller } from "../classes/IApiCaller";
import AddNewDataField from "./AddNewDataField";
import { FieldRenderer } from "./Fieldrenderer";

interface Props {
  record: DataRecord;
  displayEditButtons: boolean;
  isEditMode: boolean;
  caller: IApiCaller;
  onChange: (record: DataRecord) => void;
}

function AddNewField(record: DataRecord, newField: DataField): DataRecord {
  const fieldWithId = {
    ...newField,
    id: record.dataFields[record.dataFields.length - 1].id + 1,
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
            onDelete={(idToRemove) => onChange(RemoveField(record, idToRemove))}
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
    </>
  );
}

export default DataRecordDisplay;
