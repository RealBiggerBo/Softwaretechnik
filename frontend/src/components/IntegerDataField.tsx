import { type IntegerField } from "../classes/DataField";
import { Stack, TextField as Tf } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props {
  integerField: IntegerField;
  isEditMode: boolean;
  onChange: (field: IntegerField) => void;
  onDelete: (id: number) => void;
}

function IntegerDataField({
  integerField,
  isEditMode,
  onChange,
  onDelete,
}: Props) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      {!isEditMode && <label>{integerField.name}</label>}
      {isEditMode && (
        <Tf
          type="text"
          onChange={(e) => {
            onChange({
              ...integerField,
              name: e.target.value,
            });
          }}
          value={integerField.name}
        ></Tf>
      )}

      {
        <Tf
          type="number"
          disabled={isEditMode}
          value={integerField.value ?? 0}
          onChange={(e) => {
            onChange({ ...integerField, value: parseInt(e.target.value) });
          }}
          size="small"
          sx={{ width: 100 }}
        ></Tf>
      }
      {isEditMode && (
        <DeleteIcon color="error" onClick={() => onDelete(integerField.id)} />
      )}
    </Stack>
  );
}

export default IntegerDataField;
