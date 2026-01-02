import type { IApiCaller } from "../classes/IApiCaller";
import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
  caller: IApiCaller;
}

function SettingsPage({ caller }: Props) {
  return (
    <>
      <label>{caller.GetUsers().length}</label>
      {caller.GetUsers().map((user) => (
        <label>{user}</label>
      ))}
      <VisibilityIcon />
    </>
  );
}

export default SettingsPage;
