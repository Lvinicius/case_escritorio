import { TRPCClientError } from "@trpc/client";
import type { CamposComErro } from "@/lib/schemas";
import type { AppRouter } from "@/server/routers/_app";

function comoErroTRPC(erro: unknown) {
  return erro instanceof TRPCClientError
    ? (erro as TRPCClientError<AppRouter>)
    : null;
}

export function camposComErro(erro: unknown): CamposComErro {
  return (comoErroTRPC(erro)?.data?.fieldErrors as CamposComErro | null) ?? {};
}

// Devolve a chave de tradução que descreve o erro para o usuário.
export function chaveDoErro(erro: unknown) {
  const primeiroCampo = Object.values(camposComErro(erro)).flat()[0];
  if (primeiroCampo) return `validacao.${primeiroCampo}`;
  if (comoErroTRPC(erro)?.data?.code === "NOT_FOUND")
    return "erros.naoEncontrada";
  return "erros.generico";
}
