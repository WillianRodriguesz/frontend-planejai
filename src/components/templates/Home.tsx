import { useState } from "react";
import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";
import { ShoppingBag, Coffee, Home as HomeIcon, Settings } from "lucide-react";
import Lancamentos from "../organismos/Lancamentos";
import { useSaldo } from "../../hooks/useSaldo";
import { converterMesParaNumero, formatarDataBR } from "../../utils/dateUtils";

export default function Home() {
  const [dataSelecionada, setDataSelecionada] = useState({
    mes: new Date().toLocaleString("pt-BR", { month: "long" }),
    ano: new Date().getFullYear(),
  });

  // Converter nome do mês para número (1-12)
  const mesNumero = converterMesParaNumero(dataSelecionada.mes);

  const { saldo, loading, error } = useSaldo({
    mes: mesNumero,
    ano: dataSelecionada.ano,
  });

  const [lancamentos, setLancamentos] = useState([
    {
      icone: ShoppingBag,
      titulo: "Supermercado",
      data: "24/08/2025",
      valor: 280.5,
      tipo: "saida" as const,
    },
    {
      icone: Coffee,
      titulo: "Cafeteria",
      data: "22/08/2025",
      valor: 42.9,
      tipo: "saida" as const,
    },
    {
      icone: HomeIcon,
      titulo: "Aluguel recebido",
      data: "20/08/2025",
      valor: 1500.0,
      tipo: "entrada" as const,
    },
  ]);

  const adicionarLancamento = (novoLancamento: {
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => {
    // Determine qual ícone usar com base na categoria
    let icone;
    switch (novoLancamento.categoria) {
      case "alimentacao":
        icone = Coffee;
        break;
      case "moradia":
        icone = HomeIcon;
        break;
      default:
        icone = ShoppingBag;
    }

    const dataFormatada = formatarDataBR(novoLancamento.data);

    // Adicionar o novo lançamento à lista
    setLancamentos([
      ...lancamentos,
      {
        titulo: novoLancamento.titulo,
        data: dataFormatada,
        valor: novoLancamento.valor,
        tipo: novoLancamento.tipo,
        icone,
      },
    ]);
  };

  return (
    <div className="bg-background min-h-screen w-full h-full flex flex-col overflow-x-hidden">
      <Header />
      <div className="min-h-[60px] w-full"></div>

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="w-full z-10 pt-2 menu-altura-ajustada">
            <MenuSelecionadorMes
              onChange={(data) => setDataSelecionada(data)}
              mesInicial={new Date().getMonth()}
              anoInicial={new Date().getFullYear()}
            />
          </div>
          <div className="w-full mt-6">
            {error ? (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                <p className="text-red-400 font-semibold">
                  Erro ao carregar saldo
                </p>
                <p className="text-red-300 text-sm mt-1">{error}</p>
              </div>
            ) : loading ? (
              <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-4 relative overflow-hidden">
                {/* Efeito de shimmer global */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

                {/* Cabeçalho com textos reais */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="flex items-baseline gap-1">
                    <span className="text-white text-lg font-semibold">
                      {dataSelecionada.mes}
                    </span>
                    <span className="text-gray-400 text-sm">/</span>
                    <span className="text-gray-400 text-sm">
                      {dataSelecionada.ano}
                    </span>
                  </h2>
                  {/* Ícone settings real (sem skeleton) */}
                  <Settings className="text-gray-400 hover:text-violet-600 cursor-pointer w-5 h-5" />
                </div>

                {/* Saldo do mês - skeleton apenas no valor */}
                <div className="text-left mb-6">
                  <p className="text-gray-400 text-sm">Saldo do mês</p>
                  <div className="relative h-9 w-40 bg-gray-700/50 rounded overflow-hidden mt-1">
                    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                  </div>
                </div>

                {/* Entradas e Saídas - skeleton apenas nos valores */}
                <div className="flex justify-between">
                  <div className="flex flex-col">
                    <span className="text-gray-400 text-sm">Entradas</span>
                    <div className="relative h-5 w-24 bg-gray-700/50 rounded overflow-hidden mt-1">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-sm">Saídas</span>
                    <div className="relative h-5 w-24 bg-gray-700/50 rounded overflow-hidden mt-1">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : saldo ? (
              <CardSaldo
                key={`${dataSelecionada.mes}-${dataSelecionada.ano}`}
                dataMes={dataSelecionada.mes}
                dataAno={dataSelecionada.ano.toString()}
                saldo={saldo.saldoMes}
                saldoEntrada={saldo.entradas}
                saldoSainda={saldo.saidas}
              />
            ) : null}
          </div>

          <Lancamentos
            lancamentos={lancamentos}
            onAdicionarLancamento={adicionarLancamento}
          />
        </div>
      </div>
    </div>
  );
}
