import { type ReactNode } from "react";

interface TituloModalProps {
  titulo: string;
  icone: ReactNode;
}

const TituloModal = ({ titulo, icone }: TituloModalProps) => {
  return (
    <div className="flex items-center gap-2">
      {icone}
      <h2 className="text-white text-xl font-semibold">{titulo}</h2>
    </div>
  );
};

export default TituloModal;
