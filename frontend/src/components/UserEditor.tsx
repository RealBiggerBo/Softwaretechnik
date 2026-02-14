import { Autocomplete, Button, TextField } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import type { DataRecord } from "../classes/DataRecord";
import React, { useState } from "react";
import PasswordInput from "./PasswordInput";

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
              alert("Nutzerberechtigung erfolgreich übernommen");
            } else {
              setRole(role); //display previous role to show the failed change
              alert(res.errorMsg);
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
      <Button
        className="passwordChangeSubmitBtn"
        onClick={async () => {
          const res = await caller.ResetUserPassword(GetUserId(user), newPswd);
          updateData();
          if (res.success) alert("Passwort erfolgreich zurückgesetzt");
          else alert(res.errorMsg);
        }}
      >
        Passwort zurücksetzen
      </Button>
      <Button
        className="passwordChangeSubmitBtn"
        onClick={async () => {
          const res = await caller.DeleteUser(GetUserId(user));
          updateData();
          if (res.success) alert("Löschen erfolgreich");
          else alert(res.errorMsg);
        }}
      >
        Nutzer löschen
      </Button>
    </div>
  );
}

export default UserEditor;
