import NumberField from "../components/NumberField";
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
  public static ConvertUsersToDataRecord(
    rawUsers: {
      id: number;
      username: string;
      is_active: boolean;
      is_staff: boolean;
      date_joined: string;
    }[],
  ): DataRecord[] {
    return rawUsers.map(
      (user) =>
        new DataRecord([
          new IntegerField("id", 0, true, user.id),
          new TextField("Benutzername", 1, true, user.username),
          new ToggleField("aktiv", 2, true, user.is_active),
          new ToggleField("ist Mitarbeiter", 3, true, user.is_staff),
          new TextField("Beitrittsdatum", 4, true, user.date_joined),
        ]),
    );
  }

  public static ConvertFormatToDataRecord(raw: unknown) {
    const fields: Record<string, Record<string, unknown>> = this.GetFields(raw);

    const dataFields: DataField[] = Object.entries(fields).map(
      ([fieldName, fieldValues]) =>
        this.CreateDataField(fieldName, fieldValues),
    );

    const dataRecord = new DataRecord(dataFields);

    return dataRecord;
  }

  public static ConvertDataRecordToFormat3(
    dataRecord: DataRecord,
  ): Record<string, any> {
    const obj: Record<string, any> = {};
    dataRecord.dataFields.forEach((field) => {
      this.GetValue(obj[field.name]);
    });
    return obj;
  }

  public static ConvertDataRecordToFormat2(
    dataRecord: DataRecord,
  ): Record<string, any> {
    const obj: Record<string, any> = { structure: {} };

    dataRecord.dataFields.forEach((field) => {
      const fieldObj: any = {
        id: field.id,
        type: field.type,
        required: field.required,
      };

      if (field instanceof TextField) {
        fieldObj.maxLength = field.maxLength;
      }

      if (field instanceof IntegerField) {
        fieldObj.value = field.value;
        fieldObj.minValue = field.minValue;
        fieldObj.maxValue = field.maxValue;
      }

      if (field instanceof EnumField) {
        fieldObj.possibleValues = field.possibleValues;
      }

      if (field instanceof DateField) {
        fieldObj.date = field.date;
      }

      obj.structure[field.name] = fieldObj;
    });

    return obj;
  }

  public static MergeDataRecordWithData(
    dataRecord: DataRecord,
    raw: any,
  ): DataRecord {
    let rawkey = Object.keys(raw);
    let i = 0;
    while (i < rawkey.length) {
      let fieldName = rawkey[i];
      let fieldValues = raw[fieldName];
      dataRecord.dataFields[i] = this.SetValue(
        dataRecord.dataFields[i],
        fieldValues,
      );
      i++;
    }

    return dataRecord;
  }

  private static SetValue(field: DataField, value: unknown) {
    if (value == null) return field;

    switch (field.type) {
      case "String":
        if (typeof value === "string") {
          if ("text" in field) (field as TextField).text = value;
          else (field as EnumField).selectedValue = value;
        }
        break;
      case "Date":
        if (typeof value === "string") (field as DateField).date = value;
        break;
      case "Boolean":
        if (typeof value === "boolean")
          (field as ToggleField).isSelected = value;
        break;
      case "Integer":
        if (typeof value === "number") (field as IntegerField).value = value;
        break;
      default:
        return field;
    }

    return field;
  }
  private static GetValue(field: DataField) {
    switch (field.type) {
      case "String":
        if ("text" in field) return (field as TextField).text;
        else return (field as EnumField).selectedValue;
      case "Date":
        return (field as DateField).date;
      case "Boolean":
        return (field as ToggleField).isSelected;
      case "Integer":
        return (field as IntegerField).value;
      default:
        return null;
    }
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
            "",
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
        return new IntegerField(
          fieldName,
          id,
          required,
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
