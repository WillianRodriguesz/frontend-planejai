import { Wallet } from "lucide-react";
import Card from "../moleculas/Card";

const Carteira = () => {
  return (
    <Card
      titulo="Carteira"
      valor="R$ 1.000,00"
      descricao="Saldo disponível"
      icon={
        <Wallet className="w-5 h-5 text-[#00D9FF] drop-shadow-[0_0_6px_#00D9FF]" />
      }
    />
  );
};

export default Carteira;
