import { DataRecord } from "./DataRecord";
import type { AnfrageArt, Ort, SenderRolle } from "./unions";

export class Anfrage {
  //    "sende_art": "string (maxLänge: 200)",
  //    "sende_datum": "YYYY-MM-DD",
  //    "sende_ort": "-> Aufzählungen",
  //    "sender_rolle": "-> Aufzählungen",
  //    "im_auftrag": bool,
  //    "ist_queer": bool,
  //    "anfrage_art": "-> Aufzählungen",
  //    "mit_termin": bool,
  //    "termin_ort": "-> Aufzählungen",
  //    "termin_datum": "YYYY-MM-DD"

  sende_art: string;
  sende_datum: string;
  sende_ort: Ort;
  sender_rolle: SenderRolle;
  im_auftrag: boolean;
  ist_queer: boolean;
  anfrage_art: AnfrageArt;
  mit_termin: boolean;
  termin_ort: Ort;
  termin_datum: string;

  constructor(
    sende_art: string,
    sende_datum: string,
    sende_ort: Ort,
    sender_rolle: SenderRolle,
    im_auftrag: boolean,
    ist_queer: boolean,
    anfrage_art: AnfrageArt,
    mit_termin: boolean,
    termin_ort: Ort,
    termin_datum: string,
  ) {
    this.sende_art = sende_art;
    this.sende_datum = sende_datum;
    this.sende_ort = sende_ort;
    this.sender_rolle = sender_rolle;
    this.im_auftrag = im_auftrag;
    this.ist_queer = ist_queer;
    this.anfrage_art = anfrage_art;
    this.mit_termin = mit_termin;
    this.termin_ort = termin_ort;
    this.termin_datum = termin_datum;
  }

  static GetNewJonsonFormat(): string {
    const anfrage: DataRecord = new DataRecord([]);

    return JSON.stringify(anfrage);
  }
}
