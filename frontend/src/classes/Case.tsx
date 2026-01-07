import type {
  BehinderungsForm,
  Beratungsstelle,
  BeruflicheSituation,
  GeschlechtsIdentitaet,
  Ort,
  Quelle,
  SenderRolle,
  Sexualitaet,
} from "./unions";

export class Taeter {
  private geschlaecht: string;
  private verhaeltnis: string;

  constructor(geschlaecht: string, verhaeltnis: string) {
    this.geschlaecht = geschlaecht;
    this.verhaeltnis = verhaeltnis;
  }

  public getGeschlaecht(): string {
    return this.geschlaecht;
  }

  public getVerhaeltnis(): string {
    return this.verhaeltnis;
  }
}

export class Beratungstermine {
  private datum: string;
  private art: string;
  private ort: string;
  private notizen: string;

  constructor(datum: string, art: string, ort: string, notizen: string) {
    this.datum = datum;
    this.art = art;
    this.ort = ort;
    this.notizen = notizen;
  }

  public getDatum(): string {
    return this.datum;
  }

  public getArt(): string {
    return this.art;
  }

  public getOrt(): string {
    return this.ort;
  }

  public getNotizen(): string {
    return this.notizen;
  }
}

export class Case {
  // Stammdaten
  public alias: string;
  public rolle: SenderRolle;
  public alter: number;
  public geschlecht: GeschlechtsIdentitaet;
  public sexualitaet: Sexualitaet;
  public wohnort: Ort;
  public staatsangehoerigkeit: string;
  public berufssituation: BeruflicheSituation;

  // Schwerbehinderung
  public schwerbehinderung: boolean;
  public schwerbehinderung_form: BehinderungsForm;
  public schwerbehinderung_grad?: string;

  // Beratungskontext
  public beratungsstelle: Beratungsstelle;
  public anzahl_beratungen: number;

  // Psychische / Physische Folgen
  public depression: boolean;
  public angststoerung: boolean;
  public ptbs: boolean;
  public anderes: boolean;
  public burn_out: boolean;
  public schlafstoerung: boolean;
  public sucht: boolean;
  public kommunikationsschwierigkeiten: boolean;
  public vernachlaessigung_alltaeglicher_dinge: boolean;
  public schmerzen: boolean;
  public laehmungen: boolean;
  public krankheit: boolean;
  public dauerhafte_beeintraechtigung?: string;

  // Soziale / Wirtschaftliche Folgen
  public finanzielle_folgen: boolean;
  public arbeits_einschraenkung: boolean;
  public verlust_arbeit: boolean;
  public soziale_isolation: boolean;
  public suizidalitaet: boolean;
  public weiteres?: string;
  public notizen_folgen?: string;

  // Begleitungen (Statistik)
  public begleitungen_gesamt: number;
  public begleitungen_gerichte: number;
  public begleitungen_polizei: number;
  public begleitungen_rechtsanwaelte: number;
  public begleitungen_aerzte: number;
  public begleitungen_rechtsmedizin: number;
  public begleitungen_jugendamt: number;
  public begleitungen_sozialamt: number;
  public begleitungen_jobcenter: number;
  public begleitungen_beratungstellen: number;
  public begleitungen_schutzeinrichtungen: number;
  public begleitungen_schutzeinrichtungen_spezialisiert: number;
  public begleitungen_interventionsstellen: number;
  public begleitungen_sonstige?: string;

  // Verweise (Statistik)
  public verweise_gesamt: number;
  public verweise_gerichte: number;
  public verweise_polizei: number;
  public verweise_rechtsanwaelte: number;
  public verweise_aerzte: number;
  public verweise_rechtsmedizin: number;
  public verweise_jugendamt: number;
  public verweise_sozialamt: number;
  public verweise_jobcenter: number;
  public verweise_beratungstellen: number;
  public verweise_schutzeinrichtungen: number;
  public verweise_schutzeinrichtungen_spezialisiert: number;
  public verweise_interventionsstellen: number;
  public verweise_sonstige?: string;

  // Meta
  public quelle: Quelle;
  public andere_quelle?: string;
  public dolmetsch_zeit: number;
  public dolmetsch_sprache?: string;
  public notizen?: string;

  constructor(
    alias: string,
    rolle: SenderRolle,
    alter: number,
    geschlecht: GeschlechtsIdentitaet,
    sexualitaet: Sexualitaet,
    wohnort: Ort,
    staatsangehoerigkeit: string,
    berufssituation: BeruflicheSituation,
    schwerbehinderung: boolean,
    schwerbehinderung_form: BehinderungsForm,
    beratungsstelle: Beratungsstelle,
    anzahl_beratungen: number,
    depression: boolean,
    angststoerung: boolean,
    ptbs: boolean,
    anderes: boolean,
    burn_out: boolean,
    schlafstoerung: boolean,
    sucht: boolean,
    kommunikationsschwierigkeiten: boolean,
    vernachlaessigung_alltaeglicher_dinge: boolean,
    schmerzen: boolean,
    laehmungen: boolean,
    krankheit: boolean,
    finanzielle_folgen: boolean,
    arbeits_einschraenkung: boolean,
    verlust_arbeit: boolean,
    soziale_isolation: boolean,
    suizidalitaet: boolean,
    begleitungen_gesamt: number,
    begleitungen_gerichte: number,
    begleitungen_polizei: number,
    begleitungen_rechtsanwaelte: number,
    begleitungen_aerzte: number,
    begleitungen_rechtsmedizin: number,
    begleitungen_jugendamt: number,
    begleitungen_sozialamt: number,
    begleitungen_jobcenter: number,
    begleitungen_beratungstellen: number,
    begleitungen_schutzeinrichtungen: number,
    begleitungen_schutzeinrichtungen_spezialisiert: number,
    begleitungen_interventionsstellen: number,
    verweise_gesamt: number,
    verweise_gerichte: number,
    verweise_polizei: number,
    verweise_rechtsanwaelte: number,
    verweise_aerzte: number,
    verweise_rechtsmedizin: number,
    verweise_jugendamt: number,
    verweise_sozialamt: number,
    verweise_jobcenter: number,
    verweise_beratungstellen: number,
    verweise_schutzeinrichtungen: number,
    verweise_schutzeinrichtungen_spezialisiert: number,
    verweise_interventionsstellen: number,
    quelle: Quelle,
    dolmetsch_zeit: number,
    // Optionale Parameter am Ende oder explizit übergeben
    schwerbehinderung_grad?: string,
    dauerhafte_beeintraechtigung?: string,
    weiteres?: string,
    notizen_folgen?: string,
    begleitungen_sonstige?: string,
    verweise_sonstige?: string,
    andere_quelle?: string,
    dolmetsch_sprache?: string,
    notizen?: string,
  ) {
    this.alias = alias;
    this.rolle = rolle;
    this.alter = alter;
    this.geschlecht = geschlecht;
    this.sexualitaet = sexualitaet;
    this.wohnort = wohnort;
    this.staatsangehoerigkeit = staatsangehoerigkeit;
    this.berufssituation = berufssituation;
    this.schwerbehinderung = schwerbehinderung;
    this.schwerbehinderung_form = schwerbehinderung_form;
    this.schwerbehinderung_grad = schwerbehinderung_grad;
    this.beratungsstelle = beratungsstelle;
    this.anzahl_beratungen = anzahl_beratungen;
    this.depression = depression;
    this.angststoerung = angststoerung;
    this.ptbs = ptbs;
    this.anderes = anderes;
    this.burn_out = burn_out;
    this.schlafstoerung = schlafstoerung;
    this.sucht = sucht;
    this.kommunikationsschwierigkeiten = kommunikationsschwierigkeiten;
    this.vernachlaessigung_alltaeglicher_dinge =
      vernachlaessigung_alltaeglicher_dinge;
    this.schmerzen = schmerzen;
    this.laehmungen = laehmungen;
    this.krankheit = krankheit;
    this.dauerhafte_beeintraechtigung = dauerhafte_beeintraechtigung;
    this.finanzielle_folgen = finanzielle_folgen;
    this.arbeits_einschraenkung = arbeits_einschraenkung;
    this.verlust_arbeit = verlust_arbeit;
    this.soziale_isolation = soziale_isolation;
    this.suizidalitaet = suizidalitaet;
    this.weiteres = weiteres;
    this.notizen_folgen = notizen_folgen;
    this.begleitungen_gesamt = begleitungen_gesamt;
    this.begleitungen_gerichte = begleitungen_gerichte;
    this.begleitungen_polizei = begleitungen_polizei;
    this.begleitungen_rechtsanwaelte = begleitungen_rechtsanwaelte;
    this.begleitungen_aerzte = begleitungen_aerzte;
    this.begleitungen_rechtsmedizin = begleitungen_rechtsmedizin;
    this.begleitungen_jugendamt = begleitungen_jugendamt;
    this.begleitungen_sozialamt = begleitungen_sozialamt;
    this.begleitungen_jobcenter = begleitungen_jobcenter;
    this.begleitungen_beratungstellen = begleitungen_beratungstellen;
    this.begleitungen_schutzeinrichtungen = begleitungen_schutzeinrichtungen;
    this.begleitungen_schutzeinrichtungen_spezialisiert =
      begleitungen_schutzeinrichtungen_spezialisiert;
    this.begleitungen_interventionsstellen = begleitungen_interventionsstellen;
    this.begleitungen_sonstige = begleitungen_sonstige;
    this.verweise_gesamt = verweise_gesamt;
    this.verweise_gerichte = verweise_gerichte;
    this.verweise_polizei = verweise_polizei;
    this.verweise_rechtsanwaelte = verweise_rechtsanwaelte;
    this.verweise_aerzte = verweise_aerzte;
    this.verweise_rechtsmedizin = verweise_rechtsmedizin;
    this.verweise_jugendamt = verweise_jugendamt;
    this.verweise_sozialamt = verweise_sozialamt;
    this.verweise_jobcenter = verweise_jobcenter;
    this.verweise_beratungstellen = verweise_beratungstellen;
    this.verweise_schutzeinrichtungen = verweise_schutzeinrichtungen;
    this.verweise_schutzeinrichtungen_spezialisiert =
      verweise_schutzeinrichtungen_spezialisiert;
    this.verweise_interventionsstellen = verweise_interventionsstellen;
    this.verweise_sonstige = verweise_sonstige;
    this.quelle = quelle;
    this.andere_quelle = andere_quelle;
    this.dolmetsch_zeit = dolmetsch_zeit;
    this.dolmetsch_sprache = dolmetsch_sprache;
    this.notizen = notizen;
  }
}
