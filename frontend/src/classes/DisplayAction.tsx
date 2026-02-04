export type EmptyDisplayAction = {
  type: "Empty";
  fieldId: number;
};

export type MaxDisplayAction = {
  type: "Max";
  fieldId: number;
};

export type MinDisplayAction = {
  type: "Min";
  fieldId: number;
};

export type AverageDisplayAction = {
  type: "Average";
  fieldId: number;
};

export type DisplayAction =
  | EmptyDisplayAction
  | MaxDisplayAction
  | MinDisplayAction
  | AverageDisplayAction;
