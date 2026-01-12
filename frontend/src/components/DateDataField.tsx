import type { DateField} from "../classes/DataField";
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
            dateField.name = e.target.value;
            onChange(dateField);
          }}
          defaultValue={dateField.name}
        ></Tf>
      )}

      {
        <DatePicker
          label={dateField.name}
          value={dateField.date ? dayjs(dateField.date) : null}
          disabled={isEditMode}
          onChange={(newValue) => {dateField.date = newValue ? newValue.format("YYYY-MM-DD"): "";}}
        ></DatePicker>
      }
    </>
  );
}

export default DateDataField;