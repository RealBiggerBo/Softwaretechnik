import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { type DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Button } from "@mui/material";
import { ToNormalPreset, ToUiPreset } from "../classes/UiItems";
import PresetDisplay from "../components/PresetDisplay";

interface Props {
  caller: IApiCaller;
}

function SearchPage({ caller }: Props) {
  const [preset, setPreset] = useState(
    ToUiPreset({ globalFilterOptions: [], queries: [] }),
  );
  const defaultFormat: DataRecord = { dataFields: [] };
  const [format, setFormat] = useState(defaultFormat);

  useEffect(() => {
    const fetchData = async () => {
      const result = await caller.GetAnfrageJson();

      setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json));
    };
    fetchData();
  }, []);

  return (
    <div>
      <PresetDisplay preset={preset} onChange={setPreset} format={format} />
      <br></br> {/*line break for clarity*/}
      <Button onClick={() => alert(JSON.stringify(ToNormalPreset(preset)))}>
        TEST Query json
      </Button>
      <Button onClick={async () => alert(JSON.stringify(format))}>
        show current format
      </Button>
    </div>
  );
}
export default SearchPage;
