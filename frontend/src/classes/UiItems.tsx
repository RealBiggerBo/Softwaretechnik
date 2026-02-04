import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";
import type { Query } from "./Query";

export type UiItem<T> = {
  id: string;
  value: T;
};

export type UiQuery = {
  displayActions: UiItem<DisplayAction>[];
  filterOptions: UiItem<FilterOption>[];
};

export function GenUiString() {
  return crypto.randomUUID();
}

export function ToUiItem<T>(action: T, existing?: UiItem<T>): UiItem<T> {
  return { value: { ...action }, id: existing?.id ?? GenUiString() };
}

export function ToUiQuery(
  query: Query,
  existing?: UiItem<UiQuery>,
): UiItem<UiQuery> {
  const uiQuery: UiQuery = {
    displayActions: query.displayActions.map((da) => ToUiItem(da)),
    filterOptions: query.filterOptions.map((fo) => ToUiItem(fo)),
  };

  return ToUiItem(uiQuery, existing);
}
