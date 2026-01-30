import TextDataField from "./TextDataField";
import DateDataField from "./DateDataField";
import EnumDataField from "./EnumDataField";
import IntegerDataField from "./IntegerDataField";
import ToggleDataField from "./ToggleDataField";
import { DateField, EnumField, IntegerField, TextField, ToggleField, type DataField } from "../classes/DataField";


interface Props {
  field: DataField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
}

export function FieldRenderer({ field, isEditMode, onChange }: Props) {
  if (field instanceof TextField) {
    return (
      <TextDataField textField={field} isEditMode={isEditMode} onChange={onChange} />
    );
  }

  if (field instanceof IntegerField) {
    return (
      <IntegerDataField integerField={field} isEditMode={isEditMode} onChange={onChange}/>
    );
  }

  if (field instanceof ToggleField) {
    return (
      <ToggleDataField toggleField={field} isEditMode={isEditMode} onChange={onChange}/>
    );
  }

  if (field instanceof EnumField) {
    return (
      <EnumDataField enumField={field} isEditMode={isEditMode} onChange={onChange}/>
    );
  }

  if (field instanceof DateField) {
    return (
      <DateDataField dateField={field} isEditMode={isEditMode} onChange={onChange}/>
    );
  }

  return null;
}

