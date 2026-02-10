import type { FilterOption } from "./FilterOption";
import type { Query } from "./Query";

export type Preset = {
  //type: "Anfrage" | "Fall" = "Anfrage";
  globalFilterOptions: FilterOption[];
  queries: Query[];
};
