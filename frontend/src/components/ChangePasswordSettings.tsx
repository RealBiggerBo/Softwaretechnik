import { useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import PasswordInput from "../components/PasswordInput";

interface Props {
  caller: IApiCaller;
}

async function submitPasswordChangeRequest(
  caller: IApiCaller,
  oldPswd: string,
  newPswd: string,
  newPswdCtrl: string,
): Promise<void> {
  const result = await caller.TryChangePassword(oldPswd, newPswd, newPswdCtrl);
  if (!result.success) alert(result.errorMsg);
  else alert("Passwort erfolgreich geändert");
}

//Generiert den Change Password bereich in den Einstellungen
function ChangePasswordSettings({ caller }: Props) {
  const [oldPswd, setOldPswd] = useState("");
  const [newPswd, setNewPswd] = useState("");
  const [newPswdCtrl, setNewPswdCtrl] = useState("");

  return (
    <form
      className="passwordChangeForm"
      onSubmit={async (event) => {
        event.preventDefault();
        await submitPasswordChangeRequest(
          caller,
          oldPswd,
          newPswd,
          newPswdCtrl,
        );
      }}
    >
      <PasswordInput
        label="Altes Passwort"
        id="oldPassword"
        value={oldPswd}
        onValueChange={setOldPswd}
      />
      <PasswordInput
        label="Neues Passwort"
        id="newPassword"
        value={newPswd}
        onValueChange={setNewPswd}
      />
      <PasswordInput
        label="Neues Passwort (Kontrolle)"
        id="newPasswordControl"
        value={newPswdCtrl}
        onValueChange={setNewPswdCtrl}
      />
      <button id="submit" className="passwordChangeSubmitBtn" type="submit">
        Passwort ändern
      </button>
    </form>
  );
}

export default ChangePasswordSettings;
