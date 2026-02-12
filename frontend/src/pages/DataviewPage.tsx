import { useSearchParams } from "react-router-dom";
import type { IApiCaller } from "../classes/IApiCaller";
import AnfragenGenerator from "../components/AnfragenGenerator";
import FallGenerator from "../components/FallGenerator";
import LetzteAnfrage from "../components/LetzeAnfrage";
import LetzterFall from "../components/LetzterFall";

interface Props {
  caller: IApiCaller;
}

function DataviewPage({ caller }: Props) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  if (type === "neue-anfrage" || type === "anfrage") {
    return (
      <div>
        <AnfragenGenerator caller={caller} />
      </div>
    );
  }

  if (type === "neuer-fall" || type === "fall") {
    return (
      <div>
        <FallGenerator caller={caller} />
      </div>
    );
  }

  if (type === "letzte-anfrage") {
    return (
      <div>
        <LetzteAnfrage caller={caller} />
      </div>
    );
  }

  if (type === "letzter-fall") {
    return (
      <div>
        <LetzterFall caller={caller} />
      </div>
    );
  }
}
export default DataviewPage;
