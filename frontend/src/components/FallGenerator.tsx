import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import { Checkbox } from "@mui/material";
import { FormControlLabel } from "@mui/material";
import { Button } from "@mui/material";
import { DataRecord } from "../classes/DataRecord";
import type { DataField } from "../classes/DataField";

interface Props {
  caller: IApiCaller;
}

function FallGenerator({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);


  useEffect(() => {
    async function loadData() {
      const res = await caller.GetFallJson();

      if (res.success) {
        const datarecord = DataRecordConverter.ConvertFormatToDataRecord(
          res.json,
        );

        setRecord(datarecord);
      } else {
        console.error(res.errorMsg);
      }
    }
    loadData();
  }, [caller]);

  async function Save() {
    await caller.TryUpdateFall();
  }

  function handleFieldChange(updatedField: DataField) {
    if (!record) return;

    setRecord(
      new DataRecord(
        record.id,
        record.dataFields.map((f) =>
          f.id === updatedField.id ? updatedField : f,
        ),
      ),
    );
  }

  return (
    <div>
      <h1>Hallo ich bin ein Fall</h1>
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

export default FallGenerator;
