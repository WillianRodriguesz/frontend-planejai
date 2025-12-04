import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CarteiraContextData {
  idCarteira: string | null;
  setIdCarteira: (id: string) => void;
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
  // Por enquanto, usa a variável de ambiente. Futuramente virá de um cookie
  const [idCarteira, setIdCarteiraState] = useState<string | null>(
    import.meta.env.VITE_CARTEIRA_ID_TEMP || null
  );

  const setIdCarteira = (id: string) => {
    // Futuramente, aqui será definido no cookie
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
