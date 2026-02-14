import type { IApiCaller } from "../classes/IApiCaller";
import ChangePasswordSettings from "../components/ChangePasswordSettings";
import UserManagementSettings from "../components/UserManagementSettings";
import { useEffect, useState } from "react";

interface Props {
  caller: IApiCaller;
}

function SettingsPage({ caller }: Props) {
  const [currentRole, setCurrentRole] = useState<
    "base_user" | "extended_user" | "admin_user"
  >("base_user");
  useEffect(() => {
    const loadData = async () =>
      setCurrentRole(
        (await caller.GetCurrentUserRights()).json?.role ?? "base_user",
      );
    loadData();
  }, []);
  return (
    <>
      {currentRole == "admin_user" && (
        <UserManagementSettings caller={caller} />
      )}
      <ChangePasswordSettings caller={caller} />
    </>
  );
}

export default SettingsPage;
