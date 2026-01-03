import { create } from "zustand";
import {
  buscarCategoriaPorId,
  buscarTodasCategorias,
} from "../api/categoriasApi";
import type { CategoriaDto } from "../types/categoria";

interface CategoriasState {
  categorias: CategoriaDto[];
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchCategorias: () => Promise<void>;
  buscarPorId: (id: number) => Promise<CategoriaDto | null>;
  reset: () => void;
}

export const useCategoriasStore = create<CategoriasState>((set, get) => ({
  categorias: [],
  loading: false,
  error: null,
  fetched: false,

  fetchCategorias: async () => {
    // Se já está carregando ou já foi buscado, não faz nada
    if (get().loading || get().fetched) return;

    set({ loading: true, error: null });

    try {
      const data = await buscarTodasCategorias();
      set({ categorias: data, loading: false, fetched: true });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erro desconhecido",
        loading: false,
        categorias: [],
      });
    }
  },

  buscarPorId: async (id: number): Promise<CategoriaDto | null> => {
    try {
      const categoria = await buscarCategoriaPorId(id);
      return categoria;
    } catch (err) {
      return null;
    }
  },

  reset: () =>
    set({ categorias: [], loading: false, error: null, fetched: false }),
}));
