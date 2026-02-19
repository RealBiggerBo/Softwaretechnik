import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordEditor from "../components/DataRecordEditor";

interface Props {
  caller: IApiCaller;

  savedData: React.RefObject<boolean>;
  savedFormat: React.RefObject<boolean>;
}

function DataviewPage({ caller, hasDataChanges, hasFormatChanges }: Props) {
  return (
    <DataRecordEditor
      caller={caller}
      hasDataChanges={hasDataChanges}
      hasFormatChanges={hasFormatChanges}
    />
  );
}
export default DataviewPage;
