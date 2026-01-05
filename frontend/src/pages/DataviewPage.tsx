//import Checkbox from "@mui/material/Checkbox";
//import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useState } from "react";

function DataviewPage(){
    const [selected, setSelected] = useState("");
    const [selected29, setSelected29] = useState("");
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
                <h3>Anfrage</h3>
                <label>Anfrage ID: </label>
                <input placeholder="ID"/>
                <br/>
                <label>Datum der Anfrage: </label>
                <input type="date"/>
                <br/>
                <label htmlFor="dropdown3">Wer hat angefragt: </label>
                <select name="dropdown3">
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
                <label htmlFor="dropdown4">Art der Anfrage: </label>
                <select name="dropdown4">
                    <option>Bitte auswählen</option>
                    <option>medizinische Soforthilfe</option>
                    <option>vertrauliche Spurensicherung</option>
                    <option>Beratungsbedarf</option>
                    <option>zu Rechtlichem</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="dropdown2">Wie wurde Kontakt aufgenommen: </label>
                <select name="dropdown2">
                    <option>Bitte auswählen</option>
                    <option>E-Mail</option>
                    <option>Telefon</option>
                    <option>vor Ort</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="dropdown29">Wurde bereits ein Termin vergeben? </label>
                <select name="dropdown29" value={selected29} onChange={(e) => setSelected29(e.target.value)}>
                    <option>Nein</option>
                    <option>Ja</option>
                </select>

                {selected29 === "Ja" && <div>
                <label>Datum des Termins: </label>
                <input type="date"/>    
                </div>}

                <br/>
                <button>Speichern</button>
                </div>}

            {selected === "Fall" && <div>
                <h3>Fall</h3>
                <fieldset style={{width: "450px"}}> <legend>Personenbezogene Daten</legend>
                
                <table style={{textAlign:"right"}}>
                    <tr>
                        <td><label>Name/ID: </label></td>
                        <td><input type="text" placeholder="ID"/></td>
                    </tr>
                <tr>
                    <td>
                <label htmlFor="dropdown5">Rolle der ratsuchenden Person: </label></td>
                <td><select name="dropdown5">
                    <option>Betroffene:r</option>
                    <option>Angehörige:r</option>
                    <option>Fachkraft</option>
                </select></td>
                </tr>
                <tr>
                    <td><label>Alter: </label></td>
                <td>
                <input placeholder="Alter" type="number" min={0}/></td></tr>
                <tr><td>
                <label htmlFor="dropdown6">Geschlächtsidentität: </label></td>
                <td><select>
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
                <label htmlFor="dropdown7">Sexualität: </label></td>
                <td>
                <select name="dropdown7">
                    <option>keine Angabe</option>
                    <option>lesbisch</option>
                    <option>schwul</option>
                    <option>bisexuell</option>
                    <option>asexuell</option>
                    <option>heterosexuell</option>
                </select></td></tr>
                <tr><td>
                <label htmlFor="dropdown8">Wohnort: </label></td>
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
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown9">Staatsangehörigkeit: </label></td>
                <td>
                <select name="dropdown9">
                    <option>deutsch</option>
                    <option>andere</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown10">berufliche Situation: </label></td>
                <td>
                <select name="dropdown10">
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
                <label htmlFor="dropdown11">Schwerbehinderung: </label></td>
                <td>
                <select name="dropdown11">
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                </td></tr>
                <tr><td>
                <input type="text" placeholder="Notitzen"/>
                </td></tr>
                </table>
                </fieldset>

                <fieldset style={{width: "450px"}}>
                <legend>Daten zur durchgeführten Beratung</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label htmlFor="dropdown12">zuständige Beratungsstelle: </label></td>
                <td>
                <select name="dropdown12" style={{width: "200px"}}>
                    <option>Bitte auswählen</option>
                    <option>Fachberatungsstelle für queere Betroffene von sexualisierter Gewalt in der Stadt Leipzig</option>
                    <option>Fachberatung gegen sexualisierte Gewalt im Landkreis Nordsachsen</option>
                    <option>Fachberatung gegen sexualusierte Gewalt Landkreis Leipzig</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="anzahl">Anzahl der Beratungen insgesamt: </label></td>
                <td>
                <input type="number" name="anzahl" min="1" step="1" placeholder="Anzahl"/>
                </td></tr>
                </table>
                <br/>

                <fieldset>
                <legend>1. Termin</legend>
                <table style={{textAlign:"right"}}>
                <tr><td>
                <label>Datum: </label></td>
                <td>
                <input type="date"/>
                </td></tr>
                <tr><td>    
                <label htmlFor="dropdown13">Durchführungsart: </label>
                </td>
                <td>
                <select name="dropdown13">
                    <option>Bitte auswählen</option>
                    <option>persönlich</option>
                    <option>Video</option>
                    <option>Telefon</option>
                    <option>aufsuchend</option>
                    <option>schriftlich</option>
                </select>
                </td></tr>
                <tr><td>
                <label htmlFor="dropdown14">Durchführungsort: </label>
                </td>
                <td>
                <select name="dropdown14">
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                </select>
                </td></tr>
                <tr><td>
                <input type="text" placeholder="Notitzen"/>
                </td></tr>
                </table>
                </fieldset>
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
                </table>

                <fieldset>
                <legend>Täter 1</legend>
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
                <input type="text" placeholder="Notitzen"/>
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
                <input type="text" placeholder="weitere Informationen/Notitzen"/>
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
                <select name="dropdown28">
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                </fieldset>
                <button>Speichern</button>
                </div>}
        </div>
    );
}
export default DataviewPage;