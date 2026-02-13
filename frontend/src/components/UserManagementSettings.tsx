import { useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordList from "./DataRecordList";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Button, TextField } from "@mui/material";
import PasswordInput from "./PasswordInput";

interface Props {
  caller: IApiCaller;
}

async function submitRegisterUser(
  caller: IApiCaller,
  userName: string,
  pswd: string,
  pswdCtrl: string,
): Promise<void> {
  const result = await caller.RegisterUser(userName, pswd, pswdCtrl);
  if (result.success) alert("Nutzer erfolgreich hinzugefügt.");
  else alert("Nutzer konnte nicht hinzugefügt werden!");
}

function UserManagementSettings({ caller }: Props) {
  const [userName, setUserName] = useState("");
  const [pswd, setPswd] = useState("");
  const [pswdCtrl, setPswdCtrl] = useState("");

  return (
    <>
      <DataRecordList
        getData={async () => {
          const res = DataRecordConverter.ConvertUsersToDataRecord(
            (await caller.GetUsers()).json,
          );

          alert("res: " + JSON.stringify(res));

          return res;
        }}
      ></DataRecordList>
      <form
        className="passwordChangeForm"
        onSubmit={async (event) => {
          event.preventDefault();
          await submitRegisterUser(caller, userName, pswd, pswdCtrl);
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
