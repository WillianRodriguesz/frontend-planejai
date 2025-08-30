import { useState } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ModalAdicionarLancamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (novoLancamento: {
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => void;
}

const ModalAdicionarLancamento = ({
  isOpen,
  onClose,
  onSave,
}: ModalAdicionarLancamentoProps) => {
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(new Date().toISOString().substring(0, 10));
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !categoria || !valor || !data) {
      return;
    }

    onSave({
      titulo,
      categoria,
      valor: parseFloat(valor),
      data,
      tipo,
    });

    // Resetar o formulário
    setTitulo("");
    setCategoria("");
    setValor("");
    setData(new Date().toISOString().substring(0, 10));
    setTipo("saida");

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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 items-center justify-center p-4 z-50 hidden md:flex"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 shadow-xl rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-purple-400" />
                  <h2 className="text-white text-xl font-semibold">
                    Novo lançamento
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <div>
                    <label
                      htmlFor="titulo"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Título da transação
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Ex: Supermercado"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="categoria"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Categoria
                    </label>
                    <select
                      id="categoria"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    >
                      <option value="" disabled>
                        Selecione uma categoria
                      </option>
                      <option value="alimentacao">Alimentação</option>
                      <option value="transporte">Transporte</option>
                      <option value="lazer">Lazer</option>
                      <option value="moradia">Moradia</option>
                      <option value="saude">Saúde</option>
                      <option value="educacao">Educação</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="valor"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Valor
                      </label>
                      <input
                        type="number"
                        id="valor"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="R$ 0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="data"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Data
                      </label>
                      <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTipo("entrada")}
                        className={`p-3 rounded-xl border ${
                          tipo === "entrada"
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-card/30 border-purple-500/30 text-gray-400"
                        } font-medium transition-colors focus:outline-none`}
                      >
                        Entrada
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipo("saida")}
                        className={`p-3 rounded-xl border ${
                          tipo === "saida"
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-card/30 border-purple-500/30 text-gray-400"
                        } font-medium transition-colors focus:outline-none`}
                      >
                        Saída
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-8 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 transition-colors focus:outline-none"
                >
                  Salvar
                </button>
              </form>
            </div>
          </motion.div>

          {/* Bottom Sheet para Mobile */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 md:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-b from-card/90 to-card/80 backdrop-blur-xl border-t border-purple-500/30 shadow-xl rounded-t-2xl p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-10 h-1 bg-gray-500/30 rounded-full mb-4"></div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-purple-400" />
                    <h2 className="text-white text-xl font-semibold">
                      Novo lançamento
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-4">
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="titulo-mobile"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Título da transação
                    </label>
                    <input
                      type="text"
                      id="titulo-mobile"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      placeholder="Ex: Supermercado"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="categoria-mobile"
                      className="block text-gray-300 text-sm font-medium mb-2"
                    >
                      Categoria
                    </label>
                    <select
                      id="categoria-mobile"
                      value={categoria}
                      onChange={(e) => setCategoria(e.target.value)}
                      className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      required
                    >
                      <option value="" disabled>
                        Selecione uma categoria
                      </option>
                      <option value="alimentacao">Alimentação</option>
                      <option value="transporte">Transporte</option>
                      <option value="lazer">Lazer</option>
                      <option value="moradia">Moradia</option>
                      <option value="saude">Saúde</option>
                      <option value="educacao">Educação</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label
                        htmlFor="valor-mobile"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Valor
                      </label>
                      <input
                        type="number"
                        id="valor-mobile"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="R$ 0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="data-mobile"
                        className="block text-gray-300 text-sm font-medium mb-2"
                      >
                        Data
                      </label>
                      <input
                        type="date"
                        id="data-mobile"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full bg-card/50 border border-purple-500/30 rounded-xl p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setTipo("entrada")}
                        className={`p-3 rounded-xl border ${
                          tipo === "entrada"
                            ? "bg-green-500/20 border-green-500 text-green-400"
                            : "bg-card/30 border-purple-500/30 text-gray-400"
                        } font-medium transition-colors focus:outline-none`}
                      >
                        Entrada
                      </button>
                      <button
                        type="button"
                        onClick={() => setTipo("saida")}
                        className={`p-3 rounded-xl border ${
                          tipo === "saida"
                            ? "bg-red-500/20 border-red-500 text-red-400"
                            : "bg-card/30 border-purple-500/30 text-gray-400"
                        } font-medium transition-colors focus:outline-none`}
                      >
                        Saída
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-violet-500 hover:from-purple-700 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl shadow-lg shadow-purple-600/30 transition-colors focus:outline-none"
                >
                  Salvar
                </button>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalAdicionarLancamento;
