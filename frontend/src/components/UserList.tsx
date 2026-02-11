import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";

interface Props {
  caller: IApiCaller;
}

function UserList({ caller }: Props) {
  const initialUsers: DataRecord[] = [];
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    const fetchData = async () => {
      const result = await caller.GetUsers();

      setUsers(DataRecordConverter.ConvertUsersToDataRecord(result.json));
    };
    fetchData();
  }, []);

  return users.map((user) => (
    <label>
      USER<br></br>
    </label>
  ));
}

export default UserList;
