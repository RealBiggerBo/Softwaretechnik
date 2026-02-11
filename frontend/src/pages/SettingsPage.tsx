import { Button } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import ChangePasswordSettings from "../components/ChangePasswordSettings";

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
      <ChangePasswordSettings caller={caller} />
    </>
  );
}

export default SettingsPage;
