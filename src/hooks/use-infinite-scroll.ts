import { useEffect, useRef } from "react";

export function useInfiniteScroll(carregarMais: () => void, ativo: boolean) {
  const sentinela = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const elemento = sentinela.current;
    if (!elemento || !ativo) return;

    const observer = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && carregarMais(),
      { rootMargin: "200px" },
    );
    observer.observe(elemento);
    return () => observer.disconnect();
  }, [carregarMais, ativo]);

  return sentinela;
}
