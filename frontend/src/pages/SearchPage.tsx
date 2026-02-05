import { useEffect, useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import QueryDisplay from "../components/QueryDisplay";
import { DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Button } from "@mui/material";
import { ToNormalQuery, ToUiQuery } from "../classes/UiItems";

interface Props {
  caller: IApiCaller;
}

function SearchPage({ caller }: Props) {
  const [query, setQuery] = useState(
    ToUiQuery({ filterOptions: [], displayActions: [] }),
  );
  const [format, setFormat] = useState(new DataRecord([]));

  useEffect(() => {
    const fetchData = async () => {
      const result = await caller.GetFallJson();

      setFormat(DataRecordConverter.ConvertFormatToDataRecord(result.json));
    };
    fetchData();
  }, []);

  return (
    <div>
      <QueryDisplay query={query} onChange={setQuery} format={format} />
      <br></br> {/*line break for clarity*/}
      <Button onClick={() => alert(JSON.stringify(ToNormalQuery(query)))}>
        TEST Query json
      </Button>
      <Button onClick={async () => alert(JSON.stringify(format))}>
        show current format
      </Button>
    </div>
  );
}
export default SearchPage;
