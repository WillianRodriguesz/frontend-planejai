import { motion } from "framer-motion";

interface BotaoTipoTransacaoModalProps {
  tipo: "entrada" | "saida" | "todos";
  isAtivo: boolean;
  onClick: () => void;
  children: React.ReactNode;
  size?: "sm" | "md";
}

const BotaoTipoTransacaoModal = ({
  tipo,
  isAtivo,
  onClick,
  children,
  size = "md",
}: BotaoTipoTransacaoModalProps) => {
  const getCores = () => {
    if (!isAtivo) {
      return "bg-card/30 border-solid border-purple-500/30 text-gray-400";
    }

    switch (tipo) {
      case "entrada":
        return "bg-green-500/20 text-green-400";
      case "saida":
        return "bg-red-500/20 text-red-400";
      case "todos":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-card/30 border border-gray-400 text-gray-400";
    }
  };

  const sizeClasses = size === "sm" ? "text-sm" : "text-base";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`p-3 rounded-xl border ${getCores()} ${sizeClasses} font-medium transition-colors focus:outline-none`}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
    >
      {children}
    </motion.button>
  );
};

export default BotaoTipoTransacaoModal;
