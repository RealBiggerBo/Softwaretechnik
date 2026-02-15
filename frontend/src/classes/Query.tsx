import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";

export type Query = {
  queryTitle: string;
  displayActions: DisplayAction[];
  filterOptions: FilterOption[];
};
