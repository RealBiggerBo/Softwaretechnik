import { Button, Checkbox, FormControlLabel } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import type { DataField } from "../classes/DataField";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { DataRecord } from "../classes/DataRecord";
import { useEffect, useState } from "react";


interface Props {
  caller: IApiCaller;
}

function LetzteAnfrage({ caller }: Props) {
    const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);

  useEffect(() => {
    async function loadData() {
        const res = await caller.GetAnfrageJson();

        if (!res.success) {
            return;
        }
        let datarecord = DataRecordConverter.ConvertFormatToDataRecord(res.json);
        const res2 = await caller.GetLastAnfrage();

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
    await caller.TryUpdateAnfrage(recordJson);
    
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

  return (
    <div>
      <h1>Hallo ich bin eine Anfrage</h1>
      <FormControlLabel
        control={
          <Checkbox
            checked={isEditMode}
            onChange={(e) => setIsEditMode(e.target.checked)}
          />
        }
        label={"Bearbeitungsmodus"}
      />
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
      <Button variant="contained" onClick={Save}>
        Speichern
      </Button>
    </div>
  );
}
export default LetzteAnfrage;