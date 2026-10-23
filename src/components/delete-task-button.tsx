"use client";

import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type Props = {
  titulo: string;
  excluindo: boolean;
  onConfirmar: () => void;
};

export function DeleteTaskButton({ titulo, excluindo, onConfirmar }: Props) {
  const t = useTranslations();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={t("tarefa.excluir")}
          disabled={excluindo}
          className="hover:text-destructive"
        >
          {excluindo ? <Loader2 className="animate-spin" /> : <Trash2 />}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogTitle>{t("exclusao.titulo")}</AlertDialogTitle>
        <AlertDialogDescription>
          {t("exclusao.descricao", { titulo })}
        </AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("exclusao.cancelar")}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirmar}>
            {t("exclusao.confirmar")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
