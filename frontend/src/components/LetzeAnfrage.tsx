import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import {
  Alert,
  Button,
  Fab,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
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

function IsValid(field: DataField) {
  if (!field.required) return true;
  switch (field.type) {
    case "text":
      return (
        field.text.length > 0 &&
        (field.maxLength <= 0 || field.text.length <= field.maxLength)
      );
    case "date":
      return /^\d{4}-\d{2}-\d{2}$/.test(field.date);
    case "enum":
      return (
        field.possibleValues.filter((option) => option == field.selectedValue)
          .length > 0
      );
    case "integer":
      return (
        field.maxValue <= field.minValue ||
        (field.value <= field.maxValue && field.value >= field.minValue)
      );
    case "boolean":
      return true;
  }
}

function GetDataRecordValidity(record: DataRecord | null) {
  if (!record) {
    alert("Nichts zum Speichern");
    return false;
  }
  for (let i = 0; i < record.dataFields.length; i++) {
    const field = record.dataFields[i];
    if (!IsValid(field)) {
      alert("Fehler bei Feld: " + field.name);
      return false;
    }
  }
  return true;
}

function LetzteAnfrage({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);
  const [originalRecord, setOriginalRecord] = useState<DataRecord | null>(null);
  const [saveResult, setSaveResult] = useState<boolean | null>(null);
  const [anfrageId, setAnfrageId] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

      const r = await getRole();
      setRole(r);
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
      if (!GetDataRecordValidity(record)) return;

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
            onDelete={handleDelete}
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
            onDelete={handleDelete}
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
            onDelete={handleDelete}
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
            onDelete={handleDelete}
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

  async function getRole(): Promise<string> {
    const user = (await caller.GetCurrentUserRights()).json;
    const role = user["role"];
    return role;
  }

  function handleDelete() {
    if (!record || deleteId === null) return;

    setRecord({
      dataFields: record.dataFields.filter((f) => f.id !== deleteId),
    });

    setDeleteId(null);
    setOpenDeleteDialog(false);
  }

  function handleDeleteRequest(id: number) {
    setDeleteId(id);
    setOpenDeleteDialog(true);
  }

  function cancelDelete() {
    setDeleteId(null);
    setOpenDeleteDialog(false);
  }

  return (
    <div>
      <h1>Hallo ich bin eine Anfrage</h1>
      {role !== "base_user" && (
        <Fab
          color="primary"
          aria-label="edit"
          size="small"
          style={{ float: "right" }}
          onClick={() => setIsEditMode(!isEditMode)}
        >
          <EditIcon />
        </Fab>
      )}
      <br />
      {record?.dataFields.map((field) => (
        <div key={field.id}>
          <FieldRenderer
            field={field}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
            onDelete={handleDeleteRequest}
          />
          <br />
        </div>
      ))}
      <AddField
        caller={caller}
        handleCreateField={handleCreateField}
        isEditMode={!isEditMode}
      />
      {role !== "base_user" && (
        <AddField
          caller={caller}
          handleCreateField={handleCreateField}
          isEditMode={!isEditMode}
        />
      )}
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
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Feld löschen?</DialogTitle>
        <DialogContent>Möchten Sie dieses Feld wirklich löschen?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Abbrechen</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
export default LetzteAnfrage;
