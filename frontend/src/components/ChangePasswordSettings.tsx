import { useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import PasswordInput from "../components/PasswordInput";

interface Props {
  caller: IApiCaller;
}

function submitPasswordChangeRequest(
  caller: IApiCaller,
  oldPswd: string,
  newPswd: string,
  newPswdCtrl: string
): void {
  const result = caller.TryChangePassword(oldPswd, newPswd, newPswdCtrl);
  if (!result.success) alert(result.errorMsg);
}

//Generiert den Change Password bereich in den Einstellungen
function ChangePasswordSettings({ caller }: Props) {
  const [oldPswd, setOldPswd] = useState("");
  const [newPswd, setNewPswd] = useState("");
  const [newPswdCtrl, setNewPswdCtrl] = useState("");

  return (
    <form className="passwordChangeForm">
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
      <button
        id="submit"
        className="passwordChangeSubmitBtn"
        onClick={() =>
          submitPasswordChangeRequest(caller, oldPswd, newPswd, newPswdCtrl)
        }
      >
        Passwort ändern
      </button>
    </form>
  );
}

export default ChangePasswordSettings;
