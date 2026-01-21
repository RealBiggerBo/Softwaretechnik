import type { ReactNode } from "react";
import type { DataField } from "./DataField";

export class DataRecord {
  id: number = -1;
  dataFields: DataField[] = [];

  constructor(id: number, dataFields: DataField[]) {
    this.id = id;
    this.dataFields = dataFields;
  }

  DisplayDataRecord(includeLineBreak: boolean): ReactNode {
    return (
      <>
        {this.dataFields.map((f, _) => (
          <>
            <label>{f.Display()}</label>
            {includeLineBreak && <br />}
          </>
        ))}
      </>
    );
  }

  IsValid(): boolean {
    for (let i = 0; i < this.dataFields.length; i++) {
      if (!this.dataFields[i].IsValid()) return false;
    }

    return true;
  }
}
