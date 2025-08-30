import { Filter, Plus, ShoppingBag } from "lucide-react";
import CardLancamento from "../moleculas/CardLancamento";

interface LancamentosProps {
  lancamentos?: Array<{
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
  }>;
}

const Lancamentos = ({ lancamentos = [] }: LancamentosProps) => {
  const lancamentosParaExibir =
    lancamentos.length > 0
      ? lancamentos
      : [
          {
            icone: ShoppingBag,
            titulo: "Supermercado",
            data: "24/08/2025",
            valor: 280.5,
            tipo: "saida",
          },
        ];

  return (
    <div className="w-full pt-3">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-gray-300 text-lg font-semibold">
          Últimos lançamentos
        </h2>
        <div className="flex items-center gap-3">
          <button
            aria-label="Filtrar lançamentos"
            className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 w-10 flex items-center justify-center"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            aria-label="Adicionar lançamento"
            className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 w-10 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl">
        {lancamentosParaExibir.map((lancamento, index) => (
          <CardLancamento
            key={index}
            icone={lancamento.icone}
            titulo={lancamento.titulo}
            data={lancamento.data}
            valor={lancamento.valor}
            tipo={lancamento.tipo as "entrada" | "saida"}
          />
        ))}
      </div>
    </div>
  );
};

export default Lancamentos;
