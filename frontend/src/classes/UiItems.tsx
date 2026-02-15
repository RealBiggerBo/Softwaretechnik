import type { DisplayAction } from "./DisplayAction";
import type { FilterOption } from "./FilterOption";
import type { Preset } from "./Preset";
import type { Query } from "./Query";

export type UiItem<T> = {
  id: string;
  value: T;
};

export type UiQuery = {
  queryTitle: string;
  displayActions: UiItem<DisplayAction>[];
  filterOptions: UiItem<FilterOption>[];
};

export type UiPreset = {
  globalFilterOptions: UiItem<FilterOption>[];
  queries: UiItem<UiQuery>[];
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
    queryTitle: query.queryTitle,
    displayActions: query.displayActions.map((da) => ToUiItem(da)),
    filterOptions: query.filterOptions.map((fo) => ToUiItem(fo)),
  };

  return ToUiItem(uiQuery, existing);
}

export function ToUiPreset(preset: Preset, existing?: UiItem<UiPreset>) {
  const uiPreset: UiPreset = {
    globalFilterOptions: preset.globalFilterOptions.map((fo) => ToUiItem(fo)),
    queries: preset.queries.map((q) => ToUiQuery(q)),
  };

  return ToUiItem(uiPreset, existing);
}

export function ToNormalQuery(uiQuery: UiItem<UiQuery>): Query {
  return {
    queryTitle: uiQuery.value.queryTitle,
    displayActions: uiQuery.value.displayActions.map(
      (uiDisplayAction) => uiDisplayAction.value,
    ),
    filterOptions: uiQuery.value.filterOptions.map(
      (uiFilterOption) => uiFilterOption.value,
    ),
  };
}

export function ToNormalPreset(uiPreset: UiItem<UiPreset>): Preset {
  return {
    globalFilterOptions: uiPreset.value.globalFilterOptions.map(
      (uiFilterOption) => uiFilterOption.value,
    ),
    queries: uiPreset.value.queries.map((uiQuery) => ToNormalQuery(uiQuery)),
  };
}
