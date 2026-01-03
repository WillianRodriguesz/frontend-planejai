import { useEffect } from "react";
import { useCategoriasStore } from "../stores/useCategoriasStore";
import type { CategoriaDto } from "../types/categoria";

interface UseCategoriaReturn {
  categorias: CategoriaDto[];
  loading: boolean;
  error: string | null;
  buscarPorId: (id: number) => Promise<CategoriaDto | null>;
}

export const useCategorias = (): UseCategoriaReturn => {
  const { categorias, loading, error, fetchCategorias, buscarPorId, fetched } =
    useCategoriasStore();

  useEffect(() => {
    // Busca apenas se ainda não foi buscado
    if (!fetched) {
      fetchCategorias();
    }
  }, [fetchCategorias, fetched]);

  return {
    categorias,
    loading,
    error,
    buscarPorId,
  };
};
