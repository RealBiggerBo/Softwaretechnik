import { useEffect, useState } from "react";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import type { IApiCaller } from "../classes/IApiCaller";
import { FieldRenderer } from "./Fieldrenderer";
import { Button, Fab } from "@mui/material";
import { type DataRecord } from "../classes/DataRecord";
import { type DataField } from "../classes/DataField";
import { useSearchParams } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import AddField from "./AddField";
import ToggleDataField from "./ToggleDataField";
import IntegerDataField from "./IntegerDataField";
import DateDataField from "./DateDataField";
import TextDataField from "./TextDataField";

interface Props {
  caller: IApiCaller;
}

function AnfragenGenerator({ caller }: Props) {
  const [isEditMode, setIsEditMode] = useState(false);
  const [record, setRecord] = useState<DataRecord | null>(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function loadData() {
      const res = await caller.GetAnfrageJson();

      if (!res.success) {
        return;
      }
      let datarecord = DataRecordConverter.ConvertFormatToDataRecord(res.json);

      let id = parseInt(searchParams.get("id") ?? "", 10);

      if (!isNaN(id)) {
        const res2 = await caller.TrySearchAnfrageByID(id);

        if (!res2.success) {
          return;
        }

        datarecord = DataRecordConverter.MergeDataRecordWithData(
          datarecord,
          res2.json,
        );
      }
      setRecord(datarecord);
    }
    loadData();
  }, [caller]);

  async function Save() {
    if (!record) return;

    let id = parseInt(searchParams.get("id") ?? "", 10);
    if (!isNaN(id)) {
      const recordJson = DataRecordConverter.ConvertDataRecordToFormat(record);
      await caller.TryUpdateAnfrage(recordJson);
    }

    const recordJson = DataRecordConverter.ConvertDataRecordToFormat(record);
    await caller.TryCreateAnfrage(recordJson);
    return;
  }

  function handleFieldChange(updatedField: DataField) {
    if (!record) return;
    setRecord({
      dataFields: record.dataFields.map((f) =>
        f.id === updatedField.id ? updatedField : f,
      ),
    });
  }

  function handleCreateField(type: string) {
    if (!record) return;
    const id = record.dataFields[record.dataFields.length - 1].id + 1;
    switch (type) {
      case "text":
        const newTextField: DataField = {
          type: "text",
          name: "neues Textfeld",
          id: id,
          required: false,
          text: "",
          maxLength: -1,
        }; //new TextField("neues Textfeld", id, false, "");
        //setRecord(new DataRecord([...record.dataFields, newTextField]));
        setRecord({ dataFields: [...record.dataFields, newTextField] });
        return (
          <TextDataField
            textField={newTextField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "date":
        const newDateField: DataField = {
          type: "date",
          name: "neues Datumsfeld",
          id: id,
          required: false,
          date: "",
        }; //new DateField("neues Datumsfeld", id, false, "");
        //setRecord(new DataRecord([...record.dataFields, newDateField]));
        setRecord({ dataFields: [...record.dataFields, newDateField] });
        return (
          <DateDataField
            dateField={newDateField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "integer":
        const newIntegerField: DataField = {
          type: "integer",
          name: "neues Zahlenfeld",
          id: id,
          required: false,
          value: 0,
          minValue: 0,
          maxValue: 1,
        }; //new IntegerField("neues Integerfeld", id, false, 0);
        //setRecord(new DataRecord([...record.dataFields, newIntegerField]));
        setRecord({ dataFields: [...record.dataFields, newIntegerField] });
        return (
          <IntegerDataField
            integerField={newIntegerField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      case "toggle":
        const newToggleField: DataField = {
          type: "boolean",
          name: "neues Togglefeld",
          id: id,
          required: false,
          isSelected: false,
        }; // new ToggleField("neues Togglefeld",id,false,false);
        //setRecord(new DataRecord([...record.dataFields, newToggleField]));
        setRecord({ dataFields: [...record.dataFields, newToggleField] });
        return (
          <ToggleDataField
            toggleField={newToggleField}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <h1>Hallo ich bin eine Anfrage</h1>
      <Fab
        color="primary"
        aria-label="edit"
        size="small"
        style={{ float: "right" }}
        onClick={() => setIsEditMode(!isEditMode)}
      >
        <EditIcon />
      </Fab>
      <br />
      {record?.dataFields.map((field) => (
        <div key={field.id}>
          <FieldRenderer
            field={field}
            isEditMode={isEditMode}
            onChange={handleFieldChange}
          />
          <br />
        </div>
      ))}
      <AddField
        caller={caller}
        handleCreateField={handleCreateField}
        isEditMode={!isEditMode}
      />
      <br />
      <Button variant="contained" onClick={Save}>
        Speichern
      </Button>
    </div>
  );
}

export default AnfragenGenerator;
