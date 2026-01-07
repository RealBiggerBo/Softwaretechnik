import type { DataField } from "./DataField";

export class DataRecord {
  id: number = -1;
  dataFields: DataField[] = [];

  constructor(id: number, dataFields: DataField[]) {
    this.id = id;
    this.dataFields = dataFields;
  }

  DisplayDataRecord(): string {
    let res = "";

    this.dataFields.forEach((dataField) => {
      res += dataField.Display();
    });

    return res;
  }

  IsValid(): boolean {
    for (let i = 0; i < this.dataFields.length; i++) {
      if (!this.dataFields[i].IsValid()) return false;
    }

    return true;
  }
}
