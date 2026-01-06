export class Anfrage {
    private alias: string;
    private datum: string;
    private wer: string;
    private aus: string;
    private art: string;
    private wie: string;
    private termin: string;
    private datumTermin: string;
    private ort: string;

    constructor(
        alias: string,
        datum: string,
        wer: string,
        aus: string,
        art: string,
        wie: string,
        termin: string,
        datumTermin: string,
        ort: string
    ) {
        this.alias = alias;
        this.datum = datum;
        this.wer = wer;
        this.aus = aus;
        this.art = art;
        this.wie = wie;
        this.termin = termin;
        this.datumTermin = datumTermin;
        this.ort = ort;
    }

    public getAlias(): string {
        return this.alias;
    }

    public getDatum(): string {
        return this.datum;
    }

    public getWer(): string {
        return this.wer;
    }

    public getAus(): string {
        return this.aus;
    }

    public getArt(): string {
        return this.art;
    }

    public getWie(): string {
        return this.wie;
    }

    public getTermin(): string {
        return this.termin;
    }

    public getDatumTermin(): string {
        return this.datumTermin;
    }

    public getOrt(): string {
        return this.ort;
    }
}