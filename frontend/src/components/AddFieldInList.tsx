import { type DataField, type ListField } from "../classes/DataField";
import { FieldRenderer } from "./Fieldrenderer";

interface Props {
  listField: ListField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  onDelete: (id: number) => void;
  onAdd: (id: DataField) => void;
}

function AddFieldInList({
  listField,
  isEditMode,
  onChange,
  onDelete,
  onAdd,
}: Props) {
  return (
    <>
      {listField.element.map((e) => (
        <>
          <FieldRenderer
            field={e}
            isEditMode={isEditMode}
            onChange={onChange}
            onDelete={onDelete}
            onAdd={onAdd}
          />
          <br />
        </>
      ))}
    </>
  );
}
export default AddFieldInList;
