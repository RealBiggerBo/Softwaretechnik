import { type DataField, type GroupField } from "./DataField";
import { type DataRecord } from "./DataRecord";

export class DataRecordConverter {
  public static ConvertUsersToDataRecord(
    rawUsers: {
      id: number;
      username: string;
      date_joined: string;
      role: string;
    }[],
  ): DataRecord[] {
    if (!rawUsers) return [];
    return rawUsers.map((user) => {
      return {
        dataFields: [
          {
            type: "integer",
            name: "id",
            id: 0,
            required: true,
            sensitive: true,
            value: user.id,
            minValue: 0,
            maxValue: -1,
          },
          {
            type: "text",
            name: "Benutzername",
            id: 1,
            required: true,
            sensitive: true,
            text: user.username,
            maxLength: -1,
          },
          {
            type: "date",
            name: "Beitrittsdatum",
            id: 2,
            required: true,
            sensitive: true,
            date: user.date_joined,
          },
          {
            type: "text",
            name: "Rolle",
            id: 3,
            required: true,
            sensitive: true,
            text: user.role,
            maxLength: -1,
          },
        ],
      };
    });
  }

  public static ConvertFormatToDataRecord(raw: unknown): [number, DataRecord] {
    const fields: Record<string, Record<string, unknown>> = this.GetFields(raw);

    const dataFields: DataField[] = Object.entries(fields).map(
      ([fieldId, fieldValues]) => this.CreateDataField(fieldId, fieldValues),
    );
    return [this.GetFormatId(raw), { dataFields: dataFields }];
  }

  //TODO: add version number
  public static ConvertDataRecordToFormat3(
    dataRecordType: "Anfrage" | "Fall",
    version: number,
    dataRecord: DataRecord,
  ): Record<string, any> {
    const format: Record<string, any> = {};

    format["data_record"] = dataRecordType;
    format["pk"] = version;

    const values: Record<string, any> = {};
    dataRecord.dataFields.forEach((field) => {
      values[field.name] = this.GetValue(field);
    });

    format["values"] = values;
    return format;
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
    if (!raw) return { dataFields: [] };
    const rawkey = Object.keys(raw["values"]);
    let i = 0;
    while (i < rawkey.length) {
      const fieldName = rawkey[i];
      const fieldValues = raw[fieldName];
      dataRecord.dataFields[i] = this.SetValue(
        dataRecord.dataFields[i],
        fieldValues,
      );
      i++;
    }

    return dataRecord;
  }

  public static ConvertSearchResultToDataRecord(
    searchResult: unknown,
  ): DataRecord[] {
    const results: Record<string, any>[] = this.normalizeInput(searchResult);

    return results.map((record) => this.GetDataRecord(record));
  }

  //tries to convert any input to arrays of records
  private static normalizeInput(input: unknown): Record<string, any>[] {
    if (typeof input === "string") {
      try {
        const parsed = JSON.parse(input);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
    if (Array.isArray(input)) return input as Record<string, any>[];
    if (input && typeof input === "object")
      return [input as Record<string, any>];
    return [];
  }
  private static GetDataRecord(record: Record<string, any>): DataRecord {
    return {
      dataFields: Object.entries(record).map(([key, value], index) => {
        return {
          type: "text",
          name: key,
          text: value as string,
          id: index,
          required: true,
          sensitive: true,
          maxLength: -1,
        };
      }),
    };
  }

  private static SetValue(field: DataField, value: unknown): DataField {
    if (value == null) return field;

    switch (field.type) {
      case "text":
        if (typeof value === "string") return { ...field, text: value };
        break;
      case "enum":
        if (typeof value === "string")
          return { ...field, selectedValue: value };
        break;
      case "date":
        if (typeof value === "string") return { ...field, date: value };
        break;
      case "boolean":
        if (typeof value === "boolean") return { ...field, isSelected: value };
        break;
      case "integer":
        if (typeof value === "number") return { ...field, value: value };
        break;
      case "list":
      case "group":
        if (Array.isArray(value)) return { ...field, element: value };
        break;
      default:
        const _exhaustive: never = field;
        return _exhaustive;
    }
    return field;
  }
  private static GetValue(
    field: DataField,
  ): string | number | boolean | DataField[] | DataField | null {
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
      case "list":
      case "group":
        return field.element;
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
  private static GetFormatId(raw: unknown) {
    if (
      raw &&
      typeof raw === "object" &&
      "pk" in raw &&
      typeof raw.pk === "number" &&
      raw.pk !== null
    ) {
      return raw.pk;
    }

    return -1;
  }

  private static IsDataField<T>(
    value: unknown,
    type: string,
    properties: string[],
  ): value is T {
    return (
      typeof value === "object" &&
      value !== null &&
      (value as any).type === type &&
      properties.every((prop) => prop in (value as any))
    );
  }

  private static CreateDataField(
    fieldId: string,
    fieldValues: Record<string, unknown>,
  ): DataField {
    const name = this.GetValueFromRecord(fieldValues, "name") as string;
    const required = this.GetValueFromRecord(
      fieldValues,
      "required",
    ) as boolean;
    const sensitive = this.GetValueFromRecord(
      fieldValues,
      "sensitive",
    ) as boolean;
    const type = this.GetValueFromRecord(fieldValues, "type") as string;
    const id = isNaN(Number(fieldId)) ? -1 : Number(fieldId);

    switch (type) {
      case "String": {
        const possibleValues = this.GetValueFromRecord(
          fieldValues,
          "possibleValues",
        ) as string[] | undefined;

        if (possibleValues == null) {
          return {
            type: "text",
            name: name,
            id: id,
            required,
            sensitive,
            text: "",
          };
        }

        return {
          type: "enum",
          name: name,
          id: id,
          required,
          sensitive,
          selectedValue: "",
          possibleValues,
        };
      }
      case "Date":
        return {
          type: "date",
          name: name,
          id: id,
          required,
          sensitive,
          date: this.getCurrentDate(),
        };
      case "Boolean":
        return {
          type: "boolean",
          name: name,
          id: id,
          required,
          sensitive,
          isSelected: false,
        };
      case "Integer":
        return {
          type: "integer",
          name: name,
          id: id,
          required,
          sensitive,
          value: (this.GetValueFromRecord(fieldValues, "value") as number) ?? 0,
          minValue:
            (this.GetValueFromRecord(fieldValues, "minValue") as number) ?? 0,
          maxValue:
            (this.GetValueFromRecord(fieldValues, "maxValue") as number) ?? -1,
        };
      case "List": {
        const element = this.GetValueFromRecord(
          fieldValues,
          "element",
        ) as Record<string, Record<string, unknown>>;
        const dataFields: DataField[] = Object.entries(element).map(
          ([fieldId, fieldVals]) => this.CreateDataField(fieldId, fieldVals),
        );
        return {
          type: "list",
          name: name,
          id: id,
          required,
          sensitive,
          element: dataFields,
        };
      }
      case "Group": {
        const element = this.GetValueFromRecord(
          fieldValues,
          "element",
        ) as Record<string, Record<string, unknown>>;
        const dataFields: DataField[] = Object.entries(element).map(
          ([fieldId, fieldVals]) => this.CreateDataField(fieldId, fieldVals),
        );

        return {
          type: "group",
          name: name,
          id: id,
          required,
          sensitive,
          element: dataFields,
        };
      }
      default:
        console.log(fieldValues);
        throw new Error("Unhandled type: " + type);
    }
  }

  private static GetValueFromRecord(
    raw: Record<string, unknown>,
    propertyName: string,
  ) {
    if (propertyName in raw) return raw[propertyName];
    return undefined;
  }

  private static getCurrentDate() {
    const date = new Date();
    const year = date.getFullYear();

    // Months are 0-indexed (0 = January), so we add 1
    // padStart(2, '0') ensures "5" becomes "05"
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }
}
