import { TrendingUp } from "@mui/icons-material";

interface CardSaldoProps {
  titulo: string;
  saldo: string;
  descricao: string;
  type?: "recebido" | "gasto" | "disponivel";
}

const CardSaldo = ({
  titulo,
  saldo,
  descricao,
  type = "disponivel",
}: CardSaldoProps) => {
  const colors = {
    recebido: {
      text: "text-success",
      gradientFrom: "from-success",
      gradientTo: "to-success",
      iconColor: "text-success",
    },
    gasto: {
      text: "text-danger",
      gradientFrom: "from-secondary",
      gradientTo: "to-danger",
      iconColor: "text-danger",
    },
    disponivel: {
      text: "text-success", 
      gradientFrom: "from-primary",
      gradientTo: "to-success",
      iconColor: "text-success",
    },
  };

  const color = colors[type];

  return (
    <div className="rounded-2xl mb-5 bg-cardBg from-card/80 to-card/40 border-2 border-white/10 shadow-xl p-4">
      <header className="pb-3">
        <h3 className="text-sm font-medium text-gray-400">{titulo}</h3>
      </header>

      <section>
        <p
          className={`text-3xl font-bold bg-clip-text text-transparent break-words bg-gradient-to-r ${color.gradientFrom} ${color.gradientTo}`}
        >
          {saldo}
        </p>
        <div
          className={`flex justify-center items-center gap-1 text-sm mt-2 ${color.text}`}
        >
          <TrendingUp className={`h-4 w-4 ${color.iconColor}`} />
          <span>{descricao}</span>
        </div>
      </section>
    </div>
  );
};

export default CardSaldo;
