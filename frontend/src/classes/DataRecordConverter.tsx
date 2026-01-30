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
  public static ConvertFormatToDataRecord(raw: any) {

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
      case "Text":
        return new TextField(
            raw.name,
            raw.id,
            raw.required,
            raw.text,
            raw.maxLength,
          );

      case "Date":
        return new DateField(raw.name, raw.id, raw.required, raw.date);

      case "Integer":
        return new IntegerField(
            raw.name,
            raw.id,
            raw.required,
            raw.value,
            raw.minValue,
            raw.maxValue,
          );

      case "Enum":
        const ef = new EnumField(raw.name, raw.id, raw.required, raw.enumType);
        ef.SetPossibleValues(raw.possibleValues ?? []);
        ef.selectedValue = raw.selectedValue;
        return ef;

      case "Boolean":
        return new ToggleField(raw.name, raw.id, raw.required, raw.isSelected);

      default:
        throw new Error(`Unknown DataField type: ${raw.type}`);
    }
  }
}
