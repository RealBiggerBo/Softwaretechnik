import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useState } from "react";

function DataviewPage(){
    const [selected, setSelected] = useState("");
    return (
        <div>
            <label htmlFor="dropdown" style={{color:"black"}}>Fall oder Anfrage: </label>
            <select value={selected} name="dropdown" onChange={(e) => setSelected(e.target.value)}>
                <option value="">Bitte auswählen</option>
                <option value="Anfrage">Anfrage</option>
                <option value="Fall">Fall</option>
            </select>

            {selected === "Anfrage" && <div>
                <input type="date"/>
                <input placeholder="ID"/>
                <br/>
                <label htmlFor="dropdown2" style={{color:"black"}}>Wie wurde Kontakt aufgenommen: </label>
                <select name="dropdown2">
                    <option>Bitte auswählen</option>
                    <option>E-Mail</option>
                    <option>Telefon</option>
                    <option>vor Ort</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="dropdown3" style={{color:"black"}}>Wer hat angefragt: </label>
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
                <label htmlFor="dropdown4" style={{color:"black"}}>Art der Anfrage: </label>
                <select name="dropdown4">
                    <option>Bitte auswählen</option>
                    <option>medizinische Soforthilfe</option>
                    <option>vertrauliche Spurensicherung</option>
                    <option>Beratungsbedarf</option>
                    <option>zu Rechtlichem</option>
                    <option>Sonstiges</option>
                </select>
                <br/>
                <label htmlFor="checkbox1" style={{color:"black"}}>Wurde bereits ein Termin vergeben? </label>
                <Switch name="checkbox1" id="termin"/></div>}

            {selected === "Fall" && <div>
                <h3 style={{color:"black"}}>Personenbezogene Daten</h3>
                <input type="text" placeholder="ID"/>
                <br/>
                <label htmlFor="dropdown5" style={{color:"black"}}>Rolle der ratsuchenden Person: </label>
                <select name="dropdown5">
                    <option>Bitte auswählen</option>
                    <option>Betroffene:r</option>
                    <option>Angehörige:r</option>
                    <option>Fachkraft</option>
                </select>
                <br/>
                <input placeholder="Alter" type="number"/>
                <br/>
                <label htmlFor="dropdown6" style={{color:"black"}}>Geschlächtsidentität: </label>
                <select>
                    <option>Bitte auswählen</option>
                    <option>cis weiblich</option>
                    <option>cis männlich</option>
                    <option>trans weiblich</option>
                    <option>trans männlich</option>
                    <option>inter</option>
                    <option>agender</option>
                    <option>divers</option>
                    <option>keine Angaben</option>
                </select>
                <label htmlFor="dropdown7" style={{color:"black"}}>Sexualität: </label>
                <select name="dropdown7">
                    <option>Bitte wählen</option>
                    <option>lesbisch</option>
                    <option>schwul</option>
                    <option>bisexuell</option>
                    <option>asexuell</option>
                    <option>heterosexuell</option>
                    <option>keine Angaben</option>
                </select>
                <br/>
                <label htmlFor="dropdown8" style={{color:"black"}}>Wohnort: </label>
                <select name="dropdown8">
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                    <option>Sachsen</option>
                    <option>Deutschland</option>
                    <option>andere</option>
                    <option>keine Angaben</option>
                </select>
                <label htmlFor="dropdown9" style={{color:"black"}}>Staatsangehörigkeit: </label>
                <select name="dropdown9">
                    <option>Bitte auswählen</option>
                    <option>deutsch</option>
                    <option>andere</option>
                </select>
                <br/>
                <label htmlFor="dropdown10" style={{color:"black"}}>berufliche Situation: </label>
                <select name="dropdown10">
                    <option>Bitte auswählen</option>
                    <option>arbeitslos</option>
                    <option>studierend</option>
                    <option>berufstätig</option>
                    <option>berentet</option>
                    <option>Azubi</option>
                    <option>berufsunfähig</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown11" style={{color:"black"}}>Schwerbehinderung</label>
                <select name="dropdown11">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                </select>
                <br/>
                <input type="text" placeholder="Notitzen"/>
                <br/>
                <h3>Daten zur durchgeführten Beratung</h3>
                <label htmlFor="dropdown12" style={{color:"black"}}>zuständige Beratungsstelle: </label>
                <select name="dropdown12">
                    <option>Bitte auswählen</option>
                    <option>Fachberatungsstelle für queere Betroffene von sexualisierter Gewalt in der Stadt Leipzig</option>
                    <option>Fachberatung gegen sexualisierte Gewalt im Landkreis Nordsachsen</option>
                    <option>Fachberatung gegen sexualusierte Gewalt Landkreis Leipzig</option>
                </select>
                <br/>
                <label htmlFor="anzahl">Anzahl der Beratungen insgesamt</label>
                <input type="number" name="anzahl" min="1" step="1" placeholder="Anzahl"/>
                <br/>
                <h5>1. Termin</h5>
                <input type="date"/>
                <br/>
                <label htmlFor="dropdown13" style={{color:"black"}}>Durchführungsart: </label>
                <select name="dropdown13">
                    <option>Bitte auswählen</option>
                    <option>persönlich</option>
                    <option>Video</option>
                    <option>Telefon</option>
                    <option>aufsuchend</option>
                    <option>schriftlich</option>
                </select>
                <label htmlFor="dropdown14" style={{color:"black"}}>Durchführungsort: </label>
                <select name="dropdown14">
                    <option>Bitte auswählen</option>
                    <option>Leipzig Stadt</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                </select>
                <br/>
                <input type="text" placeholder="Notitzen"/>
                <br/>
                <h3>Daten zur Gewalt</h3>
                <br/>
                <input type="number" step="1" placeholder="Alter"/>
                <select>
                    <option>Zeitraum</option>
                    <option>keine Abgabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown15" style={{color:"black"}}>Anzahl der Vorfälle: </label>
                <select name="dropdown15">
                    <option>Bitte auswählen</option>
                    <option>einmalig</option>
                    <option>mehrere</option>
                    <option>genaue Ahnzahl</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <h5>Täter 1</h5>
                <br/>
                <label htmlFor="dropdown16" style={{color:"black"}}>Geschlecht: </label>
                <select name="dropdown16">
                    <option>Bitte auswählen</option>
                    <option>cis weiblich</option>
                    <option>cis männlich</option>
                    <option>trans weinlich</option>
                    <option>trans männlich</option>
                    <option>trans nicht binär</option>
                    <option>inter</option>
                    <option>agender</option>
                    <option>divers</option>
                    <option>keine Angabe</option>
                </select>
                <br>
                <label htmlFor="dropdown17" style={{color:"black"}}>Verhältnis zur ratsuchenden Person: </label>
                <select name="dropdown17">
                    <option>Bitte auswählen</option>
                    <option>Unbekannte:r</option>
                    <option>Bekannte:r</option>
                    <option>Partner:in</option>
                    <option>Partner:in ehemalig</option>
                    <option>Ehepartner:in oder eingetragene:r Lebenspartner:in</option>
                    <option>andere Familienangehörige</option>
                    <option>sonstige Personen</option>
                    <option>keine Angaben</option>
                </select>
                <p>Art der Gewalt (merfachauswahl möglich)</p>
                <input type="checkbpx"/>
                <label>sexuelle Belästigung im öffentlichen Raum</label>
                <input type="checkbpx"/>
                <label>sexuelle Belästigung am Arbeitsplatz</label>
                <input type="checkbpx"/>
                <label>sexuelle Belästigung im privatem</label>
                <br/>
                <input type="checkbpx"/>
                <label>Vergewaltigung</label>
                <input type="checkbpx"/>
                <label>versuchte Vergewaltigung</label>
                <input type="checkbpx"/>
                <label>sexueller Missbrauch</label>
                <br/>
                <input type="checkbpx"/>
                <label>sexueller Missbrauch in der Kindheit</label>
                <input type="checkbpx"/>
                <label>sexuelle Nötigung</label>
                <input type="checkbpx"/>
                <label>rituelle Gewalt</label>
                <br/>
                <input type="checkbpx"/>
                <label>Upskirting</label>
                <input type="checkbpx"/>
                <label>Catcalling</label>
                <input type="checkbpx"/>
                <label>digitale sexuelle Gewalt</label>
                <br/>
                <input type="checkbpx"/>
                <label>Spiking</label>
                <input type="checkbpx"/>
                <label>Andere</label>
                <input type="checkbpx"/>
                <label>keine Angabe</label>
                <br/>
                <label htmlFor="dropdown18" style={{color:"black"}}>Tatort: </label>
                <select>
                    <option>Bitte auswählen</option>
                    <option>Leipzig</option>
                    <option>Leipzig Land</option>
                    <option>Nordsachsen</option>
                    <option>Sachsen</option>
                    <option>Deutschland</option>
                    <option>auf der Flucht</option>
                    <option>im Herkunftsland</option>
                    <option>keine Abgabe</option>
                </select>
                <label htmlFor="dropdown19" style={{color:"black"}}>Anzeige gemacht: </label>
                <select name="dropdown19">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>noch nicht</option>
                    <option>keine Angabe</option>
                </select>
                <label htmlFor="dropdown20" style={{color:"black"}}>medizinische Versorgung: </label>
                <select name="dropdown20">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown21" style={{color:"black"}}>vertrauliche Spuchensicherung: </label>
                <select name="dropdown21">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label>mitbetroffene Kinder: </label>
                <input type="number" placeholder="Anzahl"/>
                <label>davon direkt betroffen: </label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="text" placeholder="Notitzen"/>
                <br/>
                <h3>Daten zu den Folgen der Gewalt</h3>
                <br/>
                <p>psychische Folgen: </p>
                <br/>
                <input type="checkbpx"/>
                <label>Depressionen</label>
                <input type="checkbpx"/>
                <label>Angststörung</label>
                <input type="checkbpx"/>
                <label>PTBS</label>
                <br/>
                <input type="checkbpx"/>
                <label>Burn-Out</label>
                <input type="checkbpx"/>
                <label>Schlafstörungen</label>
                <input type="checkbpx"/>
                <label>Sucht/Abhängigkeit</label>
                <br/>
                <input type="checkbpx"/>
                <label>Kommunikationsschwierigkeiten</label>
                <input type="checkbpx"/>
                <label>Vernachlässigung alltäglicher Dinge</label>
                <input type="checkbpx"/>
                <label>andere Diagnose</label>
                <br/>
                <input type="checkbpx"/>
                <label>keine Folgen</label>
                <input type="checkbpx"/>
                <label>keine Abgabe</label>
                <br/>
                <p>körperliche Folgen: </p>
                <br/>
                <input type="checkbpx"/>
                <label>Schmerzen</label>
                <input type="checkbpx"/>
                <label>Lähmung</label>
                <input type="checkbpx"/>
                <label>Krankheit</label>
                <br/>
                <input type="checkbpx"/>
                <label>Andere</label>
                <input type="checkbpx"/>
                <label>keine Folgen</label>
                <input type="checkbpx"/>
                <label>keine Angabe</label>
                <br/>
                <label>Dauerhafte kötperliche Beeinträchtigungen: </label>
                <input type="text" placeholder="Beeinträchtigungen"/>
                <br/>
                <label htmlFor="dropdown22" style={{color:"black"}}>Finanzielle Folgen: </label>
                <select name="dropdown22">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown23" style={{color:"black"}}>Arbeitseinschränkungen/Arbeitsunfähigkeit: </label>
                <select name="dropdown23">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown24" style={{color:"black"}}>Verlust der Arbeitsstelle: </label>
                <select name="dropdown24">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown25" style={{color:"black"}}>Soziale Isolation: </label>
                <select name="dropdown25">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <label htmlFor="dropdown26" style={{color:"black"}}>Suizidalität: </label>
                <select name="dropdown26">
                    <option>Bitte auswählen</option>
                    <option>Ja</option>
                    <option>Nein</option>
                    <option>keine Angabe</option>
                </select>
                <br/>
                <input type="text" placeholder="weitere Informationen/Notitzen"/>
                <h3>Daten zu Begleitungen/Verweisen</h3>
                <br/>
                <label>Anzahl zu Begleitungen insgesamt: </label>
                <input type="number" placeholder="Anzahl"/>
                <p>Begleitung bei: </p>
                <br/>
                <input type="checkbpx"/>
                <label>Gericht</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Polizei</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Rechtsanwält(-innen)</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Ärtze</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Rechtsmedizin</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Jugendamt</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Sozialamt</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Jobcenter(Arbeitsagentur)</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Beratungsstellen für Gewaltausübende</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Frauen- und Kinderschutzeinrichtungen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>spezialisierte Schutzeinrichtungen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Interventions- oder Koordinationsstellen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Sonstige Einrichtungen oder Institutionen</label>
                <input type="number" placeholder="Anzahl"/>
                <input type="text"/>
                <br/>
                <label>Anzahl zu Verweisen insgesamt: </label>
                <input type="number" placeholder="Anzahl"/>
                <p>Verweise an: </p>
                <br/>
                <input type="checkbpx"/>
                <label>Gericht</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Polizei</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Rechtsanwält(-innen)</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Ärtze</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Rechtsmedizin</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Jugendamt</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Sozialamt</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Jobcenter(Arbeitsagentur)</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Beratungsstellen für Gewaltausübende</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Frauen- und Kinderschutzeinrichtungen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>spezialisierte Schutzeinrichtungen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Interventions- oder Koordinationsstellen</label>
                <input type="number" placeholder="Anzahl"/>
                <br/>
                <input type="checkbpx"/>
                <label>Sonstige Einrichtungen oder Institutionen</label>
                <input type="number" placeholder="Anzahl"/>
                <input type="text"/>
                <br/>
                <h3>Weitere Daten</h3>
                <label htmlFor="dropdown27" style={{color:"black"}}>Woher hat die ratsuchende Person von der Beratungsstelle erfahren: </label>
                <select name="dropdown27">
                    <option>Bitte auswählen</option>
                    <option>Selbstmeldungen über die Polizei</option>
                    <option>private Kontakte</option>
                    <option>Beratungsstellen</option>
                    <option>Internet</option>
                    <option>Ämter</option>
                    <option>Gesundheitswesen(Arzt/Ärztin)</option>
                    <option>Rechtsanwälte/-innen</option>
                    <option>andere Quellen</option>
                    <option>keine Angaben</option>
                </select>
                <br/>
                <label htmlFor="dropdown28" style={{color:"black"}}>Wurden Dolmetscherstunden in Anspruch genommen: </label>
                <select name="dropdown28">
                    <option>Nein</option>
                    <option>Ja</option>
                </select>
                </div>}
        </div>
    );
}
export default DataviewPage;