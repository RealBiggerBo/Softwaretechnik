import { DateField} from "../classes/DataField";
import { TextField as Tf} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";


interface Props {
  dateField: DateField;
  isEditMode: boolean;
  onChange: (field: DateField) => void;
}

function DateDataField({ dateField, isEditMode, onChange }: Props) {
  return (
    <>
      {!isEditMode && <label>{dateField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            const updatedDateField = new DateField(
              e.target.value,
              dateField.id,
              dateField.required,
              dateField.date
            );
            onChange(updatedDateField);
          }}
          defaultValue={dateField.name}
        ></Tf>
      )}

      {
        <DatePicker
          label={dateField.name}
          value={dateField.date ? dayjs(dateField.date) : null}
          disabled={isEditMode}
          onChange={(newValue) => {
            const updatedDateField = new DateField(
              dateField.name,
              dateField.id,
              dateField.required,
              newValue ? newValue.format("YYYY-MM-DD"): ""
            );
            onChange(updatedDateField);
          }}
        ></DatePicker>
      }
    </>
  );
}

export default DateDataField;