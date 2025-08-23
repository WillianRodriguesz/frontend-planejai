import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";

export default function Home() {
  const headerHeight = "h-[100px]"; // altura do header

  return (
    <div className="bg-background min-h-screen flex flex-col">
      {/* Header */}
      <Header />
      <div className={headerHeight}></div>

      {/* Conteúdo principal */}
      <main className="flex-1 px-4 md:px-8">
        {/* Selecionador de mês */}
        <MenuSelecionadorMes
          onChange={(mes) => console.log(mes)}
        />

        {/* Card */}
        <div className="w-full mt-6">
          <CardSaldo
            dataMes="Março"
            dataAno="2023"
            saldo={5000.0}
            saldoEntrada={1000.0}
            saldoSainda={2300.0}
          />
        </div>
      </main>
    </div>
  );
}
