//import Checkbox from "@mui/material/Checkbox";
//import FormControlLabel from "@mui/material/FormControlLabel";
//import Switch from "@mui/material/Switch";
import { useState } from "react";



function DataviewPage(){
    const [selected, setSelected] = useState("");
    const [selectedtermin, setSelectedtermin] = useState("");
    const [anzahlTermin, setAnzahlTermin] = useState(1);
    const [anzahlTäter, setAnzahlTäter] = useState(1);
    const [selectedStaatsangehörigkeit, setSelectedStaatsangehörigkeit] = useState("");
    const [selectedwohnort, setSelectedwohnort] = useState("");
    const [selectedSchwerbehinderung, setSelectedSchwerbehinderung] = useState("");
    const [selectedDolmetscher, setSelectedDolmetscher] = useState("");

    return (
        <div>
            <label htmlFor="dropdown">Fall oder Anfrage: </label>
            <select value={selected} name="dropdown" onChange={(e) => setSelected(e.target.value)}>
                <option value="">Bitte auswählen</option>
                <option value="Anfrage">Anfrage</option>
                <option value="Fall">Fall</option>
            </select>


            {/* noch anfrage aus ... hinzufügen */}
            {selected === "Anfrage" && <div>
                <form action={"anfrage.html"} method={"get"}>
                <h3>Anfrage</h3>
                <label>Anfrage ID: </label>
                <input placeholder="ID" name="anfrage_id"/>
                <br/>
                <label>Datum der Anfrage: </label>
                <input type="date"/>
                <br/>
                <label htmlFor="anfrage_wer">Wer hat angefragt: </label>
                <select name="anfrage_wer">
                    <option>Bitte auswählen</option>
                    <option>Fachkraft</option>
                    <option>Angehörige:r</option>
                    <option>Betroffene:r</option>
                    <option>Anonym</option>
                    <option>queer Betroffene:r</option>
                    <option>queer Fachkraft</option>
                    <option>queer Angehörige:r</option>
                    <option>queer Anonym</option>
                    <option>Fachkraft für Betroffene</option>
                    <option>Angehörige:r für Betroffene</option>
                    <option>Fachkraft für queere Betroffene</option>
                    <option>Angehörige:r für queere Betroffene</option>
                    <option>Sonstige</option>
                </select>
                <br/>
                <label>Anfrage aus: </label>
                <select name="anfrage_aus">
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachen</option>
                    <option>Sachsen</option>
                    <option>Andere</option>
                </select>
                <br/>
                <label htmlFor="anfrage_art">Art der Anfrage: </label>
                <select name="anfrage_art">
                    <option>Bitte auswählen</option>
                    <option>medizinische Soforthilfe</option>
                    <option>vertrauliche Spurensicherung</option>
                    <option>Beratungsbedarf</option>
                    <option>zu Rechtlichem</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="anfrage_kontakt">Wie wurde Kontakt aufgenommen: </label>
                <select name="anfrage_kontakt">
                    <option>Bitte auswählen</option>
                    <option>E-Mail</option>
                    <option>Telefon</option>
                    <option>vor Ort</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="anfrage_termin">Wurde bereits ein Termin vergeben? </label>
                <select name="anfrage_termin" value={selectedtermin} onChange={(e) => setSelectedtermin(e.target.value)}>
                    <option>Nein</option>
                    <option>Ja</option>
                </select>

                {selectedtermin === "Ja" && <div>
                <label>Datum des Termins: </label>
                <input type="date"/> 
                <br/>
                <label>Ort des Termins: </label>
                <select>
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                </select>
                </div>}

                <br/>
                <input type="submit" value="Speichern"/></form>
                </div>}

            {selected === "Fall" && <div>
                <form action={"fall.html"} method={"get"}>
                <h3>Fall</h3>
                <fieldset style={{width: "450px"}}> <legend>Personenbezogene Daten</legend>
                
                <table style={{textAlign:"right"}}>
                    <tr>
                        <td><label>Name/ID: </label></td>
                        <td><input type="text" placeholder="ID"/></td>
                    </tr>
                <tr>
                    <td>
                <label htmlFor="fall_rolle">Rolle der ratsuchenden Person: </label></td>
                <td><select name="fall_rolle">
                    <option>Betroffene:r</option>
                    <option>Angehörige:r</option>
                    <option>Fachkraft</option>
                </select></td>
                </tr>
                <tr>
                    <td><label>Alter: </label></td>
                <td>
                <input placeholder="Alter" type="number" min={0} name="alter"/></td></tr>
                <tr><td>
                <label htmlFor="fall_geschlecht">Geschlächtsidentität: </label></td>
                <td><select name="fall_geschlecht">
                    <option>keine Angabe</option>
                    <option>cis weiblich</option>
                    <option>cis männlich</option>
                    <option>trans weiblich</option>
                    <option>trans männlich</option>
                    <option>inter</option>
                    <option>agender</option>
                    <option>divers</option>
                </select></td></tr>
                <tr><td>
                <label htmlFor="fall_sexualitaet">Sexualität: </label></td>
                <td>
                <select name="fall_sexualitaet">
                    <option>keine Angabe</option>
                    <option>lesbisch</option>
                    <option>schwul</option>
                    <option>bisexuell</option>
                    <option>asexuell</option>
                    <option>heterosexuell</option>
                </select></td></tr>
                <tr><td>
                <label htmlFor="fall_wohnort">Wohnort: </label>
                </td>
                <td>
                <select name="fall_wohnort" onChange={(e) => setSelectedwohnort(e.target.value)}>
                    <option>keine Angabe</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                    <option>Sachsen</option>
                    <option>Deutschland</option>
                    <option>andere</option>
                </select>
                </td></tr>

                {selectedwohnort === "andere" &&
                <tr><td>
                <label>Wohnort: </label>
                </td>
                <td>
                <input type="text" placeholder="Wohnort"/>
                </td></tr>
                }
                {selectedwohnort === "Deutschland" &&
                <tr><td></td>
                <td>
                <input type="text" placeholder="Wohnort"/>
                </td></tr>
                }

                <tr><td>
                <label htmlFor="fall_staatsangehoerigkeit">Staatsangehörigkeit: </label>
                </td>
                <td>
                <select name="fall_staatsangehoerigkeit" onChange={(e) => setSelectedStaatsangehörigkeit(e.target.value)}>
                    <option>deutsch</option>
                    <option>andere</option>
                </select>
                </td></tr>

                {selectedStaatsangehörigkeit === "andere" &&
                <tr><td>
                <label>Staatsangehörigkeit: </label>
                </td>
                <td>
                <input type="text" placeholder="Staatsangehörigkeit"/>
                </td></tr>
                }

                <tr><td>
                <label htmlFor="fall_beruflich">berufliche Situation: </label></td>
                <td>
                <select name="fall_beruflich">
                    <option>keine Angabe</option>
                    <option>arbeitslos</option>
                    <option>studierend</option>
                    <option>berufstätig</option>
                    <option>berentet</option>
                    <option>Azubi</option>
                    <option>berufsunfähig</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="fall_schwerbehinderung">Schwerbehinderung: </label></td>
                <td>
                <select name="fall_schwerbehinderung" onChange={(e) => setSelectedSchwerbehinderung(e.target.value)}>
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                </td></tr>

                {selectedSchwerbehinderung === "Ja" &&<>
                <tr><td>
                <label>Form der Behinderung: </label>
                </td>
                <td>
                <select>
                    <option>körperlich</option>
                    <option>kognitiv</option>
                </select>
                </td></tr>
                <tr><td>
                <label>Grad der Behinderung: </label>
                </td>
                <td>
                <input type="number" placeholder="Grad" min="20" max="100"/>
                </td></tr></>
                }

                <tr><td>
                <input type="text" placeholder="Notizen" name="fall_notizen_person"/>
                </td></tr>
                </table>
                </fieldset>

                <fieldset style={{width: "450px"}}>
                <legend>Daten zur durchgeführten Beratung</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label htmlFor="fall_beratungsstelle">zuständige Beratungsstelle: </label></td>
                <td>
                <select name="fall_beratungsstelle" style={{width: "200px"}}>
                    <option>Bitte auswählen</option>
                    <option>Fachberatungsstelle für queere Betroffene von sexualisierter Gewalt in der Stadt Leipzig</option>
                    <option>Fachberatung gegen sexualisierte Gewalt im Landkreis Nordsachsen</option>
                    <option>Fachberatung gegen sexualusierte Gewalt Landkreis Leipzig</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="fall_anzahl_beratung">Anzahl der Beratungen insgesamt: </label></td>
                <td>
                <input type="number" name="fall_anzahl_beratung" min="1" step="1" placeholder="Anzahl" value={anzahlTermin} onChange={(e) => {const value = Number(e.target.value);if (value >= 1) {setAnzahlTermin(value);}}}/>
                </td></tr>
                </table>
                <br/>

                {Array.from({ length: anzahlTermin }).map((_, i) => (<div key={i}>
                <fieldset>
                <legend>Termin {i + 1}</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label>Datum des Termins: </label>
                </td>
                <td>
                <input type="date" />
                </td></tr>
                <tr><td>
                <label>Art der Beratung: </label>
                </td>
                <td>
                <select>
                    <option>persönlich</option>
                    <option>video</option>
                    <option>telefon</option>
                    <option>aufsuchend</option>
                    <option>schriftlich</option>
                </select>
                </td></tr>
                <tr><td>
                <label>Durchführungsort: </label>
                </td>
                <td>
                <select>
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                </select>
                </td></tr>
                <tr><td>
                <input type="text" placeholder="Notizen"/>
                </td></tr>
                </table>
                </fieldset>
                </div>))}

                </fieldset>

                <fieldset style={{width: "450px"}}>
                <legend>Daten zur Gewalt</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label>Alter zum Zeitpunkt der Gewalt: </label></td>
                <td>
                <input type="number" step="1" placeholder="Alter" min="0"/>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown15">Zeitraum der Gewalt: </label>
                </td>
                <td>
                <select>
                    <option>Zeitraum</option>
                    <option>keine Abgabe</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown15">Anzahl der Vorfälle: </label>
                </td>
                <td>
                <select name="dropdown15">
                    <option>keine Angbae</option>
                    <option>einmalig</option>
                    <option>mehrere</option>
                    <option>genaue Ahnzahl</option>
                </select>
                </td></tr>
                <tr><td>
                <label>Anzahl der Täter: </label>
                </td>
                <td>
                <input type="number" placeholder="Anzahl" min="1" value={anzahlTäter} onChange={(e) => {const value = Number(e.target.value);if (value >= 1) {setAnzahlTäter(value);}}}/>
                </td></tr>
                </table>
                
                {Array.from({ length: anzahlTäter }).map((_, i) => (<div key={i}>
               <fieldset>
                <legend>Täter {i + 1}</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label htmlFor="dropdown16">Geschlecht: </label>
                </td>
                <td>
                <select name="dropdown16">
                    <option>keine Angabe</option>
                    <option>cis weiblich</option>
                    <option>cis männlich</option>
                    <option>trans weinlich</option>
                    <option>trans männlich</option>
                    <option>trans nicht binär</option>
                    <option>inter</option>
                    <option>agender</option>
                    <option>divers</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown17">Verhältnis zur ratsuchenden Person: </label>
                </td>
                <td>
                <select name="dropdown17" style={{width: "150px"}}>
                    <option>keine Angabe</option>
                    <option>Unbekannte:r</option>
                    <option>Bekannte:r</option>
                    <option>Partner:in</option>
                    <option>Partner:in ehemalig</option>
                    <option>Ehepartner:in oder eingetragene:r Lebenspartner:in</option>
                    <option>andere Familienangehörige</option>
                    <option>sonstige Personen</option>
                </select>
                </td></tr>
                </table>
                </fieldset>
                </div>))}

                <fieldset>
                <legend>Art der Gewalt (merfachauswahl möglich)</legend>
                <div style={{textAlign:"left"}}>
                <input type="checkbox"/>
                <label>sexuelle Belästigung im öffentlichen Raum</label>
                <br/>
                <input type="checkbox"/>
                <label>sexuelle Belästigung am Arbeitsplatz</label>
                <br/>
                <input type="checkbox"/>
                <label>sexuelle Belästigung im privatem</label>
                <br/>
                <input type="checkbox"/>
                <label>Vergewaltigung</label>
                <br/>
                <input type="checkbox"/>
                <label>versuchte Vergewaltigung</label>
                <br/>
                <input type="checkbox"/>
                <label>sexueller Missbrauch</label>
                <br/>
                <input type="checkbox"/>
                <label>sexueller Missbrauch in der Kindheit</label>
                <br/>
                <input type="checkbox"/>
                <label>sexuelle Nötigung</label>
                <br/>
                <input type="checkbox"/>
                <label>rituelle Gewalt</label>
                <br/>
                <input type="checkbox"/>
                <label>Upskirting</label>
                <br/>
                <input type="checkbox"/>
                <label>Catcalling</label>
                <br/>
                <input type="checkbox"/>
                <label>digitale sexuelle Gewalt</label>
                <br/>
                <input type="checkbox"/>
                <label>Spiking</label>
                <br/>
                <input type="checkbox"/>
                <label>Andere</label>
                <br/>
                <input type="checkbox"/>
                <label>keine Angabe</label>
                </div>
                <br/>
                <table style={{textAlign:"right"}}>
                <tr><td>
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
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown19">Anzeige gemacht: </label>
                </td>
                <td>
                <select name="dropdown19">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>noch nicht</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown20">medizinische Versorgung: </label>
                </td>
                <td>
                <select name="dropdown20">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown21">vertrauliche Spuchensicherung: </label>
                </td>
                <td>
                <select name="dropdown21">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label>mitbetroffene Kinder: </label>
                </td>
                <td>
                <input type="number" placeholder="Anzahl" min="0"/>
                </td></tr>
                <tr><td>
                <label>davon direkt betroffen: </label>
                </td>
                <td>
                <input type="number" placeholder="Anzahl" min="0"/>
                </td></tr>
                <tr><td>
                <input type="text" placeholder="Notizen"/>
                </td></tr>
                </table>
                </fieldset>
                </fieldset>

                <fieldset style={{width: "450px"}}>
                <legend>Daten zu den Folgen der Gewalt</legend>
                <p style={{textAlign:"left"}}>psychische Folgen: </p>
                <div style={{textAlign:"left"}}>
                <input type="checkbox"/>
                <label>Depressionen</label>
                <br/>
                <input type="checkbox"/>
                <label>Angststörung</label>
                <br/>
                <input type="checkbox"/>
                <label>PTBS</label>
                <br/>
                <input type="checkbox"/>
                <label>Burn-Out</label>
                <br/>
                <input type="checkbox"/>
                <label>Schlafstörungen</label>
                <br/>
                <input type="checkbox"/>
                <label>Sucht/Abhängigkeit</label>
                <br/>
                <input type="checkbox"/>
                <label>Kommunikationsschwierigkeiten</label>
                <br/>
                <input type="checkbox"/>
                <label>Vernachlässigung alltäglicher Dinge</label>
                <br/>
                <input type="checkbox"/>
                <label>andere Diagnose</label>
                <br/>
                <input type="checkbox"/>
                <label>keine Folgen</label>
                <br/>
                <input type="checkbox"/>
                <label>keine Abgabe</label>
                </div>
                <br/>
                <p style={{textAlign:"left"}}>körperliche Folgen: </p>
                <div style={{textAlign:"left"}}>
                <input type="checkbox"/>
                <label>Schmerzen</label>
                <br/>
                <input type="checkbox"/>
                <label>Lähmung</label>
                <br/>
                <input type="checkbox"/>
                <label>Krankheit</label>
                <br/>
                <input type="checkbox"/>
                <label>Andere</label>
                <br/>
                <input type="checkbox"/>
                <label>keine Folgen</label>
                <br/>
                <input type="checkbox"/>
                <label>keine Angabe</label>
                </div>
                <br/>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label>Dauerhafte kötperliche Beeinträchtigungen: </label>
                </td>
                <td>
                <input type="text" placeholder="Beeinträchtigungen"/>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown22">Finanzielle Folgen: </label>
                </td>
                <td>
                <select name="dropdown22">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown23">Arbeitseinschränkungen/Arbeitsunfähigkeit: </label>
                </td>
                <td>
                <select name="dropdown23">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown24">Verlust der Arbeitsstelle: </label>
                </td>
                <td>
                <select name="dropdown24">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown25">Soziale Isolation: </label>
                </td>
                <td>
                <select name="dropdown25">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown26">Suizidalität: </label>
                </td>
                <td>
                <select name="dropdown26">
                    <option>keine Angabe</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                </td></tr>
                <tr><td>
                <input type="text" placeholder="weitere Informationen/Notizen"/>
                </td></tr>
                </table>
                </fieldset>

                <fieldset style={{width: "450px"}}>
                <legend>Daten zu Begleitungen/Verweisen</legend>
                <br/>
                <label>Anzahl zu Begleitungen insgesamt: </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <p style={{textAlign:"left"}}>Begleitung bei: </p>
                <div style={{textAlign:"left"}}>
                <input type="checkbox"/>
                <label>Gericht </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Polizei </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Rechtsanwält(-innen) </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Ärtze </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Rechtsmedizin </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Jugendamt </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Sozialamt </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Jobcenter(Arbeitsagentur) </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Beratungsstellen für Gewaltausübende </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Frauen- und Kinderschutzeinrichtungen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>spezialisierte Schutzeinrichtungen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Interventions- oder Koordinationsstellen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Sonstige Einrichtungen oder Institutionen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <input type="text"/>
                </div>
                <br/>
                <label>Anzahl zu Verweisen insgesamt: </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <p style={{textAlign:"left"}}>Verweise an: </p>
                <div style={{textAlign:"left"}}>
                <input type="checkbox"/>
                <label>Gericht </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Polizei </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Rechtsanwält(-innen) </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Ärtze </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Rechtsmedizin </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Jugendamt </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Sozialamt </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Jobcenter(Arbeitsagentur) </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Beratungsstellen für Gewaltausübende </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Frauen- und Kinderschutzeinrichtungen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>spezialisierte Schutzeinrichtungen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Interventions- oder Koordinationsstellen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <br/>
                <input type="checkbox"/>
                <label>Sonstige Einrichtungen oder Institutionen </label>
                <input type="number" placeholder="Anzahl" min="0"/>
                <input type="text"/>
                </div>
                </fieldset>
                <fieldset style={{width: "450px"}}>
                <h3>Weitere Daten</h3>
                <label htmlFor="dropdown27">Woher hat die ratsuchende Person von der Beratungsstelle erfahren: </label>
                <select name="dropdown27">
                    <option>keine Angabe</option>
                    <option>Selbstmeldungen über die Polizei</option>
                    <option>private Kontakte</option>
                    <option>Beratungsstellen</option>
                    <option>Internet</option>
                    <option>Ämter</option>
                    <option>Gesundheitswesen(Arzt/Ärztin)</option>
                    <option>Rechtsanwälte/-innen</option>
                    <option>andere Quellen</option>
                </select>
                <br/>
                <label htmlFor="dropdown28">Wurden Dolmetscherstunden in Anspruch genommen: </label>
                <select name="dropdown28" onChange={(e) => setSelectedDolmetscher(e.target.value)}>
                    <option>Nein</option>
                    <option>Ja</option>
                </select>

                {selectedDolmetscher === "Ja" && <>
                <tr><td>
                <label>Anzahl der Dolmetscherstunden: </label>
                </td>
                <td>
                <input type="number" placeholder="Anzahl" min="1"/>
                </td></tr>
                <tr><td>
                <label>Sprache: </label>
                </td>
                <td>
                <input type="text" placeholder="Sprache"/>
                </td></tr>
                </>
                }

                </fieldset>
                <input type="submit" value="Speichern"/></form>
                </div>}
        </div>
    );
}
export default DataviewPage;