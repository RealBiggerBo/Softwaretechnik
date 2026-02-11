import { Button } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import ChangePasswordSettings from "../components/ChangePasswordSettings";
import UserList from "../components/UserList";

interface Props {
  caller: IApiCaller;
}

function SettingsPage({ caller }: Props) {
  return (
    <>
      <Button
        onClick={async () => alert(JSON.stringify(await caller.GetUsers()))}
      >
        Test
      </Button>
      <UserList caller={caller}></UserList>
      <ChangePasswordSettings caller={caller} />
    </>
  );
}

export default SettingsPage;
