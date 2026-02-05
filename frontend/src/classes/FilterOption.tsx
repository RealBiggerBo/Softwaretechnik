export type EmptyFilter = {
  type: "Empty";
  fieldId: number;
};

export type IntegerValueFilter = {
  type: "IntegerValueFilter";
  fieldId: number;
  value: number;
};

export type DateValueFilter = {
  type: "DateValueFilter";
  fieldId: number;
  value: string;
};

export type StringValueFilter = {
  type: "StringValueFilter";
  fieldId: number;
  value: string;
};

export type EnumValueFilter = {
  type: "EnumValueFilter";
  fieldId: number;
  value: string[];
  possibleValues: string[];
};

export type IntegerRangeFilter = {
  type: "IntegerRangeFilter";
  fieldId: number;
  minValue: number;
  maxValue: number;
};

export type DateRangeFilter = {
  type: "DateRangeFilter";
  fieldId: number;
  minValue: string;
  maxValue: string;
};

export type FilterOption =
  | EmptyFilter
  | IntegerValueFilter
  | DateValueFilter
  | StringValueFilter
  | EnumValueFilter
  | IntegerRangeFilter
  | DateRangeFilter;
