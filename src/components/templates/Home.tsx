import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";
import { ShoppingBag, Coffee, Home as HomeIcon } from "lucide-react";
import CardLancamento from "../moleculas/CardLancamento";

export default function Home() {
  const headerHeight = "h-[100px]";

  return (
    <div className="bg-background min-h-screen w-full h-full flex flex-col overflow-x-hidden">
      <Header />
      <div className={headerHeight}></div>

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center">
        <MenuSelecionadorMes onChange={(mes) => console.log(mes)} />
        <div className="w-full mt-6">
          <CardSaldo
            dataMes="Março"
            dataAno="2023"
            saldo={5000.0}
            saldoEntrada={1000.0}
            saldoSainda={2300.0}
          />
        </div>

        <div className="w-full mt-6 ">
          <h2 className="text-gray-300 text-lg font-semibold mb-3">
            Últimos lançamentos
          </h2>
          <CardLancamento
            icone={ShoppingBag}
            titulo="Supermercado"
            data="24/08/2025"
            valor={280.5}
            tipo="saida"
          />
          <CardLancamento
            icone={Coffee}
            titulo="Cafeteria"
            data="22/08/2025"
            valor={42.9}
            tipo="saida"
          />
          <CardLancamento
            icone={HomeIcon}
            titulo="Aluguel recebido"
            data="20/08/2025"
            valor={1500.0}
            tipo="entrada"
          />
        </div>
      </div>
    </div>
  );
}
