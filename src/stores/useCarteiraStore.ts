import { create } from "zustand";

interface CarteiraState {
  idCarteira: string | null;
  setIdCarteira: (id: string | null) => void;
  clearCarteira: () => void;
}

// Estado mantido apenas em memória por segurança
// O ID é buscado do backend via JWT a cada sessão
export const useCarteiraStore = create<CarteiraState>((set) => ({
  idCarteira: null,

  setIdCarteira: (id: string | null) => {
    set({ idCarteira: id });
  },

  clearCarteira: () => {
    set({ idCarteira: null });
  },
}));
