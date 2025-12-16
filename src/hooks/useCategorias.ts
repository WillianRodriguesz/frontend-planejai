import { useState, useEffect } from "react";
import type { CategoriaDto } from "../types/categoria";
import {
  buscarTodasCategorias,
  buscarCategoriaPorId,
} from "../api/categoriasApi";

interface UseCategoriaReturn {
  categorias: CategoriaDto[];
  loading: boolean;
  error: string | null;
  buscarPorId: (id: number) => Promise<CategoriaDto | null>;
}

export const useCategorias = (): UseCategoriaReturn => {
  const [categorias, setCategorias] = useState<CategoriaDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await buscarTodasCategorias();
        setCategorias(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro desconhecido");
        setCategorias([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  const buscarPorId = async (id: number): Promise<CategoriaDto | null> => {
    try {
      const categoria = await buscarCategoriaPorId(id);
      return categoria;
    } catch (err) {
      return null;
    }
  };

  return {
    categorias,
    loading,
    error,
    buscarPorId,
  };
};
