import { Button } from "@mui/material";
import type { IApiCaller } from "../classes/IApiCaller";
import ChangePasswordSettings from "../components/ChangePasswordSettings";
import DataRecordList from "../components/DataRecordList";
import { DataRecordConverter } from "../classes/DataRecordConverter";

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
      <DataRecordList
        getData={async () =>
          DataRecordConverter.ConvertUsersToDataRecord(
            (await caller.GetUsers()).json,
          )
        }
      ></DataRecordList>
      <ChangePasswordSettings caller={caller} />
    </>
  );
}

export default SettingsPage;
