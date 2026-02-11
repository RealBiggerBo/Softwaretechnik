import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import { Button, Fab } from "@mui/material";
import { DataRecord } from "../classes/DataRecord";
import { DateField, IntegerField, TextField, ToggleField, type DataField } from "../classes/DataField";
import EditIcon from '@mui/icons-material/Edit';
import AddField from "./AddField";
import ToggleDataField from "./ToggleDataField";
import IntegerDataField from "./IntegerDataField";
import DateDataField from "./DateDataField";
import TextDataField from "./TextDataField";


interface Props {
  caller: IApiCaller;
}

function LetzterFall({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);

  useEffect(() => {
    async function loadData() {
        const res = await caller.GetFallJson();

        if (!res.success) {
            return;
        }
        let datarecord = DataRecordConverter.ConvertFormatToDataRecord(res.json);
        const res2 = await caller.GetLastFall();

        if (!res2.success) {
          return;
        }

        datarecord = DataRecordConverter.MergeDataRecordWithData(
          datarecord,
          res2.json,
        );

      setRecord(datarecord);
    }
    loadData();
  }, [caller]);

  async function Save() {
    if (!record) return;

    const recordJson = DataRecordConverter.ConvertDataRecordToFormat(record);
    await caller.TryUpdateFall(recordJson);
    
    return;
  }

  function handleFieldChange(updatedField: DataField) {
    if (!record) return;
    setRecord(
      new DataRecord(
        record.dataFields.map((f) =>
          f.id === updatedField.id ? updatedField : f,
        ),
      ),
    );
  }

  function handleCreateField(type: string) {
    if (!record) return;
    const id = record.dataFields[record.dataFields.length - 1].id + 1;
    switch (type) {
        case "text":
            const newTextField = new TextField("neues Textfeld", id, false, "");
            setRecord(
              new DataRecord([...record.dataFields, newTextField]),
            );
            return <TextDataField textField={newTextField} isEditMode={isEditMode} onChange={handleFieldChange}/>
        case "date":
            const newDateField = new DateField("neues Datumsfeld", id, false, "");
            setRecord(
              new DataRecord([...record.dataFields, newDateField]),
            );
            return <DateDataField dateField={newDateField} isEditMode={isEditMode} onChange={handleFieldChange}/>;
        case "integer":
            const newIntegerField = new IntegerField("neues Integerfeld", id, false, 0);
            setRecord(
              new DataRecord([...record.dataFields, newIntegerField]),
            );
            return <IntegerDataField integerField={newIntegerField} isEditMode={isEditMode} onChange={handleFieldChange}/>;
        case "toggle":
            const newToggleField = new ToggleField("neues Togglefeld", id, false, false);
            setRecord(
              new DataRecord([...record.dataFields, newToggleField]),
            );
            return <ToggleDataField toggleField={newToggleField} isEditMode={isEditMode} onChange={handleFieldChange}/>;
        default:
            return null;
    }
  }

  return (
    <div>
      <h1>Hallo ich bin ein Fall</h1>
      <Fab color="primary" aria-label="edit" size="small" style={{ float: "right" }} onClick={() => setIsEditMode(!isEditMode)}>
        <EditIcon/>
      </Fab>
      <br />
      <br />
      {record?.dataFields.map((field) => (
        <div key={field.id}>
          <FieldRenderer
            field={field}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
          <br />
        </div>
      ))}
      <AddField caller={caller} handleCreateField={handleCreateField} isEditMode={!isEditMode} />
      <br />
      <Button variant="contained" onClick={Save}>
        Speichern
      </Button>
    </div>
  );
}
export default LetzterFall;