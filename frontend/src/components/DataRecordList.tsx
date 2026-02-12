import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { type DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { DataField } from "../classes/DataField";

interface Props {
  getData: () => Promise<DataRecord[]>;
}

function GetValueField(field: DataField) {
  return "";
}

function DataRecordList({ getData }: Props) {
  const initialUsers: DataRecord[] = [];
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    const fetchData = async () => setUsers(await getData());
    fetchData();
  }, []);

  if (users.length <= 0) return;
  return (
    <TableContainer>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {users[0].dataFields.map((field) => (
              <TableCell>{field.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, id) => (
            <TableRow
              key={id}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {user.dataFields.map((field) => (
                <TableCell>{field.name}</TableCell>
              ))}
              {/* <TableCell component="th" scope="row">
                {user.name}
              </TableCell>
              <TableCell align="right">{user.calories}</TableCell>
              <TableCell align="right">{user.fat}</TableCell>
              <TableCell align="right">{user.carbs}</TableCell>
              <TableCell align="right">{user.protein}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataRecordList;
