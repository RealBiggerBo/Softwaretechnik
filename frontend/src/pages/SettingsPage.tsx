import { Button, TextField } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import ChangePasswordSettings from "../components/ChangePasswordSettings";
import UserManagementSettings from "../components/UserManagementSettings";

interface Props {
  caller: IApiCaller;
}

function SettingsPage({ caller }: Props) {
  return (
    <>
      <Button
        onClick={async () =>
          alert(JSON.stringify(await caller.GetCurrentUserRights()))
        }
      >
        Test Me api
      </Button>
      <UserManagementSettings caller={caller} />
      <ChangePasswordSettings caller={caller} />
    </>
  );
}

export default SettingsPage;
