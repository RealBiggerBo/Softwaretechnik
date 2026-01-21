import type { DisplayAction, FilterOption } from "./FilterOption";

export class Query {
  displayActions: { id: Number; action: DisplayAction }[] = [];
  filterOptions: { id: Number; filter: FilterOption }[] = [];
}
