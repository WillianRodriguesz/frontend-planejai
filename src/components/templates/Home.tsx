import { TrendingDown, TrendingUp, Wallet2Icon } from "lucide-react";
import Card from "../moleculas/Card";
import Header from "../organismos/Header";

export default function Home() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <main className="pt-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          <Card
            icon={<TrendingUp className="h-8 w-8" />}
            corIcone="text-green-500"
            titulo="Entrada"
            valor="R$ 500,00"
            descricao="Entradas do mês atual"
          />
          <Card
            icon={<Wallet2Icon className="h-8 w-8" />}
            corIcone="text-white"
            titulo="Carteira"
            valor="R$ 500,00"
            descricao="Saldo atual da conta"
          />
           <Card
            icon={<TrendingDown className="h-8 w-8" />}
            corIcone="text-red-500"
            titulo="Saída"
            valor="R$ 500,00"
            descricao="Gastos do mês atual"
          />
        </div>
      </main>
    </div>
  );
}
