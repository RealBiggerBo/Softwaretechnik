import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordList from "./DataRecordList";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import {
  Alert,
  Autocomplete,
  Button,
  Snackbar,
  TextField,
} from "@mui/material";
import PasswordInput from "./PasswordInput";
import type { DataField } from "../classes/DataField";
import type { DataRecord } from "../classes/DataRecord";
import UserEditor from "./UserEditor";

interface Props {
  caller: IApiCaller;
}

function UserManagementSettings({ caller }: Props) {
  const [users, setUsers] = useState<DataRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [pswd, setPswd] = useState("");
  const [pswdCtrl, setPswdCtrl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState(false);

  const loadData = async () =>
    setUsers(
      DataRecordConverter.ConvertUsersToDataRecord(
        (await caller.GetUsers()).json,
      ),
    );
  useEffect(() => {
    loadData();
  }, []);

  async function submitRegisterUser(
    caller: IApiCaller,
    userName: string,
    pswd: string,
    pswdCtrl: string,
    updateData: () => void,
  ): Promise<void> {
    const result = await caller.RegisterNewUser(userName, pswd, pswdCtrl);
    updateData();
    if (result.success) {
      activateSnackbar("Nutzer erfolgreich hinzugefügt.");
      setSaveResult(true);
    } else {
      activateSnackbar("Nutzer konnte nicht hinzugefügt werden!");
      setSaveResult(false);
    }
  }

  function activateSnackbar(msg: string) {
    setOpenSnackbar(true);
    setSnackbarMessage(msg);
  }

  return (
    <>
      <DataRecordList
        data={users}
        mapEntry={(user) => (
          <UserEditor user={user} caller={caller} updateData={loadData} />
        )}
        mapField={(field) => {
          if (field.type == "text") {
            switch (field.text) {
              case "admin_user":
                return "Admin";
              case "extended_user":
                return "Erweitert";
              case "base_user":
                return "Basis";
            }
            return null;
          }
        }}
      ></DataRecordList>
      <form
        className="settingsForm"
        onSubmit={async (event) => {
          event.preventDefault();
          await submitRegisterUser(caller, userName, pswd, pswdCtrl, loadData);
        }}
      >
        <label htmlFor="userName" className="gridLabel">
          Benutzername
        </label>
        <TextField
          label="Benutzername"
          id="userName"
          className="textField"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <PasswordInput
          label="Passwort"
          id="password"
          value={pswd}
          onValueChange={setPswd}
        />
        <PasswordInput
          label="Passwort (Kontrolle)"
          id="passwordControl"
          value={pswdCtrl}
          onValueChange={setPswdCtrl}
        />

        <button id="submit" className="passwordChangeSubmitBtn" type="submit">
          Neuen Nutzer hinzufügen
        </button>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
        >
          <Alert
            severity={saveResult ? "success" : "error"}
            onClose={() => setOpenSnackbar(false)}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </form>
    </>
  );
}

export default UserManagementSettings;
