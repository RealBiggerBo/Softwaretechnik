import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import AnfragenGenerator from "../components/AnfragenGenerator";
import FallGenerator from "../components/FallGenerator";

interface Props {
  caller: IApiCaller;
}

function DataviewPage({ caller }: Props) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (type === "neue-anfrage") {
    return(
    <div>
      <AnfragenGenerator caller={caller}/>
    </div>
    );
  }

  if (type === "neuer-fall") {
    return(
    <div>
      <FallGenerator caller={caller}/>
    </div>
    );
  }
}
export default DataviewPage;
