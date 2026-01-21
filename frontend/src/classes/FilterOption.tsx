export abstract class FilterOption {}

export abstract class ValueFilter extends FilterOption {}

export class IntegerValueFilter extends ValueFilter {
  value: number = 0;
}

export class DateValueFilter extends ValueFilter {
  value: string = "";
}

export class StringValueFilter extends ValueFilter {
  value: string = "";
}

export class EnumValueFilter extends ValueFilter {
  value: string = "";
  possibleValues: string[] = [];
}

export abstract class RangeFilter extends FilterOption {}

export class IntegerRangeFilter extends RangeFilter {
  minValue: number = 0;
  maxValue: number = 0;
}

export class DateRangeFilter extends RangeFilter {
  minValue: string = "";
  maxValue: string = "";
}

export abstract class DisplayAction {}

export class MaxFilterAction extends DisplayAction {}
export class MinFilterAction extends DisplayAction {}
export class AverageFilterAction extends DisplayAction {}
