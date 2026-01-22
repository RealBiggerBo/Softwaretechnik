import { useState } from "react";
import type { IApiCaller } from "../classes/IApiCaller";
import { Anfrage } from "../classes/Anfrage";
import TextDataField from "../components/TextDataField";
import { TextField } from "../classes/DataField";
import QueryDisplay from "../components/QueryDisplay";
import { Query } from "../classes/Query";
import { DataRecord } from "../classes/DataRecord";
import { DataRecordConverter } from "../classes/DataRecordConverter";
import { Button } from "@mui/material";

interface Props {
  caller: IApiCaller;
}

async function submitSearchApiCall<T>(
  searchaApiCall: (data: T) => Promise<{
    success: boolean;
    errorMsg: string;
  }>,
  data?: T,
): Promise<void> {
  if (data == undefined) return;
  const result = await searchaApiCall(data);
  if (!result.success) alert(result.errorMsg);
}

function SearchPage({ caller }: Props) {
  const [selected, setSelected] = useState("");

  const initialQuery = new Query();
  const [query, setQuery] = useState(initialQuery);

  return (
    <div>
      <QueryDisplay
        query={query}
        onChange={setQuery}
        format={DataRecordConverter.ConvertFormatToDataRecord(
          Anfrage.GetNewJonsonFormat(),
        )}
      />
      <Button onClick={() => alert(JSON.stringify(query))}>TEST</Button>
      <br></br> {/*line break for clarity*/}
      <label>{Anfrage.GetNewJonsonFormat()}</label>
      <br></br> {/*line break for clarity*/}
      <label htmlFor="dropdown">Fall oder Anfrage: </label>
      <select
        value={selected}
        name="dropdown"
        onChange={(e) => setSelected(e.target.value)}
      >
        <option value="">Bitte auswählen</option>
        <option value="Anfrage">Anfrage</option>
        <option value="Fall">Fall</option>
      </select>
      {selected === "Anfrage" && (
        <div>
          <input type="date" />
          <input placeholder="ID" />
          <br />
          <label htmlFor="dropdown4">Art der Anfrage: </label>
          <select name="dropdown4">
            <option>Bitte auswählen</option>
            <option>medizinische Soforthilfe</option>
            <option>vertrauliche Spurensicherung</option>
            <option>Beratungsbedarf</option>
            <option>zu Rechtlichem</option>
            <option>Sonstiges</option>
          </select>
          <br />
          <button
            onClick={async () => {
              //TODO: get data from fields into anfrage class
              await submitSearchApiCall(caller.TrySearchAnfrage, undefined);
            }}
          >
            Anfrage suchen
          </button>
        </div>
      )}
      {selected === "Fall" && (
        <div>
          <fieldset style={{ width: "450px" }}>
            {" "}
            <legend>Personenbezogene Daten</legend>
            <table style={{ textAlign: "right" }}>
              <tr>
                <td>
                  <label>Name/ID: </label>
                </td>
                <td>
                  <input type="text" placeholder="ID" />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="dropdown5">
                    Rolle der ratsuchenden Person:{" "}
                  </label>
                </td>
                <td>
                  <select name="dropdown5">
                    <option>Betroffene:r</option>
                    <option>Angehörige:r</option>
                    <option>Fachkraft</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="dropdown8">Wohnort: </label>
                </td>
                <td>
                  <select name="dropdown8">
                    <option>keine Angabe</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                    <option>Sachsen</option>
                    <option>Deutschland</option>
                    <option>andere</option>
                  </select>
                </td>
              </tr>
            </table>
          </fieldset>

          <fieldset style={{ width: "450px" }}>
            <legend>Daten zur durchgeführten Beratung</legend>
            <table style={{ textAlign: "right" }}>
              <tr>
                <td>
                  <label htmlFor="dropdown12">
                    zuständige Beratungsstelle:{" "}
                  </label>
                </td>
                <td>
                  <select name="dropdown12" style={{ width: "200px" }}>
                    <option>Bitte auswählen</option>
                    <option>
                      Fachberatungsstelle für queere Betroffene von
                      sexualisierter Gewalt in der Stadt Leipzig
                    </option>
                    <option>
                      Fachberatung gegen sexualisierte Gewalt im Landkreis
                      Nordsachsen
                    </option>
                    <option>
                      Fachberatung gegen sexualusierte Gewalt Landkreis Leipzig
                    </option>
                  </select>
                </td>
              </tr>
            </table>
            <br />
          </fieldset>
          <fieldset style={{ width: "450px" }}>
            <legend>Daten zur Gewalt</legend>
            <table style={{ textAlign: "right" }}>
              <tr>
                <td>
                  <label>Alter zum Zeitpunkt der Gewalt: </label>
                </td>
                <td>
                  <input type="number" step="1" placeholder="Alter" min="0" />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="dropdown15">Zeitraum der Gewalt: </label>
                </td>
                <td>
                  <select>
                    <option>Zeitraum</option>
                    <option>keine Abgabe</option>
                  </select>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="dropdown15">Anzahl der Vorfälle: </label>
                </td>
                <td>
                  <select name="dropdown15">
                    <option>keine Angbae</option>
                    <option>einmalig</option>
                    <option>mehrere</option>
                    <option>genaue Ahnzahl</option>
                  </select>
                </td>
              </tr>
            </table>
            <fieldset>
              <legend>Art der Gewalt (merfachauswahl möglich)</legend>
              <div style={{ textAlign: "left" }}>
                <input type="checkbox" />
                <label>sexuelle Belästigung im öffentlichen Raum</label>
                <br />
                <input type="checkbox" />
                <label>sexuelle Belästigung am Arbeitsplatz</label>
                <br />
                <input type="checkbox" />
                <label>sexuelle Belästigung im privatem</label>
                <br />
                <input type="checkbox" />
                <label>Vergewaltigung</label>
                <br />
                <input type="checkbox" />
                <label>versuchte Vergewaltigung</label>
                <br />
                <input type="checkbox" />
                <label>sexueller Missbrauch</label>
                <br />
                <input type="checkbox" />
                <label>sexueller Missbrauch in der Kindheit</label>
                <br />
                <input type="checkbox" />
                <label>sexuelle Nötigung</label>
                <br />
                <input type="checkbox" />
                <label>rituelle Gewalt</label>
                <br />
                <input type="checkbox" />
                <label>Upskirting</label>
                <br />
                <input type="checkbox" />
                <label>Catcalling</label>
                <br />
                <input type="checkbox" />
                <label>digitale sexuelle Gewalt</label>
                <br />
                <input type="checkbox" />
                <label>Spiking</label>
                <br />
                <input type="checkbox" />
                <label>Andere</label>
                <br />
                <input type="checkbox" />
                <label>keine Angabe</label>
              </div>
              <br />
              <table style={{ textAlign: "right" }}>
                <tr>
                  <td>
                    <label htmlFor="dropdown18">Tatort: </label>
                  </td>
                  <td>
                    <select>
                      <option>keine Angabe</option>
                      <option>Leipzig</option>
                      <option>Leipzig Land</option>
                      <option>Nordsachsen</option>
                      <option>Sachsen</option>
                      <option>Deutschland</option>
                      <option>auf der Flucht</option>
                      <option>im Herkunftsland</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="dropdown19">Anzeige gemacht: </label>
                  </td>
                  <td>
                    <select name="dropdown19">
                      <option>keine Angabe</option>
                      <option>Ja</option>
                      <option>Nein</option>
                      <option>noch nicht</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="dropdown20">
                      medizinische Versorgung:{" "}
                    </label>
                  </td>
                  <td>
                    <select name="dropdown20">
                      <option>keine Angabe</option>
                      <option>Ja</option>
                      <option>Nein</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="dropdown21">
                      vertrauliche Spuchensicherung:{" "}
                    </label>
                  </td>
                  <td>
                    <select name="dropdown21">
                      <option>keine Angabe</option>
                      <option>Ja</option>
                      <option>Nein</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>mitbetroffene Kinder: </label>
                  </td>
                  <td>
                    <input type="number" placeholder="Anzahl" min="0" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label>davon direkt betroffen: </label>
                  </td>
                  <td>
                    <input type="number" placeholder="Anzahl" min="0" />
                  </td>{" "}
                </tr>
              </table>
            </fieldset>
          </fieldset>
          <button
            onClick={async () => {
              //TODO: get data from fields into case class
              await submitSearchApiCall(caller.TrySearchFall, undefined);
            }}
          >
            Fall suchen
          </button>
        </div>
      )}
    </div>
  );
}
export default SearchPage;
