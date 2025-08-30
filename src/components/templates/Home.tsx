import { useState } from "react";
import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";
import { ShoppingBag, Coffee, Home as HomeIcon } from "lucide-react";
import Lancamentos from "../organismos/Lancamentos";

export default function Home() {
  const [dataSelecionada, setDataSelecionada] = useState({
    mes: new Date().toLocaleString("pt-BR", { month: "long" }),
    ano: new Date().getFullYear(),
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

    // Formatar a data para o padrão brasileiro
    const dataParts = novoLancamento.data.split("-");
    const dataFormatada = `${dataParts[2]}/${dataParts[1]}/${dataParts[0]}`;

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
        <div className="w-full z-10 pt-2 menu-altura-ajustada">
          <MenuSelecionadorMes
            onChange={(data) => setDataSelecionada(data)}
            mesInicial={new Date().getMonth()}
            anoInicial={new Date().getFullYear()}
          />
        </div>
        <div className="w-full mt-6">
          <CardSaldo
            key={`${dataSelecionada.mes}-${dataSelecionada.ano}`}
            dataMes={dataSelecionada.mes}
            dataAno={dataSelecionada.ano.toString()}
            saldo={100}
            saldoEntrada={1000.0}
            saldoSainda={2300.0}
          />
        </div>

        <Lancamentos
          lancamentos={lancamentos}
          onAdicionarLancamento={adicionarLancamento}
        />
      </div>
    </div>
  );
}
