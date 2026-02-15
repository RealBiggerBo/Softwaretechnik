import { useSearchParams } from "react-router";
import type { IApiCaller } from "../classes/IApiCaller";
import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { DataRecord } from "../classes/DataRecord";
import { Button, Fab } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { DataField } from "../classes/DataField";
import DataRecordDisplay from "./DataRecordDisplay";

interface Props {
  caller: IApiCaller;
}

type dataRecordType =
  | "anfrage"
  | "letzte-anfrage"
  | "neue-anfrage"
  | "fall"
  | "letzter-fall"
  | "neuer-fall";
type userRole = "base_user" | "extended_user" | "admin_user" | null;

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

function GetDataRecordType(str: string | null) {
  switch (str) {
    case "neue-anfrage":
    case "anfrage":
    case "letzte-anfrage":
    case "fall":
    case "letzter-fall":
    case "neuer-fall":
      return str;
    default:
      alert("DEFUALT");
      return "anfrage";
  }
}

function GetDataRecordId(str: string | null) {
  const number = Number(str);
  return isNaN(number) ? -1 : number;
}

async function GetDataFormat(caller: IApiCaller, type: dataRecordType) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
    case "neue-anfrage":
      return await caller.GetAnfrageJson();
    case "fall":
    case "letzter-fall":
    case "neuer-fall":
      return await caller.GetFallJson();
  }
}

async function GetData(
  caller: IApiCaller,
  type: dataRecordType,
  id: number,
): Promise<{
  success: boolean;
  errorMsg: string;
  json: any;
}> {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      return await caller.TrySearchAnfrageByID(id);
    case "fall":
    case "letzter-fall":
      return await caller.TrySearchAnfrageByID(id);
    case "neue-anfrage":
    case "neuer-fall":
      return { success: true, errorMsg: "", json: "" };
  }
}

async function GetRole(
  caller: IApiCaller,
): Promise<"base_user" | "extended_user" | "admin_user" | null> {
  const res = await caller.GetCurrentUserRights();
  if (!res.success) return null;
  return res.json.role;
}

function hasRecordChanged(record1: DataRecord, record2: DataRecord): boolean {
  if (record1.dataFields.length !== record2.dataFields.length) {
    return true; // Feld hinzugefügt oder entfernt
  }

  for (let i = 0; i < record1.dataFields.length; i++) {
    const field1 = record1.dataFields[i];
    const field2 = record2.dataFields[i];

    if (field1.name !== field2.name) {
      return true; // Name geändert
    }
  }

  return false;
}

async function CreateNewDataRecord(
  type: dataRecordType,
  toSave: DataRecord,
  caller: IApiCaller,
) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      await caller.TryCreateNewDataRecordAnfrage(
        DataRecordConverter.ConvertDataRecordToFormat2(toSave),
      );
      break;
    case "fall":
    case "letzter-fall":
      await caller.TryCreateNewDataRecordFall(
        DataRecordConverter.ConvertDataRecordToFormat2(toSave),
      );
      break;
  }
}

async function UpdateDataRecord(
  type: dataRecordType,
  toUpdate: DataRecord,
  recordId: number,
  caller: IApiCaller,
) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      await caller.TryUpdateAnfrage(
        DataRecordConverter.ConvertDataRecordToFormat3(toUpdate),
        recordId,
      );
      break;
    case "fall":
    case "letzter-fall":
      await caller.TryUpdateFall(
        DataRecordConverter.ConvertDataRecordToFormat3(toUpdate),
        recordId,
      );
      break;
  }
}

async function Save(
  type: dataRecordType,
  recordId: number,
  recordToSave: DataRecord,
  lastSavedRecord: DataRecord,
  caller: IApiCaller,
) {
  if (!recordToSave) return false;

  if (hasRecordChanged(recordToSave, lastSavedRecord)) {
    //TODO: check whethere action succeeded => if not return false
    await CreateNewDataRecord(type, recordToSave, caller);
  }

  UpdateDataRecord(type, recordToSave, recordId, caller);

  return true;
}

async function handleSave(
  type: dataRecordType,
  recordId: number,
  recordToSave: DataRecord,
  lastSavedRecord: DataRecord,
  caller: IApiCaller,
  setLastSaved: (lastSaved: DataRecord) => void,
) {
  try {
    if (!GetDataRecordValidity(recordToSave)) return;
    alert("save");
    const result = await Save(
      type,
      recordId,
      recordToSave,
      lastSavedRecord,
      caller,
    );

    if (result) setLastSaved(recordToSave);
  } catch (err) {}
}

function DataRecordEditor({ caller }: Props) {
  const searchParams = useSearchParams();
  const type: dataRecordType = GetDataRecordType(searchParams[0].get("type"));
  const datRecordId: number = GetDataRecordId(searchParams[0].get("id"));

  const [role, setRole] = useState<userRole>(null);
  const [lastSavedRecord, setLastSavedRecord] = useState<DataRecord>({
    dataFields: [],
  });
  const [record, setRecord] = useState<DataRecord>({ dataFields: [] });
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    async function loadData() {
      //check login status
      const role = await GetRole(caller);
      if (!role) return;
      setRole(role);

      //Get format
      const formatRes = await GetDataFormat(caller, type);

      if (!formatRes.success) return;

      const format = DataRecordConverter.ConvertFormatToDataRecord(
        formatRes.json,
      );

      //Get data
      const dataRes = await GetData(caller, type, datRecordId);

      if (!dataRes.success) {
        return;
      }

      //merge data and data
      const datarecord = DataRecordConverter.MergeDataRecordWithData(
        format,
        dataRes.json,
      );
      setRecord(datarecord);
      setLastSavedRecord(datarecord);
    }
    loadData();
  }, [caller]);

  return (
    <div>
      <h1>
        {(type == "anfrage" ||
          type == "letzte-anfrage" ||
          type == "neue-anfrage") &&
          "Anfrageansicht"}
        {(type == "fall" || type == "letzter-fall" || type == "neuer-fall") &&
          "Fallansicht"}
      </h1>
      {role && role !== "base_user" && (
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
      <DataRecordDisplay
        record={record}
        displayEditButtons={role !== null && role !== "base_user"}
        isEditMode={isEditMode}
        caller={caller}
        onChange={setRecord}
      />
      <br />
      <Button
        variant="contained"
        onClick={() =>
          handleSave(
            type,
            datRecordId,
            record,
            lastSavedRecord,
            caller,
            setLastSavedRecord,
          )
        }
      >
        Speichern
      </Button>
      {/* <Snackbar
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
      </Dialog> */}
    </div>
  );
}

export default DataRecordEditor;
