import MainPageContainer from "../components/MainPageContainer";
import type { IApiCaller } from "../classes/IApiCaller";
import { useEffect, useState } from "react";

interface Props {
  caller: IApiCaller;
}

function MainPage({ caller }: Props) {
  const [lastRequestId, setLastRequestId] = useState(-1);

  useEffect(() => {
    const fetchLastRequestId = async () => {
      const result = await caller.GetCurrentUserRights();

      if (!result.success) setLastRequestId(-1);
      else setLastRequestId(result.json.last_request_id ?? -1);
    };
    fetchLastRequestId();
  }, [caller]);

  return (
    <div className="pageContainer">
      <img
        src="src/bilder/bellis-logo.svg"
        className="bellisLogo"
        alt="Bellis e.V. Logo"
      ></img>
      <div className="container">
        <MainPageContainer
          heading="Suche"
          body="Hier können Anfragen und Fälle gesucht werden."
          color="search"
          buttons={["Fall Suchen", "Anfrage Suchen"]}
          links={["/search?type=fall", "/search?type=anfrage"]}
        />
        <MainPageContainer
          heading="Statistik"
          body="Hier können Statistiken berechnet werden"
          color="statistics"
          buttons={["Berechnen"]}
          links={["/statistics"]}
        />
        <MainPageContainer
          heading="Zuletzt bearbeitet"
          body="Hier können der zuletzt bearbeitete Fall und die zuletzt bearbeitete Anfrage aufgerufen werden."
          color="lastUsed"
          buttons={["Letzter Fall", "Letzte Anfrage"]}
          links={[
            "/dataview?type=letzter-fall&id=5",
            "/dataview?type=letzte-anfrage&id=" + lastRequestId,
          ]}
          enabled={[false, lastRequestId >= 0]}
        />
        <MainPageContainer
          heading="Neu erstellen"
          body="Hier können neue Fälle und Anfragen erstellt werden."
          color="createNew"
          buttons={["Neuer Fall", "Neue Anfrage"]}
          links={["/dataview?type=neuer-fall", "/dataview?type=neue-anfrage"]}
        />
      </div>
    </div>
  );
}
export default MainPage;
