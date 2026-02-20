import {
  useNavigate,
  useSearchParams,
  type NavigateOptions,
} from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import { useCallback, useEffect, useState } from "react";
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
  urlid: React.RefObject<number | null>;
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
      return field.records.every((entry) =>
        entry.dataFields.every((field) => IsValid(field)),
      );
    case "group":
      return field.element.dataFields.every((field) => IsValid(field));
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
  const number = str ? Number(str) : -1;

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
  console.log("CREATE NEW FORMAT");

  switch (type) {
    case "neue-anfrage":
    case "anfrage":
    case "letzte-anfrage": {
      const suc = await caller.TryCreateNewDataRecordAnfrage(
        DataRecordConverter.ConvertDataRecordToFormat2(toSave),
      );
      console.log(suc);
      return suc.success;
    }
    case "neuer-fall":
    case "fall":
    case "letzter-fall": {
      const suc = await caller.TryCreateNewDataRecordFall(
        DataRecordConverter.ConvertDataRecordToFormat2(toSave),
      );
      console.log(suc);
      return suc.success;
    }
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
  id: number | null,
  caller: IApiCaller,
  setDataRecord: (record: DataRecord) => void,
  setFormatVersion: (version: number) => void,
  setMsgID: (msg: string) => void,
  setOpenIdDialog: (open: boolean) => void,
) {
  if (
    type == "anfrage" ||
    type == "fall" ||
    type == "letzte-anfrage" ||
    type == "letzter-fall"
  ) {
    if (id === null) {
      console.log("Tried to load id: null");
      return;
    }
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
        setMsgID(
          "Fehler beim Anfragen der Format id: " +
            neededFormatVersion +
            ". Fehler: " +
            formatRes.errorMsg,
        );
        setOpenIdDialog(true);
      }
    } else {
      setMsgID(
        "Fehler beim Suchen nach id " + id + ". Fehler: " + res.errorMsg,
      );
      setOpenIdDialog(true);
    }
  } else {
    //get format only

    const formatRes = await GetDataFormat(caller, type);

    if (!formatRes.success) {
      setMsgID("Konnte aktuelles Format nicht laden");
      setOpenIdDialog(true);
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

function DataRecordEditor({ caller, savedData, savedFormat, urlid }: Props) {
  const [searchParams] = useSearchParams();
  const type: dataRecordType = GetDataRecordType(searchParams.get("type"));
  if (type !== "neue-anfrage" && type !== "neuer-fall") {
    urlid.current = GetDataRecordId(searchParams.get("id"));
  }

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
  const [openIdDialog, setOpenIdDialog] = useState(false);
  const [msgID, setMsgID] = useState("");

  const navigate = useNavigate();

  const handleRecordChange = useCallback(
    (nextRecord: DataRecord) => {
      if (isEditMode) {
        savedFormat.current = false;
      } else {
        savedData.current = false;
      }
      setRecord(nextRecord);
    },
    [isEditMode, savedData, savedFormat],
  );

  const dialogField: DialogObject = {
    isOpen: openFieldDialog,
    title: "",
    body: msgField,
    no: "ok",
    noAction: async () => setOpenFieldDialog(false),
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

  const dialogID: DialogObject = {
    isOpen: openIdDialog,
    title: "Seite konnte nicht geladen werden.",
    body: msgID,
    no: "Ok",
    noAction: async () => setOpenIdDialog(false),
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
      console.log(urlid.current);
      await LoadDataAndFormat(
        type,
        urlid.current,
        caller,
        setRecord,
        setFormatVersion,
        setMsgID,
        setOpenIdDialog,
      );
    }
    loadData();
  }, [caller, type, urlid.current]);

  //saves the datarecord
  async function Save(
    type: dataRecordType,
    recordId: number | null,
    recordToSave: DataRecord,
    caller: IApiCaller,
  ): Promise<{ success: boolean }> {
    console.log("Valid record. Trying to save");

    //wenn es keinen record zum speichern gibt, snackbar öffnen und abbrechen
    if (!recordToSave) {
      openSnackbar("Nichts zum Speichern!", false);
      return { success: false };
    }

    let succhanged: boolean | undefined = false;

    // wenn sich die Stuktur geändert hat, neue Struktur an backend schicken und return wenn nicht erfolgreich
    if (!savedFormat.current) {
      console.log("Attempting to update format!");

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

    //wenn es eine bestehende Anfrage oder Fall ist, update versuchen und snackbar öffnen
    if (!savedData.current) {
      if (recordId === null) {
        console.log("Tried to update record with id: " + recordId);
        return { success: false };
      }

      console.log("Trying to update exisitng dataSet");

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
    console.log(res);

    if (res.success) {
      const saveId = isNaN(Number(res.json["pk"]))
        ? -1
        : Number(res.json["pk"]);
      urlid.current = saveId;
      console.log("Got: " + urlid.current);

      openSnackbar(bigType + " erfolgreich gespeichert!", true);
      await sleep(1500);
      navigate(`?type=${bigType.toLowerCase()}&id=${urlid.current}`, {
        replace: true,
      });
      await setLast(urlid.current, type);
      return true;
    } else {
      openSnackbar(bigType + " konnte nicht gespeichert werden!", false);
      return false;
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
    recordId: number | null,
    recordToSave: DataRecord,
    lastSavedRecord: DataRecord,
    caller: IApiCaller,
    setLastSaved: (lastSaved: DataRecord) => void,
  ) {
    try {
      console.log("handle Save");

      if (!GetDataRecordValidity(recordToSave)) {
        console.log("Data record was invalid. Dont Save!");

        return;
      }
      const result = await Save(type, recordId, recordToSave, caller);

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
    if (urlid.current) return true;
    else return false;
  }

  async function handleDeleteRecord() {
    if (urlid.current === null) {
      return;
    }
    const suc = (await caller.TryDeleteAnfrage(urlid.current)).success;
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
        onChange={handleRecordChange}
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
        onClick={async () => {
          // if (urlid.current === null) {
          //   return;
          // }
          await handleSave(
            type,
            urlid.current,
            record,
            lastSavedRecord,
            caller,
            setLastSavedRecord,
          );
        }}
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
      {/*Dialog für ID nicht gefunden bzw Format konnte nicht geladen werden */}
      <DialogComponent dialogObject={dialogID} />
    </div>
  );
}

export default DataRecordEditor;
