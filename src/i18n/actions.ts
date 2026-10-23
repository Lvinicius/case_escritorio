"use server";

import { cookies } from "next/headers";
import { COOKIE_IDIOMA, ehIdioma } from "./config";

export async function definirIdioma(idioma: string) {
  if (!ehIdioma(idioma)) return;
  (await cookies()).set(COOKIE_IDIOMA, idioma, {
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });
}
