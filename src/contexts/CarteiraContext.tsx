import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CarteiraContextData {
  idCarteira: string | null;
  setIdCarteira: (id: string | null) => void;
}

const CarteiraContext = createContext<CarteiraContextData | undefined>(
  undefined
);

interface CarteiraProviderProps {
  children: ReactNode;
}

export const CarteiraProvider: React.FC<CarteiraProviderProps> = ({
  children,
}) => {
  // ID da carteira obtido da API buscarUsuario
  const [idCarteira, setIdCarteiraState] = useState<string | null>(null);

  const setIdCarteira = (id: string | null) => {
    setIdCarteiraState(id);
  };

  return (
    <CarteiraContext.Provider value={{ idCarteira, setIdCarteira }}>
      {children}
    </CarteiraContext.Provider>
  );
};

export const useCarteira = () => {
  const context = useContext(CarteiraContext);
  if (context === undefined) {
    throw new Error("useCarteira deve ser usado dentro de um CarteiraProvider");
  }
  return context;
};
