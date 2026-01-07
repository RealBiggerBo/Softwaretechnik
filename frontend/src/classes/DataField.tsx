export abstract class DataField {
  name: string = "";
  id: number = -1;
  required: boolean = false;

  constructor(name: string, id: number, required: boolean = true) {
    this.name = name;
    this.id = id;
    this.required = required;
  }

  Display(): string {
    return "";
  }
  IsValid(): boolean {
    return true;
  }
}

export class TextField extends DataField {
  text: string = "";
  maxLength: number = -1; //no length bound

  constructor(
    name: string,
    id: number,
    required: boolean = true,
    text: string,
    maxLength: number = -1,
  ) {
    super(name, id, required);
    this.text = text;
    this.maxLength = maxLength;
  }

  override Display(): string {
    return this.name + ": " + this.text;
  }
  override IsValid(): boolean {
    return this.maxLength < 0 || this.text.length <= this.maxLength;
  }
}

export class DateField extends DataField {
  date: string = ""; //YYYY-MM-DD

  constructor(
    name: string,
    id: number,
    required: boolean = true,
    date: string,
  ) {
    super(name, id, required);
    this.date = date;
  }

  override Display(): string {
    return this.name + ": " + this.date;
  }
  override IsValid(): boolean {
    const datePattern = /dddd-dd-dd/;
    //TODO: check for valid date eg. 2026-02-31 -> invalid
    return datePattern.test(this.date);
  }
}

export class IntegerField extends DataField {
  value: number = 0;
  minValue: number = 0;
  maxValue: number = -1; //no upper bound (due to minValue > maxValue)

  constructor(
    name: string,
    id: number,
    required: boolean = true,
    value: number,
    minValue: number = 0,
    maxValue: number = -1,
  ) {
    super(name, id, required);
    this.value = value;
    this.minValue = minValue;
    this.maxValue = maxValue;
  }

  override Display(): string {
    return this.name + ": " + this.value.toString();
  }
  override IsValid(): boolean {
    return (
      this.minValue > this.maxValue ||
      (this.value >= this.minValue && this.value <= this.maxValue)
    );
  }
}

export class EnumField extends DataField {
  selectedValue: string = "";
  enumType: string = "";
  private possibleValues: string[] = [];

  constructor(
    name: string,
    id: number,
    required: boolean = true,
    enumType: string,
  ) {
    super(name, id, required);
    this.enumType = enumType;
    //Maybe fill possible values here based on enumType (maybe get possible values from backend?)
  }

  GetPossibleValues(): string[] {
    return this.possibleValues;
  }
  SetPossibleValues(newValues: string[]): void {
    this.possibleValues = newValues;
  }

  override Display(): string {
    return this.name + ": " + this.selectedValue;
  }
  override IsValid(): boolean {
    return this.possibleValues.includes(this.selectedValue);
  }
}

export class ToggleField extends DataField {
  isSelected: boolean = false;

  constructor(
    name: string,
    id: number,
    required: boolean = true,
    isSelected: boolean,
  ) {
    super(name, id, required);
    this.isSelected = isSelected;
  }

  override Display(): string {
    return this.name + ": " + this.isSelected;
  }
}
