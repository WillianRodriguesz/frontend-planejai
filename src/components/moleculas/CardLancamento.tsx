import type { LucideIcon } from "lucide-react";
import { formataValorBRL } from "../../utils/formataValorBrl";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface CardLancamentoProps {
  icone: LucideIcon;
  titulo: string;
  data: string;
  valor: number;
  tipo?: "entrada" | "saida";
  onClick?: () => void;
}

const CardLancamento = ({
  icone: Icone,
  titulo,
  data,
  valor,
  tipo = "saida",
  onClick,
}: CardLancamentoProps) => {
  const valorClassName = tipo === "entrada" ? "text-green-700" : "text-red-700";

  const DirecaoIcone = tipo === "entrada" ? ArrowUpRight : ArrowDownRight;

  return (
    <div
      className={`w-full bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border-b border-purple-500/30 shadow-xl p-2 ${
        onClick
          ? "cursor-pointer hover:from-card/90 hover:to-card/50 transition-all duration-200"
          : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-900/40 backdrop-blur-sm">
            <Icone className="w-5 h-5 text-purple-400" />
          </div>

          <div className="flex flex-col gap-1">
            <h3 className="text-gray-300 font-medium text-sm">{titulo}</h3>
            <span className="text-gray-400 text-xs">{data}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`font-semibold text-sm ${valorClassName}`}>
            {formataValorBRL(valor)}
          </span>
          <DirecaoIcone className={`w-4 h-4 ${valorClassName} rounded-lg`} />
        </div>
      </div>
    </div>
  );
};

export default CardLancamento;
