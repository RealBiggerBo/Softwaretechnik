import {
  DataField,
  DateField,
  EnumField,
  IntegerField,
  TextField,
  ToggleField,
} from "./DataField";
import { DataRecord } from "./DataRecord";

type RawField = {
  id: number;
  type: string;
  required: boolean;
  maxLength?: number;
  possibleValues?: string[];
  minValue?: number;
  maxValue?: number;
  value?: number;
  text?: string;
  date?: string;
  isSelected?: boolean;
  enumType?: string;
  selectedValue?: string;
};

export class DataRecordConverter {
  public static ConvertFormatToDataRecord(raw: unknown) {
    const fields: Record<string, Record<string, unknown>> = this.GetFields(raw);

    let dataRecordID = -1; //currently unused
    const dataFields: DataField[] = Object.entries(fields).map(
      ([fieldName, fieldValues]) =>
        this.CreateDataField(fieldName, fieldValues),
    );

    const dataRecord = new DataRecord(dataRecordID, dataFields);

    return dataRecord;
  }

  private static GetFields(
    raw: unknown,
  ): Record<string, Record<string, unknown>> {
    if (
      raw &&
      typeof raw === "object" &&
      "structure" in raw &&
      typeof raw.structure === "object" &&
      raw.structure !== null
    ) {
      return raw.structure as Record<string, Record<string, unknown>>;
    }

    return {};
  }

  private static CreateDataField(
    fieldName: string,
    fieldValues: Record<string, unknown>,
  ): DataField {
    const id = this.GetValueFromRecord(fieldValues, "id") as number;
    const required = this.GetValueFromRecord(
      fieldValues,
      "required",
    ) as boolean;
    const type = this.GetValueFromRecord(fieldValues, "type") as string;

    switch (type) {
      case "String":
        const possibleValues = this.GetValueFromRecord(
          fieldValues,
          "possibleValues",
        ) as string[];
        if (possibleValues == null) {
          return new TextField(
            fieldName,
            id,
            required,
            "FORMAT ONLY",
            this.GetValueFromRecord(fieldValues, "maxLength") as number,
          );
        } else {
          return new EnumField(fieldName, id, required, possibleValues);
        }
      case "Date":
        return new DateField(fieldName, id, required, "0000-00-00");
      case "Boolean":
        return new ToggleField(fieldName, id, required, false);
      case "Integer":
        return new IntegerField(fieldName, id, required,
          this.GetValueFromRecord(fieldValues, "value") as number,
          this.GetValueFromRecord(fieldValues, "minValue") as number,
          this.GetValueFromRecord(fieldValues, "maxValue") as number,
        );
      default:
        throw new Error(`Unknown DataField type: ${type}`);
    }
  }

  private static GetValueFromRecord(
    raw: Record<string, unknown>,
    propertyName: string,
  ) {
    if (propertyName in raw)
      return (raw as Record<string, unknown>)[propertyName];
    return undefined;
  }
}
