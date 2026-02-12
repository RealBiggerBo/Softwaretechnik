import { type DataField } from "./DataField";
import { type DataRecord } from "./DataRecord";

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
    return rawUsers.map((user) => {
      return {
        dataFields: [
          {
            type: "integer",
            name: "id",
            id: 0,
            required: true,
            value: user.id,
            minValue: 0,
            maxValue: -1,
          },
          {
            type: "text",
            name: "Benutzername",
            id: 1,
            required: true,
            text: user.username,
            maxLength: -1,
          },
          {
            type: "boolean",
            name: "aktiv",
            id: 2,
            required: true,
            isSelected: user.is_active,
          },
          {
            type: "boolean",
            name: "ist Mitarbeiter",
            id: 3,
            required: true,
            isSelected: user.is_staff,
          },
          {
            type: "date",
            name: "Beitrittsdatum",
            id: 4,
            required: true,
            date: user.date_joined,
          },
        ],
      };
    });
  }

  public static ConvertFormatToDataRecord(raw: unknown) {
    const fields: Record<string, Record<string, unknown>> = this.GetFields(raw);

    const dataFields: DataField[] = Object.entries(fields).map(
      ([fieldName, fieldValues]) =>
        this.CreateDataField(fieldName, fieldValues),
    );
    return { dataFields: dataFields };
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

      switch (field.type) {
        case "text":
          fieldObj.maxLength = field.maxLength;
          break;

        case "integer":
          fieldObj.minValue = field.minValue;
          fieldObj.maxValue = field.maxValue;
          break;

        case "enum":
          fieldObj.possibleValues = field.possibleValues;
          break;

        default:
          break;
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

  private static SetValue(field: DataField, value: unknown): DataField {
    if (value == null) return field;

    switch (field.type) {
      case "text":
        if (typeof value === "string") {
          return { ...field, text: value };
        }
        break;
      case "enum":
        if (typeof value === "string") {
          return { ...field, selectedValue: value };
        }
        break;
      case "date":
        if (typeof value === "string") {
          return { ...field, date: value };
        }
        break;
      case "boolean":
        if (typeof value === "boolean") {
          return { ...field, isSelected: value };
        }
        break;
      case "integer":
        if (typeof value === "number") {
          return { ...field, value: value };
        }
        break;
      default:
        const _exhaustive: never = field;
        return _exhaustive;
    }
    return field;
  }
  private static GetValue(field: DataField): string | number | boolean | null {
    switch (field.type) {
      case "text":
        return field.text;
      case "enum":
        return field.selectedValue;
      case "date":
        return field.date;
      case "boolean":
        return field.isSelected;
      case "integer":
        return field.value;
      default:
        const _exhaustive: never = field;
        return _exhaustive;
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
      case "String": {
        const possibleValues = this.GetValueFromRecord(
          fieldValues,
          "possibleValues",
        ) as string[] | undefined;

        if (possibleValues == null) {
          return {
            type: "text",
            name: fieldName,
            id,
            required,
            text: "",
            maxLength:
              (this.GetValueFromRecord(fieldValues, "maxLength") as number) ??
              -1,
          };
        }

        return {
          type: "enum",
          name: fieldName,
          id,
          required,
          selectedValue: "",
          possibleValues,
        };
      }

      case "Date":
        return {
          type: "date",
          name: fieldName,
          id,
          required,
          date: "0000-00-00",
        };

      case "Boolean":
        return {
          type: "boolean",
          name: fieldName,
          id,
          required,
          isSelected: false,
        };

      case "Integer":
        return {
          type: "integer",
          name: fieldName,
          id,
          required,
          value: (this.GetValueFromRecord(fieldValues, "value") as number) ?? 0,
          minValue:
            (this.GetValueFromRecord(fieldValues, "minValue") as number) ?? 0,
          maxValue:
            (this.GetValueFromRecord(fieldValues, "maxValue") as number) ?? -1,
        };

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
