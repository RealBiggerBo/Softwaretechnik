import MainPageContainer from "../components/MainPageContainer";

function MainPage() {
  return (
    <>
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
          buttons={["Suchen"]}
        />
        <MainPageContainer
          heading="Statistik"
          body="Hier können Statistiken berechnet werden"
          color="statistics"
          buttons={["Berechnen"]}
        />
        <MainPageContainer
          heading="Zuletzt bearbeitet"
          body="Hier können der zuletzt bearbeitete Fall und die zuletzt bearbeitete Anfrage aufgerufen werden."
          color="lastUsed"
          buttons={["Letzter Fall", "Letzte Anfrage"]}
        />
        <MainPageContainer
          heading="Neu erstellen"
          body="Hier können neue Fälle und Anfragen erstellt werden."
          color="createNew"
          buttons={["Neuer Fall", "Neue Anfrage"]}
        />
      </div>
    </>
  );
}
export default MainPage;
