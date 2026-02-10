import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";

export type Query = {
  displayActions: DisplayAction[];
  filterOptions: FilterOption[];
};
