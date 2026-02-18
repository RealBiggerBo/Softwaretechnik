import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import AnfragenGenerator from "../components/AnfragenGenerator";
import FallGenerator from "../components/FallGenerator";
import LetzteAnfrage from "../components/LetzeAnfrage";
import LetzterFall from "../components/LetzterFall";
import DataRecordEditor from "../components/DataRecordEditor";

interface Props {
  caller: IApiCaller;
}

function DataviewPage({ caller }: Props) {
  return <DataRecordEditor caller={caller} />;
}
export default DataviewPage;
