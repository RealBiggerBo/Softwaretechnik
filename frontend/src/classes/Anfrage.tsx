import { TextField, EnumField, ToggleField, DateField } from "./DataField";
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
    const sende_art: TextField = new TextField(
      "Sendeart",
      0,
      true,
      "Bla bla bla",
      200,
    );
    const sende_datum: DateField = new DateField(
      "Sendedatum",
      1,
      true,
      "2026-01-07",
    );
    const sende_ort: EnumField = new EnumField("Sendeort", 2, true, "Ort");
    const sender_rolle: EnumField = new EnumField(
      "Senderrolle",
      3,
      true,
      "SenderRolle",
    );
    const im_auftrag: ToggleField = new ToggleField(
      "Im Auftrag",
      4,
      true,
      false,
    );
    const ist_queer: ToggleField = new ToggleField("Ist queer", 5, true, false);
    const anfrage_art: EnumField = new EnumField(
      "Anfrageart",
      6,
      true,
      "AnfrageArt",
    );
    const mit_termin: ToggleField = new ToggleField(
      "Mit Termin",
      7,
      true,
      false,
    );
    const termin_ort: EnumField = new EnumField("Terminort", 8, true, "Ort");
    const termin_datum: DateField = new DateField(
      "Termindatum",
      9,
      true,
      "2026-03-01",
    );

    const anfrage: DataRecord = new DataRecord(0, [
      sende_art,
      sende_datum,
      sende_ort,
      sender_rolle,
      im_auftrag,
      ist_queer,
      anfrage_art,
      mit_termin,
      termin_ort,
      termin_datum,
    ]);

    return JSON.stringify(anfrage);
  }
}
