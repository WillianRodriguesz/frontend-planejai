import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";

export default function Home() {
  const headerHeight = "h-[100px]";
  return (
    <div className="bg-background min-h-screen flex-none">
      <Header />
      <div className={headerHeight}></div>
      <main className="flex-1">
        <div className="w-full">
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