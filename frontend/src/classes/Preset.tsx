import type { FilterOption } from "./FilterOption";
import type { Query } from "./Query";

export type Preset = {
  globalFilterOptions: FilterOption[];
  queries: Query[];
};
