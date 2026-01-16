import type { DataField } from "./DataField";
import type { FilterOption } from "./FilterOption";

export class Preset {
  filters: { [dataFieldId: number]: FilterOption } = [];
}
