import type { FilterOption } from "./FilterOption";
import type { Query } from "./Query";

export type Preset = {
  //type: "Anfrage" | "Fall" = "Anfrage";
  //title: string
  globalFilterOptions: FilterOption[];
  queries: Query[];
};
