import type { DataField } from "./DataField";

export class DataRecord {
  dataFields: DataField[] = [];

  DisplayDataRecord(): string {
    let res = "";

    this.dataFields.forEach((dataField) => {
      res += dataField.Display();
    });

    return res;
  }
}
