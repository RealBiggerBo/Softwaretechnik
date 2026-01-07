import type { TextField } from "../classes/DataField";

interface Props {
  textField: TextField;
  isEditMode: boolean;
  onChange: (field: TextField) => void;
}

function TextDataField({ textField, isEditMode, onChange }: Props) {
  return (
    <>
      {!isEditMode && <label>{textField.name}</label>}
      {isEditMode && (
        <input
          type="text"
          onChange={(e) => {
            textField.name = e.target.value;
            onChange(textField);
          }}
          defaultValue={textField.name}
        ></input>
      )}

      {
        <input
          type="text"
          disabled={isEditMode}
          onChange={(e) => {
            textField.text = e.target.value;
            onChange(textField);
          }}
          defaultValue={textField.text}
        ></input>
      }
    </>
  );
}

export default TextDataField;
