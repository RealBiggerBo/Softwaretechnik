import TextDataField from "./TextDataField";
import DateDataField from "./DateDataField";
import EnumDataField from "./EnumDataField";
import IntegerDataField from "./IntegerDataField";
import ToggleDataField from "./ToggleDataField";
import ListDataField from "./ListDataField";
import { type DataField } from "../classes/DataField";
import GroupDataField from "./GroupDataField";
import {
  Checkbox,
  checkboxClasses,
  Collapse,
  FormControlLabel,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useState } from "react";

interface Props {
  field: DataField;
  isEditMode: boolean;
  onChange: (field: DataField) => void;
  onAdd: (fieldToAdd: DataField) => void;
  onDelete: (id: number) => void;
  setOpenDialog: (showDialog: boolean) => void;
}

function GetFieldComponent(
  field: DataField,
  isEditMode: boolean,
  onChange: (field: DataField) => void,
  onAdd: (fieldToAdd: DataField) => void,
  onDelete: (id: number) => void,
  setOpenDialog: (showDialog: boolean) => void,
) {
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
          setOpenDialog={setOpenDialog}
          onAdd={onAdd}
        />
      );
    case "group":
      return (
        <GroupDataField
          groupField={field}
          isEditMode={isEditMode}
          onChange={onChange}
          setOpenDialog={setOpenDialog}
        />
      );
    default:
      const _exhaustive: never = field;
      return _exhaustive;
  }
}

function GetFieldCollapse(
  field: DataField,
  onChange: (toChange: DataField) => void,
) {
  return (
    <>
      <Stack spacing={1} sx={{ alignItems: "flex-start" }}>
        <FormControlLabel
          checked={field.required}
          control={
            <Checkbox
              onChange={(selected) =>
                onChange({
                  ...field,
                  required: selected.target.checked,
                })
              }
            />
          }
          label="Pflichtfeld"
          labelPlacement="start"
        />
        <FormControlLabel
          checked={field.sensitive}
          control={
            <Checkbox
              onChange={(selected) =>
                onChange({ ...field, sensitive: selected.target.checked })
              }
            />
          }
          label="Sensibel"
          labelPlacement="start"
        />
      </Stack>
    </>
  );
}

export function FieldRenderer({
  field,
  isEditMode,
  onChange,
  onAdd,
  onDelete,
  setOpenDialog,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center" }}>
        {isEditMode && (
          <IconButton
            onClick={() => {
              if (isEditMode) setIsOpen(!isOpen);
            }}
          >
            {isOpen && isEditMode ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </IconButton>
        )}
        {GetFieldComponent(
          field,
          isEditMode,
          onChange,
          onAdd,
          onDelete,
          setOpenDialog,
        )}
      </div>
      <Collapse in={isOpen && isEditMode}>
        {GetFieldCollapse(field, onChange)}
      </Collapse>
    </>
  );
}
