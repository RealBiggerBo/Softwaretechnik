import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import DataRecordEditor from "../components/DataRecordEditor";

interface Props {
  caller: IApiCaller;
}

function DataviewPage({ caller }: Props) {
  return <DataRecordEditor caller={caller} />;
}
export default DataviewPage;
