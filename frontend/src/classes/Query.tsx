import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";

export class Query {
  displayActions: DisplayAction[] = [];
  filterOptions: FilterOption[] = [];
}
