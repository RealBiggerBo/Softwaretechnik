import React, { Fragment, useEffect, useState, type ReactNode } from "react";
import { type DataRecord } from "../classes/DataRecord";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { DataField } from "../classes/DataField";

interface Props {
  data: DataRecord[];
  mapEntry?: (entry: DataRecord) => ReactNode | null;
}

function GetFieldValue(field: DataField): ReactNode {
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
      return field.possibleValues?.join(", ");
    default:
      return null;
  }
}

function GetRecordId(user: DataRecord, fallbackId: number): number {
  const idFields = user.dataFields.filter((field) => field.name == "id");
  if (idFields.length > 0) return GetFieldValue(idFields[0]) as number;
  return fallbackId;
}

function DataRecordList({ data, mapEntry }: Props) {
  const [openRow, setOpenRow] = useState(-1);

  if (data.length <= 0) return null;
  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            {mapEntry && <TableCell />}
            {data[0].dataFields.map((field) => (
              <TableCell key={field.id.toString()}>{field.name}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((record, index) => {
            const id = GetRecordId(record, index);
            const isOpen = openRow === index;
            return (
              <Fragment key={id.toString()}>
                <TableRow
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {mapEntry && (
                    <TableCell>
                      <IconButton
                        onClick={() =>
                          isOpen ? setOpenRow(-1) : setOpenRow(index)
                        }
                      >
                        {openRow === index ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </TableCell>
                  )}
                  {record.dataFields.map((field) => (
                    <TableCell key={field.id}>{GetFieldValue(field)}</TableCell>
                  ))}
                </TableRow>
                {mapEntry && (
                  <TableRow>
                    <TableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={record.dataFields.length + 1}
                    >
                      <Collapse in={isOpen}>{mapEntry(record)}</Collapse>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DataRecordList;
