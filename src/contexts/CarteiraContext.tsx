import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { useCarteiraStore } from "../stores/useCarteiraStore";
import { useUsuarioStore } from "../stores/useUsuarioStore";

interface CarteiraProviderProps {
  children: ReactNode;
}

export const CarteiraProvider: React.FC<CarteiraProviderProps> = ({
  children,
}) => {
  const { setIdCarteira, clearCarteira } = useCarteiraStore();
  const { fetchUsuario, carteiraId } = useUsuarioStore();

  useEffect(() => {
    // Busca o usuário e ID da carteira do backend via token JWT seguro
    const carregarDados = async () => {
      try {
        await fetchUsuario();
      } catch (error) {
        // Token inválido ou expirado - limpa estado
        clearCarteira();
      }
    };

    carregarDados();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Executar apenas uma vez no mount

  // Sincroniza carteiraId da store de usuário com a store de carteira
  useEffect(() => {
    if (carteiraId) {
      setIdCarteira(carteiraId);
    }
  }, [carteiraId, setIdCarteira]);

  return <>{children}</>;
};

export const useCarteira = () => {
  const { idCarteira, setIdCarteira, clearCarteira } = useCarteiraStore();
  return { idCarteira, setIdCarteira, clearCarteira };
};
