import type { IntegerField } from "../classes/DataField";
import { TextField as Tf} from "@mui/material";


interface Props {
    integerField: IntegerField;
    isEditMode: boolean;
    onChange: (field: IntegerField) => void;
}

function IntegerDataField({ integerField, isEditMode, onChange }: Props) {
    return (
        <>
            {!isEditMode && <label>{integerField.name}</label>}
            {isEditMode && (
                <Tf
                    type="text"
                    onChange={(e) => {
                        integerField.name = e.target.value;
                        onChange(integerField);
                    }}
                    defaultValue={integerField.name}
                ></Tf>
            )}

            {
                <Tf
                    type="number"
                    label={integerField.name}
                    disabled={isEditMode}
                    onChange={(e) => {
                        integerField.value = parseInt(e.target.value, 10) || 0;
                        onChange(integerField);
                    }}
                    defaultValue={integerField.value}
                    size="small"
                ></Tf>
            }
        </>
    );
}

export default IntegerDataField;