import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import { Alert, Button, Fab, Snackbar } from "@mui/material";
import { type DataRecord } from "../classes/DataRecord";
import {
  type DataField,
  type DateField,
  type IntegerField,
  type TextField,
  type ToggleField,
} from "../classes/DataField";
import EditIcon from "@mui/icons-material/Edit";
import AddField from "./AddField";
import ToggleDataField from "./ToggleDataField";
import IntegerDataField from "./IntegerDataField";
import DateDataField from "./DateDataField";
import TextDataField from "./TextDataField";

interface Props {
  caller: IApiCaller;
}

function LetzteAnfrage({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);
  const [originalRecord, setOriginalRecord] = useState<DataRecord | null>(null);
  const [saveResult, setSaveResult] = useState<boolean | null>(null);
  const [anfrageId, setAnfrageId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
      const res = await caller.GetAnfrageJson();

      if (!res.success) {
        return;
      }

      setAnfrageId(res.json.id);

      let datarecord = DataRecordConverter.ConvertFormatToDataRecord(res.json);
      const res2 = await caller.GetLastAnfrage();

      if (!res2.success) {
        return;
      }
      if (!res2.success) {
        return;
      }

      datarecord = DataRecordConverter.MergeDataRecordWithData(
        datarecord,
        res2.json,
      );
      datarecord = DataRecordConverter.MergeDataRecordWithData(
        datarecord,
        res2.json,
      );

      setRecord(datarecord);
      setOriginalRecord(structuredClone(datarecord));
    }
    loadData();
  }, [caller]);

  async function Save() {
    if (!record) return false;

    if (hasRecordChanged()) {
      await caller.TryCreateNewDataRecordAnfrage(
        DataRecordConverter.ConvertDataRecordToFormat2(record),
      );
    }

    const recordJson = DataRecordConverter.ConvertDataRecordToFormat3(record);
    if (anfrageId == null) {
      return false;
    }
    await caller.TryUpdateAnfrage(recordJson, anfrageId);

    return true;
  }

  async function handleSave() {
    try {
      const result = await Save();
      setSaveResult(result);
    } catch (err) {
      setSaveResult(false);
    }
  }

  function handleFieldChange(updatedField: DataField) {
    if (!record) return;
    setRecord({
      dataFields: record.dataFields.map((f) =>
        f.id === updatedField.id ? updatedField : f,
      ),
    });
  }

  function handleCreateField(type: string) {
    if (!record) return;
    const id = record.dataFields[record.dataFields.length - 1].id + 1;
    switch (type) {
      case "text":
        const newTextField: TextField = {
          type: "text",
          name: "neues Textfeld",
          id: id,
          required: false,
          text: "",
          maxLength: -1,
        };
        setRecord({ dataFields: [...record.dataFields, newTextField] });
        return (
          <TextDataField
            textField={newTextField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "date":
        const newDateField: DateField = {
          type: "date",
          name: "neues Datumsfeld",
          id: id,
          required: false,
          date: "",
        };
        setRecord({ dataFields: [...record.dataFields, newDateField] });
        return (
          <DateDataField
            dateField={newDateField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "integer":
        const newIntegerField: IntegerField = {
          type: "integer",
          name: "neues Integerfeld",
          id: id,
          required: false,
          value: 0,
          minValue: -1,
          maxValue: 0,
        };
        setRecord({ dataFields: [...record.dataFields, newIntegerField] });
        return (
          <IntegerDataField
            integerField={newIntegerField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "toggle":
        const newToggleField: ToggleField = {
          type: "boolean",
          name: "neues Togglefeld",
          id: id,
          required: false,
          isSelected: false,
        };
        setRecord({ dataFields: [...record.dataFields, newToggleField] });
        return (
          <ToggleDataField
            toggleField={newToggleField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  }

  function hasRecordChanged(): boolean {
    if (!record || !originalRecord) return false;

    if (record.dataFields.length !== originalRecord.dataFields.length) {
      return true; // Feld hinzugefügt oder entfernt
    }

    for (let i = 0; i < record.dataFields.length; i++) {
      const current = record.dataFields[i];
      const original = originalRecord.dataFields[i];

      if (current.name !== original.name) {
        return true; // Name geändert
      }
    }

    return false;
  }

  return (
    <div>
      <h1>Hallo ich bin eine Anfrage</h1>
      <Fab
        color="primary"
        aria-label="edit"
        size="small"
        style={{ float: "right" }}
        onClick={() => setIsEditMode(!isEditMode)}
      >
        <EditIcon />
      </Fab>
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
      <AddField
        caller={caller}
        handleCreateField={handleCreateField}
        isEditMode={!isEditMode}
      />
      <AddField
        caller={caller}
        handleCreateField={handleCreateField}
        isEditMode={!isEditMode}
      />
      <br />
      <Button variant="contained" onClick={handleSave}>
        Speichern
      </Button>
      <Snackbar
        open={saveResult !== null}
        autoHideDuration={3000}
        onClose={() => setSaveResult(null)}
      >
        <Alert
          severity={saveResult ? "success" : "error"}
          onClose={() => setSaveResult(null)}
        >
          {saveResult ? "Speichern erfolgreich!" : "Speichern fehlgeschlagen!"}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default LetzteAnfrage;
