import { Button, Fab } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import type { DataField } from "../classes/DataField";

interface Props {
  isEditMode: boolean;
  addNewField: (newField: DataField) => void;
}

function AddNewDataField({ isEditMode, addNewField }: Props) {
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  return (
    <div>
      <Fab
        color="primary"
        aria-label="add"
        size="small"
        style={{ float: "left" }}
        onClick={() => setShowFieldSelector(true)}
        disabled={!isEditMode}
      >
        <AddIcon />
      </Fab>
      {showFieldSelector && (
        <div>
          <Button
            onClick={() => {
              addNewField({
                type: "text",
                name: "Neues Textfeld",
                id: -1,
                required: false,
                text: "",
                maxLength: -1,
              });
              setShowFieldSelector(false);
            }}
            size="small"
            variant="outlined"
            style={{ margin: "5px" }}
          >
            Text
          </Button>
          <Button
            onClick={() => {
              addNewField({
                type: "date",
                name: "Neues Datumsfeld",
                id: -1,
                required: false,
                date: "0000-00-00",
              });
              setShowFieldSelector(false);
            }}
            size="small"
            variant="outlined"
            style={{ margin: "5px" }}
          >
            Datum
          </Button>
          <Button
            onClick={() => {
              addNewField({
                type: "integer",
                name: "Neues Zahlenfeld",
                id: -1,
                required: false,
                value: 0,
                minValue: 1,
                maxValue: -1,
              });
              setShowFieldSelector(false);
            }}
            size="small"
            variant="outlined"
            style={{ margin: "5px" }}
          >
            Zahl
          </Button>
          <Button
            onClick={() => {
              addNewField({
                type: "boolean",
                name: "Neues Togglefeld",
                id: -1,
                required: false,
                isSelected: false,
              });
              setShowFieldSelector(false);
            }}
            size="small"
            variant="outlined"
            style={{ margin: "5px" }}
          >
            Toggle
          </Button>
          <br />
        </div>
      )}
    </div>
  );
}

export default AddNewDataField;
