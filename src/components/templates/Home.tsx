import Header from "../organismos/Header";
import CardSaldo from "../moleculas/CardSaldo";

export default function Home() {
  return (
    <div className="bg-background min-h-screen">
      <Header />
      <main className="pt-20 w-full">
        <CardSaldo
          dataMes="Março"
          dataAno="2023"
          saldo={5000.0}
          saldoEntrada={1000.0}
          saldoSainda={2300.0}
        />
      </main>
    </div>
  );
}
