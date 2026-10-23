"use client";

import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCacheDeTarefas } from "@/hooks/use-cache-de-tarefas";
import { useTraduzirErro } from "@/hooks/use-traduzir-erro";
import { camposComErro } from "@/lib/erros";
import {
  LIMITE_DESCRICAO,
  LIMITE_TITULO,
  tarefaInput,
  type CamposComErro,
  type TarefaInput,
} from "@/lib/schemas";
import { useTRPC } from "@/trpc/client";

export function TaskForm() {
  const trpc = useTRPC();
  const router = useRouter();
  const cache = useCacheDeTarefas();
  const t = useTranslations("formulario");
  const traduzir = useTraduzirErro();
  const criar = useMutation(trpc.tarefa.criar.mutationOptions());

  const [valores, setValores] = useState<Required<TarefaInput>>({
    titulo: "",
    descricao: "",
  });
  const [erros, setErros] = useState<CamposComErro>({});
  const salvando = criar.isPending;

  const alterar =
    (campo: keyof TarefaInput) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValores((atuais) => ({ ...atuais, [campo]: e.target.value }));
      setErros((atuais) => ({ ...atuais, [campo]: undefined }));
    };

  async function enviar(e: FormEvent) {
    e.preventDefault();
    const resultado = tarefaInput.safeParse(valores);
    if (!resultado.success) {
      setErros(z.flattenError(resultado.error).fieldErrors);
      return;
    }

    try {
      await criar.mutateAsync(resultado.data);
      toast.success(t("criada"));
      cache.descartar();
      router.push("/");
    } catch (erro) {
      setErros(camposComErro(erro));
      toast.error(traduzir.mensagem(erro));
    }
  }

  return (
    <Card className="p-6">
      <form onSubmit={enviar} noValidate className="space-y-5">
        <Campo
          id="titulo"
          label={t("titulo")}
          obrigatorio
          erro={erros.titulo && traduzir.validacao(erros.titulo[0])}
          tamanho={valores.titulo.length}
          limite={LIMITE_TITULO}
        >
          <Input
            id="titulo"
            value={valores.titulo}
            onChange={alterar("titulo")}
            placeholder={t("placeholderTitulo")}
            aria-invalid={Boolean(erros.titulo)}
            aria-describedby="titulo-erro"
            autoFocus
          />
        </Campo>

        <Campo
          id="descricao"
          label={t("descricao")}
          erro={erros.descricao && traduzir.validacao(erros.descricao[0])}
          tamanho={valores.descricao.length}
          limite={LIMITE_DESCRICAO}
        >
          <Textarea
            id="descricao"
            value={valores.descricao}
            onChange={alterar("descricao")}
            placeholder={t("placeholderDescricao")}
            aria-invalid={Boolean(erros.descricao)}
            aria-describedby="descricao-erro"
          />
        </Campo>

        <div className="flex justify-end gap-2 pt-2">
          <Button asChild variant="outline">
            <Link href="/">{t("cancelar")}</Link>
          </Button>
          <Button type="submit" disabled={salvando}>
            {salvando && <Loader2 className="animate-spin" />}
            {t(salvando ? "salvando" : "criar")}
          </Button>
        </div>
      </form>
    </Card>
  );
}

type CampoProps = {
  id: string;
  label: string;
  obrigatorio?: boolean;
  erro?: string;
  tamanho: number;
  limite: number;
  children: React.ReactNode;
};

function Campo({
  id,
  label,
  obrigatorio,
  erro,
  tamanho,
  limite,
  children,
}: CampoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>
          {label}
          {obrigatorio && <span className="text-destructive"> *</span>}
        </Label>
        <span
          className={
            tamanho > limite
              ? "text-destructive text-xs"
              : "text-muted-foreground text-xs"
          }
        >
          {tamanho}/{limite}
        </span>
      </div>
      {children}
      <p
        id={`${id}-erro`}
        role="alert"
        className="text-destructive min-h-4 text-xs"
      >
        {erro}
      </p>
    </div>
  );
}
