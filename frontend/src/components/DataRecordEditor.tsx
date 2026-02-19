import { useNavigate, useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { DataRecord } from "../classes/DataRecord";
import {
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Fab,
  Snackbar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { DataField } from "../classes/DataField";
import DataRecordDisplay from "./DataRecordDisplay";
import StyledButton from "./Styledbutton";

interface Props {
  caller: IApiCaller;
  savedData: React.RefObject<boolean>;
  savedFormat: React.RefObject<boolean>;
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
function IsValid(field: DataField): boolean {
  if (!field.required) return true;
  switch (field.type) {
    case "text":
      return field.text.length > 0;
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
    case "list":
    case "group":
      return field.element.every((field) => IsValid(field));
    default:
      const _exhaustive: never = field;
      return _exhaustive;
  }
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
  formatVersion: number,
  caller: IApiCaller,
): Promise<boolean> {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      return (
        await caller.TryUpdateAnfrage(
          DataRecordConverter.ConvertDataRecordToFormat3(
            "Anfrage",
            formatVersion,
            toUpdate,
          ),
          recordId,
        )
      ).success;
    case "fall":
    case "letzter-fall":
      return (
        await caller.TryUpdateFall(
          DataRecordConverter.ConvertDataRecordToFormat3(
            "Fall",
            formatVersion,
            toUpdate,
          ),
          recordId,
        )
      ).success;
  }
  return false;
}

function DataRecordEditor({ caller, savedData, savedFormat }: Props) {
  const [searchParams] = useSearchParams();
  const type: dataRecordType = GetDataRecordType(searchParams.get("type"));
  const datRecordId: number = GetDataRecordId(searchParams.get("id"));

  const [role, setRole] = useState<userRole>(null);
  const [lastSavedRecord, setLastSavedRecord] = useState<DataRecord>({
    dataFields: [],
  });
  const [record, setRecord] = useState<DataRecord>({ dataFields: [] });
  const [isEditMode, setIsEditMode] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState<boolean | null>(null);
  const [formatVersion, setFormatVersion] = useState<number>(-1);
  const [msg, setmg] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [msgField, setmgField] = useState("");
  const [openFieldDialog, setOpenFieldDialog] = useState(false);

  const navigate = useNavigate();

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    async function loadData() {
      //check login status
      const role = await GetRole(caller);
      if (!role) return;
      setRole(role);

      //Get format
      const formatRes = await GetDataFormat(caller, type);

      if (!formatRes.success) return;

      const [version, format] = DataRecordConverter.ConvertFormatToDataRecord(
        formatRes.json,
      );
      setFormatVersion(version);

      if (type !== "neue-anfrage" && type !== "neuer-fall") {
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
        setLastSavedRecord(structuredClone(datarecord));
        return;
      }
      setLastSavedRecord(structuredClone(format));
      setRecord(format);
    }
    loadData();
  }, [caller, type, datRecordId]);

  //saves the datarecord
  async function Save(
    type: dataRecordType,
    recordId: number,
    recordToSave: DataRecord,
    lastSavedRecord: DataRecord,
    caller: IApiCaller,
  ): Promise<{ success: boolean }> {
    //wenn es keinen record zum speichern gibt, snackbar öffnen und abbrechen
    if (!recordToSave) {
      openSnackbar("Nichts zum Speichern!", false);
      return { success: false };
    }

    let succhanged: boolean | undefined = false;
    let sucsaved: boolean | undefined = false;
    let res: { success: boolean; errorMsg: string; json: any };
    let saveid: number = -1;

    // wenn sich die Stuktur geändert hat, neue Struktur an backend schicken und return wenn nicht erfolgreich
    if (!savedFormat.current) {
      succhanged = await CreateNewDataRecord(type, recordToSave, caller);
      if (succhanged === undefined || succhanged === false) {
        openSnackbar("Neue Struktur konnte nicht gespeichert werden!", false);
        return { success: false };
      }
    }

    //wenn die Struktur erfolgreich geändert wurde, snackbar öffnen
    if (succhanged === true) {
      openSnackbar("Strukturänderung erfolgreich gespeichert!", true);
    }

    //neue Anfrage estellen, snackbar öffnen und url ändern
    if (type === "neue-anfrage") {
      const rectosaavejson = DataRecordConverter.ConvertDataRecordToFormat3(
        "Anfrage",
        formatVersion,
        recordToSave,
      );
      res = await caller.TryCreateAnfrage(rectosaavejson);
      sucsaved = res.success;
      saveid = Number(res.json["pk"]);
      if (sucsaved === undefined || sucsaved === false) {
        openSnackbar("Anfrage konnte nicht gespeichert werden!", false);
        return { success: false };
      }
      if (sucsaved === true) {
        openSnackbar("Anfrage erfolgreich gespeichert!", true);
        await sleep(1500);
        navigate(`?type=anfrage?id=${saveid}`, { replace: true });
        await setLast(saveid, type);
        return { success: true };
      }
    }

    //neuen Fall erstellen, snackbar öffnen und url ändern
    if (type === "neuer-fall") {
      const rectosaavejson = DataRecordConverter.ConvertDataRecordToFormat3(
        "Fall",
        formatVersion,
        recordToSave,
      );
      res = await caller.TryCreateFall(rectosaavejson);
      sucsaved = res.success;
      saveid = Number(res.json["pk"]);
      if (sucsaved === undefined || sucsaved === false) {
        openSnackbar("Fall konnte nicht gespeichert werden!", false);
        return { success: false };
      }
      if (sucsaved === true) {
        openSnackbar("Fall erfolgreich gespeichert!", true);
        await sleep(1500);
        navigate(`?type=fall?id=${saveid}`, { replace: true });
        await setLast(saveid, type);
        return { success: true };
      }
    }

    //wenn es eine bestehende Anfrage oder Fall ist, update versuchen und snackbar öffnen
    if (!savedData) {
      if (
        (await UpdateDataRecord(
          type,
          recordToSave,
          recordId,
          formatVersion,
          caller,
        )) === true
      ) {
        openSnackbar("Datensatz erfolgreich aktualisiert!", true);
        await setLast(recordId, type);
        return { success: true };
      } else {
        openSnackbar("Datensatz konnte nicht aktualisiert werden!", false);
        return { success: false };
      }
    } else {
      return { success: true };
    }
  }

  //sets last changed Anfrage/Fall
  async function setLast(id: number, type: dataRecordType) {
    if (
      type === "anfrage" ||
      type === "letzte-anfrage" ||
      type === "neue-anfrage"
    ) {
      await caller.SetLastAnfrage(id);
      return;
    }
    if (type === "fall" || type === "letzter-fall" || type === "neuer-fall") {
      await caller.SetLastFall(id);
      return;
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

      if (result.success) {
        savedData.current = true;
        savedFormat.current = true;
        setLastSaved(recordToSave);
      }
    } catch (err) {
      alert(err);
    }
  }

  //opens snackbar with message and success sets color of snackbar
  function openSnackbar(message: string, success: boolean) {
    setSnackbarOpen(true);
    setSnackbarMessage(message);
    setSaveResult(success);
    return;
  }

  // check if datarecord is valid
  // if it's valid, all required fields are filled out correctly, otherwise alert which field is not valid
  function GetDataRecordValidity(record: DataRecord | null) {
    if (!record) {
      openSnackbar("Nichts zum Speichern", false);
      return false;
    }
    for (let i = 0; i < record.dataFields.length; i++) {
      const field = record.dataFields[i];
      if (!IsValid(field)) {
        setOpenFieldDialog(true);
        setmgField("Fehler bei Feld: " + field.name);
        //alert("Fehler bei Feld: " + field.name);
        return false;
      }
    }
    return true;
  }

  function deletable() {
    if (datRecordId) return true;
    else return false;
  }

  async function handleDeleteRecord() {
    const suc = (await caller.TryDeleteAnfrage(datRecordId)).success;
    if (suc) {
      openSnackbar(`${type} wurde erfolgreich gelöscht.`, suc);
      navigate("/main");
    } else {
      openSnackbar(`${type} konnte nicht gelöscht werden`, suc);
    }
  }

  function cancelDelete() {
    setOpenDeleteDialog(false);
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
        onChange={(record) => {
          if (isEditMode) {
            savedFormat.current = false;
          } else {
            savedData.current = false;
          }
          setRecord(record);
        }}
      />
      <br />
      {deletable() && (
        <StyledButton
          text="Datensatz löschen"
          color="error"
          onClick={() => {
            setOpenDeleteDialog(true);
            setmg("Wollen Sie diesen Datensatz wirklich löschen?");
          }}
        />
      )}
      <StyledButton
        text="Speichern"
        onClick={async () =>
          await handleSave(
            type,
            datRecordId,
            record,
            lastSavedRecord,
            caller,
            setLastSavedRecord,
          )
        }
      />
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
      {/*Dialog zum record löschen */}
      <Dialog open={openDeleteDialog} onClose={cancelDelete}>
        <DialogTitle>{type} löschen?</DialogTitle>
        <DialogContent>{msg}</DialogContent>
        <DialogActions>
          <StyledButton onClick={cancelDelete} text="Abbrechen" />
          <StyledButton
            color="error"
            onClick={() => handleDeleteRecord()}
            text="Löschen"
          />
        </DialogActions>
      </Dialog>
      {/*Dialog für feld meldung */}
      <Dialog open={openFieldDialog} onClose={() => setOpenFieldDialog(false)}>
        <DialogContent>{msgField}</DialogContent>
        <DialogActions>
          <StyledButton onClick={() => setOpenFieldDialog(false)} text="Ok" />
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default DataRecordEditor;
