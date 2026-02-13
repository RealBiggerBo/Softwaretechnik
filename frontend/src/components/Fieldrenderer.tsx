import TextDataField from "./TextDataField";
import DateDataField from "./DateDataField";
import EnumDataField from "./EnumDataField";
import IntegerDataField from "./IntegerDataField";
import ToggleDataField from "./ToggleDataField";
import { type DataField } from "../classes/DataField";

interface Props {
  field: DataField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
}

export function FieldRenderer({ field, isEditMode, onChange }: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextDataField
          textField={field}
          isEditMode={isEditMode}
          onChange={onChange}
        />
      );
    case "integer":
      return (
        <IntegerDataField
          integerField={field}
          isEditMode={isEditMode}
          onChange={onChange}
        />
      );
    case "boolean":
      return (
        <ToggleDataField
          toggleField={field}
          isEditMode={isEditMode}
          onChange={onChange}
        />
      );
    case "enum":
      return (
        <EnumDataField
          enumField={field}
          isEditMode={isEditMode}
          onChange={onChange}
        />
      );
    case "date":
      return (
        <DateDataField
          dateField={field}
          isEditMode={isEditMode}
          onChange={onChange}
        />
      );
  }

  throw new Error("Unhandled field type");
}
