import type { DisplayAction, FilterOption } from "./FilterOption";

export class Query {
  displayActions: DisplayAction[] = [];
  filterOptions: { id: Number; filter: FilterOption }[] = [];
}
