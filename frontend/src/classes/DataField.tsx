import type { DataRecord } from "./DataRecord";

type BaseField = {
  name: string;
  id: number;
  required: boolean;
  sensitive: boolean;
};

export type TextField = BaseField & {
  type: "text";
  text: string;
};

export type DateField = BaseField & {
  type: "date";
  date: string; // YYYY-MM-DD
};

export type IntegerField = BaseField & {
  type: "integer";
  value: number;
  minValue: number;
  maxValue: number; // -1 = no upper bound (minValue > maxValue)
};

export type EnumField = BaseField & {
  type: "enum";
  selectedValue: string;
  possibleValues: string[];
};

export type ToggleField = BaseField & {
  type: "boolean";
  isSelected: boolean;
};

export type ListField = BaseField & {
  type: "list";
  element: DataRecord;
  records: DataRecord[];
};

export type GroupField = BaseField & {
  type: "group";
  element: DataRecord;
};

export type DataField =
  | TextField
  | DateField
  | IntegerField
  | EnumField
  | ToggleField
  | ListField
  | GroupField;
