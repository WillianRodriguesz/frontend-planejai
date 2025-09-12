import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface BotaoSalvarProps {
  onClick?: () => void;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
}

const BotaoSalvar = ({
  onClick,
  children = "Salvar",
  disabled = false,
  className = "",
}: BotaoSalvarProps) => {
  return (
    <motion.button
      type="submit"
      onClick={onClick}
      disabled={disabled}
      className={`w-full bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 disabled:from-gray-600 disabled:to-gray-500 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 disabled:shadow-none transition-all duration-200 focus:outline-none disabled:cursor-not-allowed ${className}`}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
    >
      {children}
    </motion.button>
  );
};

export default BotaoSalvar;
