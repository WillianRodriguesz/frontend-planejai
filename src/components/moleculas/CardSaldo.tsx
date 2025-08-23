import { Settings } from "lucide-react";
import { formataValorBRL } from "../../utils/formataValorBrl";

interface CardProps {
  saldo: number;
  saldoEntrada: number;
  saldoSainda: number;
  dataMes: string;
  dataAno: string;
}

const CardSaldo = ({
  saldo,
  saldoEntrada,
  saldoSainda,
  dataMes,
  dataAno,
}: CardProps) => {
  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-baseline gap-1">
          <span className="text-white text-lg font-semibold">{dataMes}</span>
          <span className="text-gray-400 text-sm">/ {dataAno}</span>
        </h2>
        <Settings className="text-gray-400 hover:text-white cursor-pointer w-5 h-5" />
      </div>

      <div className="text-left mb-6">
        <p className="text-gray-500 text-sm">orçamento disponível</p>
        <p className="text-white text-3xl font-bold">
          {formataValorBRL(saldo)}
        </p>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col items-start">
          <span className="text-gray-500 text-sm">Entradas</span>
          <span className="text-green-500 text-base font-semibold">
            {formataValorBRL(saldoEntrada)}
          </span>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-500 text-sm">Saídas</span>
          <span className="text-red-500 text-base font-semibold">
            {formataValorBRL(saldoSainda)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CardSaldo;
