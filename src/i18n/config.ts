export const IDIOMAS = ["pt", "en", "es"] as const;

export type Idioma = (typeof IDIOMAS)[number];

export const IDIOMA_PADRAO: Idioma = "pt";
export const COOKIE_IDIOMA = "NEXT_LOCALE";

export const ehIdioma = (valor: unknown): valor is Idioma =>
  IDIOMAS.includes(valor as Idioma);
