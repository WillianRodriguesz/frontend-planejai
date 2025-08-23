import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";

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
      </div>
    </div>
  );
}
