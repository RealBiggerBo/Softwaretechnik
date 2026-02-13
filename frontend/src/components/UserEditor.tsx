import { Autocomplete, Button, TextField } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import type { DataRecord } from "../classes/DataRecord";

interface Props {
  user: DataRecord;
  caller: IApiCaller;
  updateData: () => void;
}

function GetUserRight(user: DataRecord) {
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

function GetUserId(user: DataRecord) {
  const idFields = user.dataFields.filter(
    (field) => field.name.toLowerCase() == "id",
  );
  if (idFields.length > 0 && idFields[0].type == "integer")
    return idFields[0].value;
  else return -1;
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

function UserEditor({ user, caller, updateData }: Props) {
  return (
    <>
      <Autocomplete
        options={["Admin", "Erweitert", "Basis"]}
        value={GetUserRight(user)}
        onChange={async (e, newOption) => {
          const roleString = MapToApiRoleString(newOption);
          if (roleString) {
            const res = await caller.ChangeUserRole(
              GetUserId(user),
              roleString,
            );
            updateData();
            if (res.success) alert("Nutzerberechtigung erfolgreich übernommen");
            else alert(res.errorMsg);
          }
        }}
        renderInput={(params) => (
          <TextField {...params} label="Rolle auswählen" />
        )}
      />
      <Button
        onClick={async () => {
          const res = await caller.ResetUserPassword(GetUserId(user), "asd");
          updateData();
          if (res.success) alert("Passwort erfolgreich zurückgesetzt");
          else alert(res.errorMsg);
        }}
      >
        Passwort zurücksetzen
      </Button>
      <Button
        onClick={async () => {
          const res = await caller.DeleteUser(GetUserId(user));
          updateData();
          if (res.success) alert("Löschen erfolgreich");
          else alert(res.errorMsg);
        }}
      >
        Nutzer löschen
      </Button>
    </>
  );
}

export default UserEditor;
