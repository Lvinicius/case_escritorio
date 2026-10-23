import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

type Props = {
  titulo: string;
  descricao: string;
  acao?: React.ReactNode;
  voltar?: boolean;
};

export function PageHeader({ titulo, descricao, acao, voltar }: Props) {
  const t = useTranslations("formulario");

  return (
    <header className="mb-6 space-y-4">
      {voltar && (
        <Link
          href="/"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-sm transition-colors"
        >
          <ArrowLeft className="size-4" /> {t("voltar")}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
          <p className="text-muted-foreground text-sm">{descricao}</p>
        </div>
        {acao}
      </div>
    </header>
  );
}
