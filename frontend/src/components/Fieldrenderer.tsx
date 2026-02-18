import TextDataField from "./TextDataField";
import DateDataField from "./DateDataField";
import EnumDataField from "./EnumDataField";
import IntegerDataField from "./IntegerDataField";
import ToggleDataField from "./ToggleDataField";
import ListDataField from "./ListDataField";
import { type DataField } from "../classes/DataField";

interface Props {
  field: DataField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  onAdd: (fieldToAdd: DataField) => void;
  onDelete: (id: number) => void;
}

export function FieldRenderer({
  field,
  isEditMode,
  onChange,
  onDelete,
  onAdd,
}: Props) {
  switch (field.type) {
    case "text":
      return (
        <TextDataField
          textField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case "integer":
      return (
        <IntegerDataField
          integerField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case "boolean":
      return (
        <ToggleDataField
          toggleField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case "enum":
      return (
        <EnumDataField
          enumField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case "date":
      return (
        <DateDataField
          dateField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
        />
      );
    case "list":
      return (
        <ListDataField
          listField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          onDelete={onDelete}
          onAdd={onAdd}
        />
      );
  }

  throw new Error("Unhandled field type");
}
