import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { avatares } from "../../utils/avatares";

interface ModalSelecionarAvatarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatar: string) => void;
  avatarAtual?: string;
}

const ModalSelecionarAvatar = ({
  isOpen,
  onClose,
  onSelect,
  avatarAtual,
}: ModalSelecionarAvatarProps) => {
  const handleSelect = (avatar: string) => {
    onSelect(avatar);
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
            className="fixed inset-0 items-center justify-center p-4 z-[60] flex"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 shadow-xl rounded-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Escolha seu avatar
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {avatares.map((avatar, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(avatar)}
                    className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${
                      avatarAtual === avatar
                        ? "bg-purple-500/30 border-2 border-purple-500 scale-110"
                        : "bg-card/50 border border-purple-500/20 hover:bg-purple-500/20"
                    }`}
                  >
                    <span style={{ fontSize: "3rem", lineHeight: 1 }}>
                      {avatar}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalSelecionarAvatar;
