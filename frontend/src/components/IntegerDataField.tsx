import { IntegerField } from "../classes/DataField";
import { Stack, TextField as Tf} from "@mui/material";


interface Props {
    integerField: IntegerField;
    isEditMode: boolean;
    onChange: (field: IntegerField) => void;
}

function IntegerDataField({ integerField, isEditMode, onChange }: Props) {
    return (
        <Stack direction="row" spacing={2} alignItems="center">
            {!isEditMode && <label>{integerField.name}</label>}
            {isEditMode && (
                <Tf
                    type="text"
                    onChange={(e) => {
                        const updatedintegerField = new IntegerField(
                            e.target.value,
                            integerField.id,
                            integerField.required,
                            integerField.value,
                            integerField.minValue,
                            integerField.maxValue
                        );
                        onChange(updatedintegerField);
                    }}
                    defaultValue={integerField.name}
                ></Tf>
            )}

            {
                <Tf
                    type="number"
                    disabled={isEditMode}
                    value={integerField.value ?? 0}
                    onChange={(e) => {
                        const updatedintegerField = new IntegerField(
                            integerField.name,
                            integerField.id,
                            integerField.required,
                            parseInt(e.target.value),
                            integerField.minValue,
                            integerField.maxValue
                        );
                        onChange(updatedintegerField);
                    }}
                    size="small"
                    sx={{width: 100}}
                ></Tf>
            }
        </Stack>
    );
}

export default IntegerDataField;