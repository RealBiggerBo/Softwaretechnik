export type EmptyDisplayAction = {
  type: "Empty";
  fieldId: number;
  title: string;
};

export type MaxDisplayAction = {
  type: "Max";
  fieldId: number;
  title: string;
};

export type MinDisplayAction = {
  type: "Min";
  fieldId: number;
  title: string;
};

export type AverageDisplayAction = {
  type: "Average";
  fieldId: number;
  title: string;
};

export type DisplayAction =
  | EmptyDisplayAction
  | MaxDisplayAction
  | MinDisplayAction
  | AverageDisplayAction;
