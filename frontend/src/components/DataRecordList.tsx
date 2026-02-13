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

function GetFieldValue(field: DataField) {
  switch (field.type) {
    case "text":
      return field.text;
    case "integer":
      return field.value;
    case "boolean":
      return field.isSelected ? "ja" : "nein";
    case "date":
      return field.date;
    case "enum":
      return field.possibleValues;
  }
  throw new Error("unhandled field type");
}

function GetUserId(user: DataRecord, defaultId: number) {
  const idFields = user.dataFields.filter((field) => (field.name = "name"));
  if (idFields.length > 0) return GetFieldValue(idFields[0]).toString();
  return defaultId.toString();
}

function DataRecordList({ getData }: Props) {
  const initialUsers: DataRecord[] = [];
  const [users, setUsers] = useState(initialUsers);

  useEffect(() => {
    const fetchData = async () => setUsers(await getData());
    fetchData();
  }, []);

  if (users.length <= 0) return;
  alert("fetched users:" + JSON.stringify(users));
  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {users[0].dataFields.map((field) => (
                <TableCell id={field.id.toString()}>
                  {JSON.stringify(field)}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, id) => (
              <TableRow
                key={GetUserId(user, id)}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {user.dataFields.map((field) => (
                  <TableCell>{GetFieldValue(field)}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}

export default DataRecordList;
