import { Settings } from "lucide-react";
import { formataValorBRL } from "../../utils/formataValorBrl";
import { motion, AnimatePresence } from "framer-motion";

interface CardProps {
  saldo: number;
  saldoEntrada: number;
  saldoSainda: number;
  dataMes: string;
  dataAno: string;
}

const CardSaldo = ({
  saldo,
  saldoEntrada,
  saldoSainda,
  dataMes,
  dataAno,
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
      className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-4 relative overflow-hidden"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      {/* Efeito de reflexo */}
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-50 pointer-events-none"
        animate={{
          x: ["0%", "200%"],
        }}
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
          <AnimatePresence mode="wait">
            <motion.span
              key={dataMes}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="text-white text-lg font-semibold"
            >
              {dataMes}
            </motion.span>
          </AnimatePresence>
          <span className="text-gray-400 text-sm">/</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={dataAno}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
              className="text-gray-400 text-sm"
            >
              {dataAno}
            </motion.span>
          </AnimatePresence>
        </h2>
        <Settings className="text-gray-400 hover:text-violet-600 cursor-pointer w-5 h-5" />
      </div>

      <div className="text-left mb-6">
        <p className="text-gray-400 text-sm">Orçamento disponível</p>
        <AnimatePresence mode="wait">
          <motion.p
            key={saldo}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 0.4, ease: "anticipate" }}
            className="text-white text-3xl font-bold"
          >
            {formataValorBRL(saldo)}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="flex justify-between">
        <div className="flex flex-col items-start overflow-hidden">
          <span className="text-gray-400 text-sm">Entradas</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={saldoEntrada}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut", delay: 0.2 }}
              className="text-green-500 text-base font-semibold"
            >
              {formataValorBRL(saldoEntrada)}
            </motion.span>
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-end overflow-hidden">
          <span className="text-gray-400 text-sm">Saídas</span>
          <AnimatePresence mode="wait">
            <motion.span
              key={saldoSainda}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: "backOut", delay: 0.2 }}
              className="text-red-500 text-base font-semibold"
            >
              {formataValorBRL(saldoSainda)}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CardSaldo;
