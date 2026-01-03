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
                <label htmlFor="checkbox" style={{color:"black"}}>Wurde bereits ein Termin vergeben? </label>
                <Switch name="checkbox" id="termin"/></div>}

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
<option></option>
</select>
                
                </div>}
        </div>
    );
}
export default DataviewPage;