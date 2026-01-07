// --- Union Types (Aufzählungen) ---

// "S": Stadt Leipzig, "L": Landkreis Leipzig, "N": Landkreis Nordsachsen
export type Beratungsstelle = "S" | "L" | "N";

// "S": Stadt Leipzig, "L": Landkreis Leipzig, "N": Landkreis Nordsachsen, "B": Sachsen, "X": Sonstiges
export type Ort = "S" | "L" | "N" | "B" | "X";

// "B": Betroffene:r, "F": Fachkraft, "A": Angehörige:r, "U": anonym
export type SenderRolle = "B" | "F" | "A" | "U";

// "M": med. Soforthilfe, "S": Vertr. Spurensicherung, "B": Beratung, "R": Rechtliches, "X": Sonstiges
export type AnfrageArt = "M" | "S" | "B" | "R" | "X";

// "C": cis w, "T": trans w, "M": trans m, "N": trans nb, "I": inter, "A": agender, "D": divers
export type GeschlechtsIdentitaet = "C" | "T" | "M" | "N" | "I" | "A" | "D";

// "L": lesbisch, "S": schwul, "B": bisexuell, "A": asexuell, "H": heterosexuell
export type Sexualitaet = "L" | "S" | "B" | "A" | "H";

// "L": arbeitslos, "S": studierend, "B": berufstätig, "R": berentet, "A": Azubi, "U": berufsunfähig
export type BeruflicheSituation = "L" | "S" | "B" | "R" | "A" | "U";

// "P": kognitiv, "K": körperlich
export type BehinderungsForm = "P" | "K";

// "S": Polizei, "P": Privat, "B": Beratungsstelle, "I": Internet, "A": Amt, "G": Arzt, "R": Anwalt
export type Quelle = "S" | "P" | "B" | "I" | "A" | "G" | "R";
