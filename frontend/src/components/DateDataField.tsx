import { type DateField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  dateField: DateField;
  isEditMode: boolean;
  onChange: (field: DateField) => void;
  onDelete: (id: number) => void;
}

function DateDataField({ dateField, isEditMode, onChange, onDelete }: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{dateField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => onChange({ ...dateField, name: e.target.value })}
          value={dateField.name}
        ></Tf>
      )}

      {
        <>
          <DatePicker
            label={dateField.name}
            value={dateField.date ? dayjs(dateField.date) : null}
            disabled={isEditMode}
            onChange={(newValue) =>
              onChange({
                ...dateField,
                date: newValue ? newValue.format("YYYY-MM-DD") : "",
              })
            }
            // onChange={(newValue) => {
            //   const updatedDateField = new DateField(
            //     dateField.name,
            //     dateField.id,
            //     dateField.required,
            //     newValue ? newValue.format("YYYY-MM-DD") : "",
            //   );
            //   onChange(updatedDateField);
            // }}
          ></DatePicker>
          <br />
        </>
      }
      {isEditMode && (
        <DeleteIcon color="error" onClick={() => onDelete(dateField.id)} />
      )}
    </Stack>
  );
}

export default DateDataField;
