import {
  AverageFilterAction,
  DateRangeFilter,
  DateValueFilter,
  FilterAction,
  IntegerRangeFilter,
  IntegerValueFilter,
  MaxFilterAction,
  MinFilterAction,
  RangeFilter,
  StringValueFilter as TextValueFilter,
  ValueFilter,
  type FilterOption,
} from "./FilterOption";

class FilterCollection {
  filterActions: FilterAction[] = [];
  valueFilter?: ValueFilter = undefined;
  rangeFilter?: RangeFilter = undefined;

  constructor(
    filterActions: FilterAction[],
    valueFilter?: ValueFilter,
    rangeFilter?: RangeFilter,
  ) {
    this.filterActions = filterActions;
    this.valueFilter = valueFilter;
    this.rangeFilter = rangeFilter;
  }

  static GetTextFilter() {
    return new FilterCollection([], TextValueFilter);
  }
  static GetDataFilters() {
    return new FilterCollection(
      [MaxFilterAction, MinFilterAction, AverageFilterAction],
      DateValueFilter,
      DateRangeFilter,
    );
  }
  static GetIntegerFilters() {
    return new FilterCollection(
      [MaxFilterAction, MinFilterAction, AverageFilterAction],
      IntegerValueFilter,
      IntegerRangeFilter,
    );
  }
  static GetEnumFilters() {
    return new FilterCollection([], IntegerValueFilter);
  }
  static GetToggleFilters() {}
}

export abstract class FilterDataField {
  name: string = "";
  id: number = -1;
  allowedFilterOptions: FilterCollection = new FilterCollection([]);
  filter?: FilterOption = undefined;

  constructor(
    name: string,
    id: number,
    allowedFilterOptions: FilterCollection,
    filter?: FilterOption,
  ) {
    this.name = name;
    this.id = id;
    this.allowedFilterOptions = allowedFilterOptions;
    this.filter = filter;
  }
}

export class FilterTextField extends FilterDataField {
  constructor(name: string, id: number, filter?: FilterOption) {
    super(name, id, new FilterCollection([]), filter);
  }
}
export class FilterDateField extends FilterDataField {
  constructor(name: string, id: number, filter?: FilterCollection) {
    super(name, id, new FilterCollection([]), filter);
  }
}
