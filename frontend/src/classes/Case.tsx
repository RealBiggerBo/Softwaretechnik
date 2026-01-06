export class Taeter{
    private geschlaecht: string;
    private verhaeltnis: string;

    constructor(geschlaecht: string, verhaeltnis: string){
        this.geschlaecht = geschlaecht;
        this.verhaeltnis = verhaeltnis;
    }

    public getGeschlaecht(): string{
        return this.geschlaecht;
    }

    public getVerhaeltnis(): string{
        return this.verhaeltnis;
    }
}

export class Beratungstermine {
    private datum: string;
    private art: string;
    private ort: string;
    private notizen: string;

    constructor(datum: string, art: string, ort: string, notizen: string){
        this.datum = datum;
        this.art = art;
        this.ort = ort;
        this.notizen = notizen;
    }

    public getDatum(): string{
        return this.datum;
    }

    public getArt(): string{
        return this.art;
    }

    public getOrt(): string{
        return this.ort;
    }

    public getNotizen(): string{
        return this.notizen;
    }

}

export class Case {
    //Personenbezogene Daten
    private alias: string;
    private rolle: string;
    private alter: string;
    private geschlecht: string;
    private sexualitaet: string;
    private wohnort: string;
    private nationalitaet: string;
    private beruf: string;
    private behinderung: string;
    private artbehinderung: string;
    private gradbehinderung: string;
    private notizenPersonenbezogen: string;

    //Daten zur durchgeführten Beratung
    private beratungsstelle: string;
    private anzahlBeratungen: string;
    private termine: Beratungstermine[];

    //Daten zur Gewalt
    private alterzZeitpunkt: string;
    private zeitrsaum: string;
    private artVorfall: string;
    private anzahlTaeter: string;
    private taeter: Taeter[];
    private artderGewalt: boolean[];
    private tatort: string;
    private anzeige: string;
    private medizinischeVersorgung: string;
    private spurensicherung: string;
    private mitbetroffeneKids: string;
    private direktbetroffen: string;
    private notizenGewalt: string;

    //Daten zu den Folgen der Gewalt
    private psychischeFolgen: boolean[];
    private körperlicheFolgen: boolean[];
    private körperlicheBeeinträchtigung: string;
    private finanzielleFolgen: string;
    private arbeitseinschraenkungen: string;
    private verlustArbeit: string;
    private sozialeIsolation: string;
    private suizidalität: string;
    private notizenFolgen: string;

    //Daten zu Begleitung/verweise
    private anzahlBegleitungen: string;
    private begleitungBei: boolean[];
    private anzahlVerweise: string;
    private verweiseZu: boolean[];
    //weitere Daten
    private wohererfahren: string;
    private dolmetscher: string;
    private sprache: string;
    private stunden: string;

    constructor(
        //Personenbezogene Daten
        alias: string,
        rolle: string,
        alter: string,
        geschlecht: string,
        sexualitaet: string,
        wohnort: string,
        nationalitaet: string,
        beruf: string,
        behinderung: string,
        artbehinderung: string,
        gradbehinderung: string,
        notizenPersonenbezogen: string,

        //Daten zur durchgeführten Beratung
        beratungsstelle: string,
        anzahlBeratungen: string,
        termine: Beratungstermine[],

        //Daten zur Gewalt
        alterzZeitpunkt: string,
        zeitrsaum: string,
        artVorfall: string,
        anzahlTaeter: string,
        taeter: Taeter[],
        artderGewalt: boolean[],
        tatort: string,
        anzeige: string,
        medizinischeVersorgung: string,
        spurensicherung: string,
        mitbetroffeneKids: string,
        direktbetroffen: string,
        notizenGewalt: string,

        //Daten zu den Folgen der Gewalt
        psychischeFolgen: boolean[],
        körperlicheFolgen: boolean[],
        körperlicheBeeinträchtigung: string,
        finanzielleFolgen: string,
        arbeitseinschraenkungen: string,
        verlustArbeit: string,
        sozialeIsolation: string,
        suizidalität: string,
        notizenFolgen: string,

        //Daten zu Begleitung/verweise
        anzahlBegleitungen: string,
        begleitungBei: boolean[],
        anzahlVerweise: string,
        verweiseZu: boolean[],

        //weitere Daten
        wohererfahren: string,
        dolmetscher: string,
        sprache: string,
        stunden: string,
    ){
        this.alias = alias;
        this.rolle = rolle;
        this.alter = alter;
        this.geschlecht = geschlecht;
        this.sexualitaet = sexualitaet;
        this.wohnort = wohnort;
        this.nationalitaet = nationalitaet;
        this.beruf = beruf;
        this.behinderung = behinderung;
        this.artbehinderung = artbehinderung;
        this.gradbehinderung = gradbehinderung;
        this.notizenPersonenbezogen = notizenPersonenbezogen;

        this.beratungsstelle = beratungsstelle;
        this.anzahlBeratungen = anzahlBeratungen;
        this.termine = termine;

        this.alterzZeitpunkt = alterzZeitpunkt;
        this.zeitrsaum = zeitrsaum;
        this.artVorfall = artVorfall;
        this.anzahlTaeter = anzahlTaeter;
        this.taeter = taeter;
        this.artderGewalt = artderGewalt;
        this.tatort = tatort;
        this.anzeige = anzeige;
        this.medizinischeVersorgung = medizinischeVersorgung;
        this.spurensicherung = spurensicherung;
        this.mitbetroffeneKids = mitbetroffeneKids;
        this.direktbetroffen = direktbetroffen;
        this.notizenGewalt = notizenGewalt;

        this.psychischeFolgen = psychischeFolgen;
        this.körperlicheFolgen = körperlicheFolgen;
        this.körperlicheBeeinträchtigung = körperlicheBeeinträchtigung;
        this.finanzielleFolgen = finanzielleFolgen;
        this.arbeitseinschraenkungen = arbeitseinschraenkungen;
        this.verlustArbeit = verlustArbeit;
        this.sozialeIsolation = sozialeIsolation;
        this.suizidalität = suizidalität;
        this.notizenFolgen = notizenFolgen;

        this.anzahlBegleitungen = anzahlBegleitungen;
        this.begleitungBei = begleitungBei;
        this.anzahlVerweise = anzahlVerweise;
        this.verweiseZu = verweiseZu;

        this.wohererfahren = wohererfahren;
        this.dolmetscher = dolmetscher;
        this.sprache = sprache;
        this.stunden = stunden;
    }

    public getAlias(): string{
        return this.alias;
    }

    public getRolle(): string{
        return this.rolle;
    }
    public getAlter(): string{
        return this.alter;
    }
    
    public getGeschlecht(): string{
        return this.geschlecht;
    }

    public getSexualitaet(): string{
        return this.sexualitaet;
    }

    public getWohnort(): string{
        return this.wohnort;
    }

    public getNationalitaet(): string{
        return this.nationalitaet;
    }

    public getBeruf(): string{
        return this.beruf;
    }

    public getBehinderung(): string{
        return this.behinderung;
    }

    public getArtbehinderung(): string{
        return this.artbehinderung;
    }

    public getGradbehinderung(): string{
        return this.gradbehinderung;
    }

    public getNotizenPersonenbezogen(): string{
        return this.notizenPersonenbezogen;
    }

    public getBeratungsstelle(): string{
        return this.beratungsstelle;
    }

    public getAnzahlBeratungen(): string{
        return this.anzahlBeratungen;
    }

    public getTermine(): Beratungstermine[]{
        return this.termine;
    }

    public getAlterzZeitpunkt(): string{
        return this.alterzZeitpunkt;
    }

    public getZeitrsaum(): string{
        return this.zeitrsaum;
    }

    public getArtVorfall(): string{
        return this.artVorfall;
    }

    public getAnzahlTaeter(): string{
        return this.anzahlTaeter;
    }

    public getTaeter(): Taeter[]{
        return this.taeter;
    }

    public getArtderGewalt(): boolean[]{
        return this.artderGewalt;
    }

    public getTatort(): string{
        return this.tatort;
    }

    public getAnzeige(): string{
        return this.anzeige;
    }

    public getMedizinischeVersorgung(): string{
        return this.medizinischeVersorgung;
    }

    public getSpurensicherung(): string{
        return this.spurensicherung;
    }

    public getMitbetroffeneKids(): string{
        return this.mitbetroffeneKids;
    }

    public getDirektbetroffen(): string{
        return this.direktbetroffen;
    }

    public getNotizenGewalt(): string{
        return this.notizenGewalt;
    }

    public getPsychischeFolgen(): boolean[]{
        return this.psychischeFolgen;
    }

    public getKörperlicheFolgen(): boolean[]{
        return this.körperlicheFolgen;
    }

    public getKörperlicheBeeinträchtigung(): string{
        return this.körperlicheBeeinträchtigung;
    }

    public getFinanzielleFolgen(): string{
        return this.finanzielleFolgen;
    }

    public getArbeitseinschraenkungen(): string{
        return this.arbeitseinschraenkungen;
    }

    public getVerlustArbeit(): string{
        return this.verlustArbeit;
    }

    public getSozialeIsolation(): string{
        return this.sozialeIsolation;
    }

    public getSuizidalität(): string{
        return this.suizidalität;
    }

    public getNotizenFolgen(): string{
        return this.notizenFolgen;
    }

    public getAnzahlBegleitungen(): string{
        return this.anzahlBegleitungen;
    }

    public getBegleitungBei(): boolean[]{
        return this.begleitungBei;
    }

    public getAnzahlVerweise(): string{
        return this.anzahlVerweise;
    }

    public getVerweiseZu(): boolean[]{
        return this.verweiseZu;
    }

    public getWohererfahren(): string{
        return this.wohererfahren;
    }

    public getDolmetscher(): string{
        return this.dolmetscher;
    }

    public getSprache(): string{
        return this.sprache;
    }

    public getStunden(): string{
        return this.stunden;
    }
}