export abstract class DataField {
  private id: number = -1;
  private required: boolean = false;

  Display(): string {
    return "";
  }
}

export class TextField extends DataField {
  text: string = "";

  override Display(): string {
    return this.text;
  }
}

//TODO: add other field types (Date, Number...)
