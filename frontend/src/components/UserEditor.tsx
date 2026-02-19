import { Alert, Autocomplete, Snackbar, TextField } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import type { DataRecord } from "../classes/DataRecord";
import { useState } from "react";
import PasswordInput from "./PasswordInput";
import StyledButton from "./Styledbutton";
import DialogComponent from "./DialogComponent";
import type { DialogObject } from "./DialogComponent";

interface Props {
  user: DataRecord;
  caller: IApiCaller;
  updateData: () => void;
}

function GetUserRole(user: DataRecord) {
  const rightFields = user.dataFields.filter((field) => field.name == "Rolle");
  if (rightFields.length > 0 && rightFields[0].type == "text") {
    switch (rightFields[0].text) {
      case "base_user":
        return "Basis";
      case "extended_user":
        return "Erweitert";
      case "admin_user":
        return "Admin";
    }
  } else return "";
}

function MapToApiRoleString(
  option: string | null,
): "base_user" | "extended_user" | "admin_user" | null {
  switch (option) {
    case "Basis":
      return "base_user";
    case "Erweitert":
      return "extended_user";
    case "Admin":
      return "admin_user";
    default:
      return null;
  }
}

function GetUserId(user: DataRecord) {
  const idFields = user.dataFields.filter(
    (field) => field.name.toLowerCase() == "id",
  );
  if (idFields.length > 0 && idFields[0].type == "integer")
    return idFields[0].value;
  else return -1;
}

function UserEditor({ user, caller, updateData }: Props) {
  const initialUserRole = GetUserRole(user);
  const [role, setRole] = useState(initialUserRole ? initialUserRole : "");
  const [newPswd, setNewPswd] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [saveResult, setSaveResult] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const dialogDelete: DialogObject = {
    isOpen: openDeleteDialog,
    title: "Nutzer löschen?",
    body: "Wollen Sie diesen Nutzer wirklich löschen?",
    yes: "Löschen",
    no: "Abbrechen",
    yesAction: async () => await deleteUser(),
    noAction: async () => setOpenDeleteDialog(false),
  };

  function activateSnackbar(msg: string) {
    setOpenSnackbar(true);
    setSnackbarMessage(msg);
  }

  async function deleteUser() {
    const res = await caller.DeleteUser(GetUserId(user));
    updateData();
    if (res.success) {
      activateSnackbar("Löschen erfolgreich");
      setOpenSnackbar(true);
      setSaveResult(true);
    } else {
      activateSnackbar(res.errorMsg);
      setOpenSnackbar(true);
      setSaveResult(false);
    }
  }

  return (
    <div className="settingsForm">
      <label>Benutzerrolle ändern</label>
      <Autocomplete
        options={["Admin", "Erweitert", "Basis"]}
        value={role}
        disableClearable={true}
        onChange={async (e, newOption) => {
          const roleString = MapToApiRoleString(newOption);
          if (roleString) {
            const res = await caller.ChangeUserRole(
              GetUserId(user),
              roleString,
            );
            if (res.success) {
              setRole(newOption);
              activateSnackbar("Nutzerberechtigung erfolgreich übernommen");
              setOpenSnackbar(true);
              setSaveResult(true);
            } else {
              setRole(role); //display previous role to show the failed change
              activateSnackbar(res.errorMsg);
              setOpenSnackbar(true);
              setSaveResult(false);
            }
            updateData();
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Rolle auswählen" />
        )}
      />
      {/* <label>Passwort zurücksetzen</label> */}
      <PasswordInput
        label="neues Passwort"
        id="newPswd"
        value={newPswd}
        extraLabel="Passwort zurücksetzen"
        onValueChange={setNewPswd}
      />
      <StyledButton
        text="Passwort zurücksetzen"
        className="passwordChangeSubmitBtn"
        onClick={async () => {
          const res = await caller.ResetUserPassword(GetUserId(user), newPswd);
          updateData();
          if (res.success) {
            activateSnackbar("Passwort erfolgreich zurückgesetzt");
            setOpenSnackbar(true);
            setSaveResult(true);
          } else {
            activateSnackbar(res.errorMsg);
            setOpenSnackbar(true);
            setSaveResult(false);
          }
        }}
      />
      <StyledButton
        text="Nutzer löschen"
        color="error"
        className="passwordChangeSubmitBtn"
        onClick={async () => {
          setOpenDeleteDialog(true);
        }}
      />

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
      <DialogComponent dialogObject={dialogDelete} />
    </div>
  );
}

export default UserEditor;
