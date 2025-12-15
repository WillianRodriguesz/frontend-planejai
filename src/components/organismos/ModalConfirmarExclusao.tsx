import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, AlertTriangle } from "lucide-react";

interface ModalConfirmarExclusaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
}

const ModalConfirmarExclusao = ({
  isOpen,
  onClose,
  onConfirm,
  titulo,
}: ModalConfirmarExclusaoProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 items-center justify-center p-4 z-[60] hidden md:flex"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-red-500/30 shadow-xl rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Confirmar exclusão
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-gray-300 text-base">
                  Tem certeza que deseja excluir o lançamento
                  <span className="font-semibold text-white"> "{titulo}"</span>?
                </p>
                <p className="text-gray-400 text-sm">
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={onClose}
                  className="bg-gray-500/20 border border-gray-500/30 hover:bg-gray-500/30 text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[60] md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-b from-card/90 to-card/80 backdrop-blur-xl border-t border-red-500/30 shadow-xl rounded-t-2xl p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-10 h-1 bg-gray-500/30 rounded-full mb-4"></div>
                <div className="flex items-center gap-3 w-full">
                  <div className="p-2 bg-red-500/20 rounded-xl">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </div>
                  <h2 className="text-lg font-semibold text-white">
                    Confirmar exclusão
                  </h2>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-300 text-base">
                  Tem certeza que deseja excluir o lançamento
                  <span className="font-semibold text-white"> "{titulo}"</span>?
                </p>
                <p className="text-gray-400 text-sm">
                  Esta ação não pode ser desfeita.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="bg-gray-500/20 border border-gray-500/30 hover:bg-gray-500/30 text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalConfirmarExclusao;
