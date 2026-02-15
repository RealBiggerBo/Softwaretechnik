import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";

export type Query = {
  //TODO: title:string
  displayActions: DisplayAction[];
  filterOptions: FilterOption[];
};
