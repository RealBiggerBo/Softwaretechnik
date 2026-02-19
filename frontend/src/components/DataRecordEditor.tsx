import {
  useNavigate,
  useSearchParams,
  type NavigateOptions,
} from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { DataRecord } from "../classes/DataRecord";
import { Alert, Fab, Snackbar } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import type { DataField } from "../classes/DataField";
import DataRecordDisplay from "./DataRecordDisplay";
import StyledButton from "./Styledbutton";
import DialogComponent from "./DialogComponent";
import type { DialogObject } from "./DialogComponent";

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
async function GetDataFormat(
  caller: IApiCaller,
  type: dataRecordType,
  formatVersion?: number,
) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
    case "neue-anfrage":
      return await caller.GetAnfrageJson(formatVersion);
    case "fall":
    case "letzter-fall":
    case "neuer-fall":
      return await caller.GetFallJson(formatVersion);
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

async function GetDataById(
  type: dataRecordType,
  id: number,
  caller: IApiCaller,
) {
  switch (type) {
    case "anfrage":
    case "letzte-anfrage":
      return caller.TrySearchAnfrageByID(id);
    case "fall":
    case "letzter-fall":
      return caller.TrySearchAnfrageByID(id);
    default:
      return { success: false, errorMsg: "Wrong type", json: "" };
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

async function LoadDataAndFormat(
  type: dataRecordType,
  id: number,
  caller: IApiCaller,
  setDataRecord: (record: DataRecord) => void,
  setFormatVersion: (version: number) => void,
) {
  if (
    type == "anfrage" ||
    type == "fall" ||
    type == "letzte-anfrage" ||
    type == "letzter-fall"
  ) {
    //get by id
    const res = await GetDataById(type, id, caller);

    if (res.success) {
      //convert to version format

      const [neededFormatVersion, keyValueTuples] =
        DataRecordConverter.ConvertIdSearchResult(res.json);
      //get format

      const formatRes = await GetDataFormat(caller, type, neededFormatVersion);

      if (formatRes.success) {
        const [_, formatDataRecord] =
          DataRecordConverter.ConvertFormatToDataRecord(formatRes.json);

        //merge
        const mergedDataRecord = DataRecordConverter.MergeDataRecordWithData(
          formatDataRecord,
          keyValueTuples,
        );

        setDataRecord(mergedDataRecord);
      } else {
        alert(
          "Fehler beim Anfragen der Format id: " +
            neededFormatVersion +
            ". Fehler: " +
            formatRes.errorMsg,
        );
      }
    } else {
      alert("Fehler beim Suchen nach id " + id + ". Fehler: " + res.errorMsg);
    }
  } else {
    //get format only
    const formatRes = await GetDataFormat(caller, type);

    if (!formatRes.success) {
      alert("Konnte aktuelles Format nicht laden");
      return;
    }

    const [version, format] = DataRecordConverter.ConvertFormatToDataRecord(
      formatRes.json,
    );

    setDataRecord(format);
    setFormatVersion(version);
  }
}

async function TryCreateDataSet(
  type: dataRecordType,
  toSave: any,
  caller: IApiCaller,
) {
  switch (type) {
    case "neue-anfrage":
      return await caller.TryCreateAnfrage(toSave);
    case "neuer-fall":
      return await caller.TryCreateFall(toSave);
  }
  return {
    success: false,
    errorMsg: "Can not create for type: " + type,
    json: "",
  };
}

async function CreateNewDataSet(
  type: dataRecordType,
  formatVersion: number,
  recordToSave: DataRecord,
  caller: IApiCaller,
  openSnackbar: (text: string, success: boolean) => void,
  sleep: (delay: number) => Promise<unknown>,
  setLast: (id: number, type: dataRecordType) => Promise<void>,
  navigate: (to: string, options?: NavigateOptions) => void,
) {
  if (type !== "neue-anfrage" && type !== "neuer-fall") return false;
  const bigType = type === "neue-anfrage" ? "Anfrage" : "Fall";

  const formatToSave = DataRecordConverter.ConvertDataRecordToFormat3(
    bigType,
    formatVersion,
    recordToSave,
  );

  //neue Daten estellen, snackbar öffnen und url ändern
  const res = await TryCreateDataSet(type, formatToSave, caller);
  if (res.success) {
    const saveId = isNaN(Number(res.json["pk"])) ? -1 : Number(res.json["pk"]);
    openSnackbar(bigType + " erfolgreich gespeichert!", true);
    await sleep(1500);
    navigate(`?type=${bigType.toLowerCase()}?id=${saveId}`, { replace: true });
    await setLast(saveId, type);
    return true;
  } else {
    openSnackbar(bigType + " konnte nicht gespeichert werden!", false);
    return false;
  }

  // if (type === "neue-anfrage") {
  //   const rectosaavejson = DataRecordConverter.ConvertDataRecordToFormat3(
  //     "Anfrage",
  //     formatVersion,
  //     recordToSave,
  //   );
  //   res = await caller.TryCreateAnfrage(rectosaavejson);
  //   sucsaved = res.success;
  //   saveid = Number(res.json["pk"]);
  //   if (sucsaved === undefined || sucsaved === false) {
  //     openSnackbar("Anfrage konnte nicht gespeichert werden!", false);
  //     return { success: false };
  //   }
  //   if (sucsaved === true) {
  //     openSnackbar("Anfrage erfolgreich gespeichert!", true);
  //     await sleep(1500);
  //     navigate(`?type=anfrage?id=${saveid}`, { replace: true });
  //     await setLast(saveid, type);
  //     return { success: true };
  //   }
  //}

  //neuen Fall erstellen, snackbar öffnen und url ändern
  // if (type === "neuer-fall") {
  //   const rectosaavejson = DataRecordConverter.ConvertDataRecordToFormat3(
  //     "Fall",
  //     formatVersion,
  //     recordToSave,
  //   );
  //   res = await caller.TryCreateFall(rectosaavejson);
  //   sucsaved = res.success;
  //   saveid = Number(res.json["pk"]);
  //   if (sucsaved === undefined || sucsaved === false) {
  //     openSnackbar("Fall konnte nicht gespeichert werden!", false);
  //     return { success: false };
  //   }
  //   if (sucsaved === true) {
  //     openSnackbar("Fall erfolgreich gespeichert!", true);
  //     await sleep(1500);
  //     navigate(`?type=fall?id=${saveid}`, { replace: true });
  //     await setLast(saveid, type);
  //     return { success: true };
  //   }
  //}
}

function DataRecordEditor({ caller, savedData, savedFormat }: Props) {
  const [searchParams] = useSearchParams();
  const type: dataRecordType = GetDataRecordType(searchParams.get("type"));
  const dataRecordId: number = GetDataRecordId(searchParams.get("id"));

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

  const dialogField: DialogObject = {
    isOpen: openFieldDialog,
    title: "",
    body: msgField,
    yes: "Ok.",
    no: "",
    yesAction: async () => setOpenFieldDialog(false),
    noAction: async () => {},
  };

  const dialogDelete: DialogObject = {
    isOpen: openDeleteDialog,
    title: `${type} löschen?`,
    body: msg,
    yes: "Löschen",
    no: "Abbrechen",
    yesAction: () => handleDeleteRecord(),
    noAction: async () => cancelDelete(),
  };

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  useEffect(() => {
    async function loadData() {
      //check login status
      const role = await GetRole(caller);
      if (!role) return;
      setRole(role);

      await LoadDataAndFormat(
        type,
        dataRecordId,
        caller,
        setRecord,
        setFormatVersion,
      );
    }
    loadData();
  }, [caller, type, dataRecordId]);

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

    CreateNewDataSet(
      type,
      formatVersion,
      recordToSave,
      caller,
      openSnackbar,
      sleep,
      setLast,
      navigate,
    );

    navigate("");

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
    if (dataRecordId) return true;
    else return false;
  }

  async function handleDeleteRecord() {
    const suc = (await caller.TryDeleteAnfrage(dataRecordId)).success;
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
            dataRecordId,
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
      <DialogComponent dialogObject={dialogDelete} />
      {/*Dialog für feld meldung */}
      <DialogComponent dialogObject={dialogField} />
    </div>
  );
}

export default DataRecordEditor;
