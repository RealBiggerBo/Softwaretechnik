import {
  DataField,
  DateField,
  EnumField,
  IntegerField,
  TextField,
  ToggleField,
} from "./DataField";
import { DataRecord } from "./DataRecord";

export class DataRecordConverter {
  public static ConvertFormatToDataRecord(format: string) {
    const raw = JSON.parse(format);

    let dataRecordID = -1;
    if (raw.id != undefined) dataRecordID = raw.id;
    let dataFields = [];
    if (raw.dataFields != undefined)
      dataFields = raw.dataFields.map(this.CreateDataFields);

    const dataRecord = new DataRecord(dataRecordID, dataFields);

    return dataRecord;
  }

  private static CreateDataFields(raw: any): DataField {
    switch (raw.type) {
      case "text":
        return Object.assign(
          new TextField(
            raw.name,
            raw.id,
            raw.required,
            raw.text,
            raw.maxLength,
          ),
          raw,
        );

      case "date":
        return Object.assign(
          new DateField(raw.name, raw.id, raw.required, raw.date),
          raw,
        );

      case "integer":
        return Object.assign(
          new IntegerField(
            raw.name,
            raw.id,
            raw.required,
            raw.value,
            raw.minValue,
            raw.maxValue,
          ),
          raw,
        );

      case "enum":
        const ef = new EnumField(raw.name, raw.id, raw.required, raw.enumType);
        ef.SetPossibleValues(raw.possibleValues ?? []);
        ef.selectedValue = raw.selectedValue;
        return ef;

      case "boolean":
        return Object.assign(
          new ToggleField(raw.name, raw.id, raw.required, raw.isSelected),
          raw,
        );

      default:
        throw new Error(`Unknown DataField type: ${raw.type}`);
    }
  }
}
