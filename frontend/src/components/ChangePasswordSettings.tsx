import { useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import PasswordInput from "../components/PasswordInput";
import { Snackbar, Alert } from "@mui/material";

interface Props {
  caller: IApiCaller;
}

//Generiert den Change Password bereich in den Einstellungen
function ChangePasswordSettings({ caller }: Props) {
  const [oldPswd, setOldPswd] = useState("");
  const [newPswd, setNewPswd] = useState("");
  const [newPswdCtrl, setNewPswdCtrl] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState(false);

  async function submitPasswordChangeRequest(
    caller: IApiCaller,
    oldPswd: string,
    newPswd: string,
    newPswdCtrl: string,
  ): Promise<void> {
    const result = await caller.TryChangePassword(
      oldPswd,
      newPswd,
      newPswdCtrl,
    );
    if (!result.success) {
      activateSnackbar(result.errorMsg);
      setSaveResult(false);
    } else {
      activateSnackbar("Passwort erfolgreich geändert");
      setSaveResult(true);
    }
  }

  function activateSnackbar(msg: string) {
    setOpenSnackbar(true);
    setSnackbarMessage(msg);
  }

  return (
    <form
      className="settingsForm"
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
  );
}

export default ChangePasswordSettings;
