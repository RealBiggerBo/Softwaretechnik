import type { FilterOption } from "./FilterOption";
import type { Query } from "./Query";

export type Preset = {
  PresetTitle?: string;
  globalRecordType?: "Fall" | "Anfrage";
  globalFilterOptions: FilterOption[];
  queries: Query[];
};
