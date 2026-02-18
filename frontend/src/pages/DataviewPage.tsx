import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordEditor from "../components/DataRecordEditor";

interface Props {
  caller: IApiCaller;
  setHasDataChanges: (setHasDataChanges: boolean) => void;
  setHasFormatChanges: (setHasFormatChanges: boolean) => void;
  hasDataChanges: boolean;
  hasFormatChanges: boolean;
}

function DataviewPage({
  caller,
  setHasDataChanges,
  setHasFormatChanges,
  hasDataChanges,
  hasFormatChanges,
}: Props) {
  return (
    <DataRecordEditor
      caller={caller}
      setHasDataChanges={setHasDataChanges}
      setHasFormatChanges={setHasFormatChanges}
      hasDataChanges={hasDataChanges}
      hasFormatChanges={hasFormatChanges}
    />
  );
}
export default DataviewPage;
