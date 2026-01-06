import { ChevronRight } from "lucide-react";
import { formataValorBRL } from "../../utils/formataValorBrl";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
  saldo: number;
  saldoEntrada: number;
  saldoSainda: number;
  dataMes: string;
  dataAno: string;
  onDefinirOrcamento?: () => void;
  onVerDetalhes?: () => void;
}

// Componente para animação de texto
const AnimatedText = ({
  children,
  keyValue,
  className = "",
  direction = "y",
  delay = 0,
}: {
  children: React.ReactNode;
  keyValue: any;
  className?: string;
  direction?: "x" | "y";
  delay?: number;
}) => {
  const isXDirection = direction === "x";
  const initialX = isXDirection
    ? className.includes("items-end")
      ? 20
      : -20
    : 0;
  const exitX = isXDirection ? (className.includes("items-end") ? -20 : 20) : 0;

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={keyValue}
        initial={{
          x: initialX,
          y: isXDirection ? 0 : 20,
          opacity: 0,
        }}
        animate={{ x: 0, y: 0, opacity: 1 }}
        exit={{
          x: exitX,
          y: isXDirection ? 0 : -20,
          opacity: 0,
        }}
        transition={{
          duration: 0.3,
          ease: isXDirection ? "backOut" : "easeOut",
          delay,
        }}
        className={className}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
};

// Componente para seção de valor (entrada/saída)
const ValueSection = ({
  label,
  value,
  isEnd = false,
}: {
  label: string;
  value: number;
  isEnd?: boolean;
}) => {
  const getColorClass = () => {
    if (value === 0) return "text-gray-500";
    return label === "Entradas" ? "text-green-500" : "text-red-500";
  };

  return (
    <div
      className={`flex flex-col overflow-hidden ${
        isEnd ? "items-end" : "items-start"
      }`}
    >
      <span className="text-gray-400 text-sm">{label}</span>
      <AnimatedText
        keyValue={value}
        direction="x"
        delay={0.2}
        className={`text-base font-semibold ${getColorClass()}`}
      >
        {formataValorBRL(value)}
      </AnimatedText>
    </div>
  );
};

const CardSaldo = ({
  saldo,
  saldoEntrada,
  saldoSainda,
  dataMes,
  dataAno,
  onVerDetalhes,
}: CardProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        layout: { duration: 0.3, type: "spring" },
        opacity: { duration: 0.3 },
      }}
      className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6 relative overflow-hidden h-[280px] flex flex-col justify-between"
    >
      {/* Efeito de brilho */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none"
        animate={{ x: ["0%", "200%"] }}
        transition={{
          duration: 1.5,
          ease: "easeInOut",
          delay: 0.2,
          repeat: 0,
          repeatType: "mirror",
        }}
        key={`${dataMes}-${dataAno}`}
      />

      <div className="flex items-center justify-between mb-6">
        <h2 className="flex items-baseline gap-1 overflow-hidden">
          <AnimatedText
            keyValue={dataMes}
            className="text-white text-lg font-semibold"
          >
            {dataMes}
          </AnimatedText>
          <span className="text-gray-400 text-sm">/</span>
          <AnimatedText
            keyValue={dataAno}
            delay={0.1}
            className="text-gray-400 text-sm"
          >
            {dataAno}
          </AnimatedText>
        </h2>
        {onVerDetalhes && (
          <button
            onClick={onVerDetalhes}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-xs group"
          >
            <span className="hidden sm:inline">Ver detalhes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <div className="text-left flex-1 flex flex-col justify-center">
        <p className="text-gray-400 text-sm mb-2">Saldo do mês</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={saldo}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className={`text-3xl font-bold ${
              saldo < 0 ? "text-red-500" : "text-white"
            }`}
          >
            {formataValorBRL(saldo)}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <ValueSection label="Entradas" value={saldoEntrada} />
        <ValueSection label="Saídas" value={saldoSainda} isEnd />
      </div>
    </motion.div>
  );
};

export default CardSaldo;
