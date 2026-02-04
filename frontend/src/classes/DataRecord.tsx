import type { ReactNode } from "react";
import type { DataField } from "./DataField";

export class DataRecord {
  dataFields: DataField[] = [];

  constructor(dataFields: DataField[]) {
    this.dataFields = dataFields;
  }
}
