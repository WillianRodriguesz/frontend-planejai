import { create } from "zustand";
import { buscarUsuario as buscarUsuarioApi } from "../api/usuarioApi";
import type { UsuarioDto } from "../types/usuario";

interface UsuarioState {
  usuario: UsuarioDto | null;
  carteiraId: string | null;
  loading: boolean;
  error: string | null;
  fetched: boolean;
  fetchUsuario: () => Promise<void>;
  updateUsuario: (usuario: UsuarioDto) => void;
  reset: () => void;
}

export const useUsuarioStore = create<UsuarioState>((set, get) => ({
  usuario: null,
  carteiraId: null,
  loading: false,
  error: null,
  fetched: false,

  fetchUsuario: async () => {
    // Se já está carregando ou já foi buscado, não faz nada
    if (get().loading || get().fetched) return;

    set({ loading: true, error: null });

    try {
      const data = await buscarUsuarioApi();
      set({
        usuario: data.usuario,
        carteiraId: data.carteiraId,
        loading: false,
        fetched: true,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Erro desconhecido",
        loading: false,
      });
    }
  },

  updateUsuario: (usuario: UsuarioDto) => {
    set({ usuario });
  },

  reset: () =>
    set({
      usuario: null,
      carteiraId: null,
      loading: false,
      error: null,
      fetched: false,
    }),
}));
