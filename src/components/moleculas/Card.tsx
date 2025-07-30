import React from "react";

interface CardProps {
  titulo: string;
  valor: string;
  descricao: string;
  icon?: React.ReactNode;
  iconePequeno?: React.ReactNode;
  corIcone?: string;
  corIconePequeno?: string;
}

const Card = ({
  titulo,
  valor,
  descricao,
  icon,
  iconePequeno,
  corIcone = "text-white",
  corIconePequeno = "text-gray-400",
}: CardProps) => {
  return (
    <div className="min-w-80 w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className={`flex-shrink-0 ${corIcone}`}>{icon}</div>
        <h2 className="text-gray-300 text-lg font-semibold flex-1 text-right">
          {titulo}
        </h2>
      </div>

      <div className="text-center mb-4">
        <p className="text-white text-3xl font-bold">{valor}</p>
      </div>

      <div className="flex items-center justify-center gap-2">
        {iconePequeno && <div className={corIconePequeno}>{iconePequeno}</div>}
        <p className="text-gray-300 text-sm">{descricao}</p>
      </div>
    </div>
  );
};

export default Card;
