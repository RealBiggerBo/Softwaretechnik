import type { IApiCaller } from "../classes/IApiCaller";

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
    </>
  );
}

export default SettingsPage;
