import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordEditor from "../components/DataRecordEditor";

interface Props {
  caller: IApiCaller;
  savedData: React.RefObject<boolean>;
  savedFormat: React.RefObject<boolean>;
  urlid: React.RefObject<number | null>;
}

function DataviewPage({ caller, savedData, savedFormat, urlid }: Props) {
  return (
    <DataRecordEditor
      caller={caller}
      savedData={savedData}
      savedFormat={savedFormat}
      urlid={urlid}
    />
  );
}
export default DataviewPage;
