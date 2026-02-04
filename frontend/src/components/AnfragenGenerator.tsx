import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import { Checkbox, Button } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { DataRecord } from "../classes/DataRecord";
import type { DataField } from "../classes/DataField";
import { useSearchParams } from "react-router-dom";

interface Props {
  caller: IApiCaller;
}

function AnfragenGenerator({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function loadData() {
      const res = await caller.GetAnfrageJson();

      if (!res.success) {
        return;
      }
      let datarecord = DataRecordConverter.ConvertFormatToDataRecord(res.json);

      let id = parseInt(searchParams.get("id") ?? "", 10);

      if (!isNaN(id)) {
        const res2 = await caller.TrySearchAnfrageByID(id);

        if (!res2.success) {
          return;
        }

        datarecord = DataRecordConverter.MergeDataRecordWithData(
          datarecord,
          res2.json,
        );
      }
      setRecord(datarecord);
    }
    loadData();
  }, [caller]);

  async function Save() {
    if (!record) return;

    let id = parseInt(searchParams.get("id") ?? "", 10);
    if (!isNaN(id)) {
      const recordJson = DataRecordConverter.ConvertDataRecordToFormat(record);
      await caller.TryUpdateAnfrage(recordJson);
    }

    const recordJson = DataRecordConverter.ConvertDataRecordToFormat(record);
    await caller.TryCreateAnfrage(recordJson);
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

export default AnfragenGenerator;
