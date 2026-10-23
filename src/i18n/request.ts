import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { COOKIE_IDIOMA, ehIdioma, IDIOMA_PADRAO } from "./config";

export default getRequestConfig(async () => {
  const salvo = (await cookies()).get(COOKIE_IDIOMA)?.value;
  const locale = ehIdioma(salvo) ? salvo : IDIOMA_PADRAO;

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
    timeZone: "America/Sao_Paulo",
  };
});
