function DataviewPage(){
    return (
        <div>
            <select>
                <option>Bitte auswählen</option>
                <option>Anfrage</option>
                <option>Fall</option>
            </select>
            <br/>
            <input type="date"/>
            <input placeholder="ID"/>
            <br/>
            <select>
                <option>Bitte auswählen</option>
                <option>E-Mail</option>
                <option>Telefon</option>
                <option>vor Ort</option>
                <option>Sonstiges</option>
            </select>
            <br/>
        </div>
    );
}
export default DataviewPage;