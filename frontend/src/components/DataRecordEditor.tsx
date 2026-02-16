import { useNavigate, useSearchParams } from "react-router";
import type { IApiCaller } from "../classes/IApiCaller";
import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { DataRecord } from "../classes/DataRecord";
import { Alert, Button, Fab, Snackbar } from "@mui/material";
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

// check if datafield is required and valid
// if it's not required, return true, otherwise check if it's valid based on its type and return the result
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

// check if datarecord is valid
// if it's valid, all required fields are filled out correctly, otherwise alert which field is not valid
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

// get datarecord type based on url param, if type is invalid, alert and return default type "anfrage"
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

//convert string to number, if it's not a number return -1
function GetDataRecordId(str: string | null) {
  const number = Number(str);
  return isNaN(number) ? -1 : number;
}

// get datarecord format based on type
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

// get datarecord based on type and id, if type is "neue-anfrage" or "neuer-fall", return empty datarecord
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

// get user role, if not logged in return null
async function GetRole(
  caller: IApiCaller,
): Promise<"base_user" | "extended_user" | "admin_user" | null> {
  const res = await caller.GetCurrentUserRights();
  if (!res.success) return null;
  return res.json.role;
}

// check if two datarecords are different
// if they have different number of fields or at least one field has a different name, return true, otherwise return false
function hasRecordChanged(record1: DataRecord, record2: DataRecord): boolean {
  if (!record1 || !record2) return false;

  if (record1.dataFields.length !== record2.dataFields.length) {
    return true; // Feld hinzugefügt oder entfernt (unterschiedlich viele Felder)
  }

  const record1ids = record1.dataFields.map((field) => field.id);
  const record2ids = record2.dataFields.map((field) => field.id);

  for (let i = 0; i < record1ids.length; i++) {
    if (record1ids[i] !== record2ids[i]) {
      return true; // überprüft ob alle ids gleich sind (z.B. ein Feld hinzugefügt und entfernt => eine id zwischendrin fehlt, aber Anzahl der Felder gleich))
    }
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

// post new datarecord structure based on type
async function CreateNewDataRecord(
  type: dataRecordType,
  toSave: DataRecord,
  caller: IApiCaller,
) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      let suc = (
        await caller.TryCreateNewDataRecordAnfrage(
          DataRecordConverter.ConvertDataRecordToFormat2(toSave),
        )
      ).success;
      return suc;
    case "fall":
    case "letzter-fall":
      suc = (
        await caller.TryCreateNewDataRecordFall(
          DataRecordConverter.ConvertDataRecordToFormat2(toSave),
        )
      ).success;
      return suc;
  }
}

// update datarecord if existing ,based on type and id
async function UpdateDataRecord(
  type: dataRecordType,
  toUpdate: DataRecord,
  recordId: number,
  caller: IApiCaller,
): Promise<boolean> {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      return (
        await caller.TryUpdateAnfrage(
          DataRecordConverter.ConvertDataRecordToFormat3(toUpdate),
          recordId,
        )
      ).success;
    case "fall":
    case "letzter-fall":
      return (
        await caller.TryUpdateFall(
          DataRecordConverter.ConvertDataRecordToFormat3(toUpdate),
          recordId,
        )
      ).success;
  }
  return false;
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
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState<boolean | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
        dataRes.json["values"],
      );
      setRecord(datarecord);
      setLastSavedRecord(datarecord);
    }
    loadData();
  }, [caller]);

  //saves the datarecord
  async function Save(
    type: dataRecordType,
    recordId: number,
    recordToSave: DataRecord,
    lastSavedRecord: DataRecord,
    caller: IApiCaller,
  ): Promise<{ success: boolean; snackbar: void }> {
    //wenn es keinen record zum speichern gibt, snackbar öffnen und abbrechen
    if (!recordToSave)
      return {
        success: false,
        snackbar: openSnackbar("Nichts zum Speichern!", false),
      };

    let succhanged: boolean | undefined = false;
    let sucsaved: boolean | undefined = false;
    let res: { success: boolean; errorMsg: string; json: any };
    let saveid: number = -1;
    const navigate = useNavigate();

    // wenn sich die Stuktur geändert hat, neue Struktur an backend schicken und return wenn nicht erfolgreich
    if (hasRecordChanged(recordToSave, lastSavedRecord)) {
      succhanged = await CreateNewDataRecord(type, recordToSave, caller);
      if (succhanged === undefined || succhanged === false)
        return {
          success: false,
          snackbar: openSnackbar(
            "Neue Struktur konnte nicht gespeichert werden!",
            false,
          ),
        };
    }

    //wenn die Struktur erfolgreich geändert wurde, snackbar öffnen
    if (succhanged === true) {
      openSnackbar("Strukturänderung erfolgreich gespeichert!", true);
    }

    //neue Anfrage estellen, snackbar öffnen und url ändern
    if (type === "neue-anfrage") {
      const rectosaavejson =
        DataRecordConverter.ConvertDataRecordToFormat3(recordToSave);
      res = await caller.TryCreateAnfrage(rectosaavejson);
      sucsaved = res.success;
      saveid = Number(res.json["pk"]);
      if (sucsaved === undefined || sucsaved === false) {
        return {
          success: false,
          snackbar: openSnackbar(
            "Anfrage konnte nicht gespeichert werden!",
            false,
          ),
        };
      }
      if (sucsaved === true) {
        navigate(`/anfrage?id=${saveid}`, { replace: true });
        return {
          success: true,
          snackbar: openSnackbar("Anfrage erfolgreich gespeichert!", true),
        };
      }
    }

    //neuen Fall erstellen, snackbar öffnen und url ändern
    if (type === "neuer-fall") {
      const rectosaavejson =
        DataRecordConverter.ConvertDataRecordToFormat3(recordToSave);
      res = await caller.TryCreateFall(rectosaavejson);
      sucsaved = res.success;
      saveid = Number(res.json["pk"]);
      if (sucsaved === undefined || sucsaved === false) {
        return {
          success: false,
          snackbar: openSnackbar(
            "Fall konnte nicht gespeichert werden!",
            false,
          ),
        };
      }
      if (sucsaved === true) {
        navigate(`/fall?id=${saveid}`, { replace: true });
        return {
          success: true,
          snackbar: openSnackbar("Fall erfolgreich gespeichert!", true),
        };
      }
    }

    //wenn es eine bestehende Anfrage oder Fall ist, update versuchen und snackbar öffnen
    if (
      (await UpdateDataRecord(type, recordToSave, recordId, caller)) === true
    ) {
      return {
        success: true,
        snackbar: openSnackbar("Datensatz erfolgreich aktualisiert!", true),
      };
    } else {
      return {
        success: false,
        snackbar: openSnackbar(
          "Datensatz konnte nicht aktualisiert werden!",
          false,
        ),
      };
    }
  }

  //handles save
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
      const result = await Save(
        type,
        recordId,
        recordToSave,
        lastSavedRecord,
        caller,
      );

      if (result.success) setLastSaved(recordToSave);
    } catch (err) {}
  }

  //opens snackbar with message and success sets color of snackbar
  function openSnackbar(message: string, success: boolean) {
    setSnackbarOpen(true);
    setSnackbarMessage(message);
    setSaveResult(success);
  }

  function deletable() {
    if (datRecordId && isEditMode) return true;
    else return false;
  }

  async function handleDeleteRecord() {
    const navigate = useNavigate();
    const suc = (await caller.TryDeleteAnfrage(datRecordId)).success;
    if (suc) {
      openSnackbar(`${type} wurde erfolgreich gelöscht.`, suc);
      navigate("/main");
    }
    openSnackbar(`${type} konnte nicht gelöscht werden`, suc);
  }

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
      {deletable() && (
        <Button variant="contained" color="error" onClick={handleDeleteRecord}>
          Datensatz löschen
        </Button>
      )}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          severity={saveResult ? "success" : "error"}
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {/*<Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>Feld löschen?</DialogTitle>
        <DialogContent>Möchten Sie dieses Feld wirklich löschen?</DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Abbrechen</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Löschen
          </Button>
        </DialogActions>
      </Dialog>*/}
    </div>
  );
}

export default DataRecordEditor;
