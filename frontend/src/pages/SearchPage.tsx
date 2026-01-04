function SearchPage(){
    return(
        <div>
            <h3>Persönliche Daten</h3>
            <br/>
            <label htmlFor="inputname">Name/ID: </label>
            <input name="inputname" type="text" placeholder="ID"/>
            <label htmlFor="inputalter1">Alter</label>
            <input name="inputalter1" type="number" placeholder="Alter"/>
            <label htmlFor="inputalter2">Alter zum Tatzeitpunkt</label>
            <input name="inputalter2" type="number" placeholder="Alter"/>
            <br/>
            <label htmlFor="dropdownsex">Geschlechtsodentität</label>
            <select name="dropdownsex">
                  <option>Bitte auswählen(optional)</option>
                  <option>cis weiblich</option>
                  <option>cis männlich</option>
                  <option>trans weiblich</option>
                  <option>trans männlich</option>
                  <option>trans nicht binär</option>
                  <option>inter</option>
                  <option>agender</option>
                  <option>divers</option>
                  <option>keine Angabe</option>
            </select>
            <label htmlFor="dropdownsexuality"></label>
            <select name="dropdownsexuality">
               <option>Bitte auswählen</option>
               <option>lesbisch</option>
               <option>schwul</optiom>
               <option>bisexuell</option>
               <option>asexuell</option>
               <option>heterosexuell</option>
               <option>keine Angabe</option>
            </select>
            <br/>
        </div>
    );
}
export default SearchPage;