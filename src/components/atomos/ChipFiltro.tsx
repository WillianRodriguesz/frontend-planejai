import { motion } from "framer-motion";
import { X } from "lucide-react";

interface ChipFiltroProps {
  valor: string;
  onRemover: () => void;
}

const ChipFiltro = ({ valor, onRemover }: ChipFiltroProps) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="inline-flex items-center gap-2 bg-purple-600/20 border border-purple-500/30 rounded-full px-4 py-1.5"
    >
      <span className="text-purple-400 text-xs font-medium">{valor}</span>
      <button
        onClick={onRemover}
        className="text-purple-400 hover:text-white transition-colors"
        aria-label="Remover filtro"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
};

export default ChipFiltro;
