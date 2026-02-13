import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordList from "./DataRecordList";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Autocomplete, Button, TextField } from "@mui/material";
import PasswordInput from "./PasswordInput";
import type { DataField } from "../classes/DataField";
import type { DataRecord } from "../classes/DataRecord";
import UserEditor from "./UserEditor";

interface Props {
  caller: IApiCaller;
}

async function submitRegisterUser(
  caller: IApiCaller,
  userName: string,
  pswd: string,
  pswdCtrl: string,
  updateData: () => void,
): Promise<void> {
  const result = await caller.RegisterNewUser(userName, pswd, pswdCtrl);
  updateData();
  if (result.success) alert("Nutzer erfolgreich hinzugefügt.");
  else alert("Nutzer konnte nicht hinzugefügt werden!");
}

function UserManagementSettings({ caller }: Props) {
  const [users, setUsers] = useState<DataRecord[]>([]);
  const [userName, setUserName] = useState("");
  const [pswd, setPswd] = useState("");
  const [pswdCtrl, setPswdCtrl] = useState("");

  const loadData = async () =>
    setUsers(
      DataRecordConverter.ConvertUsersToDataRecord(
        (await caller.GetUsers()).json,
      ),
    );
  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <DataRecordList
        data={users}
        mapEntry={(user) => (
          <UserEditor user={user} caller={caller} updateData={loadData} />
        )}
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
      </form>
    </>
  );
}

export default UserManagementSettings;
