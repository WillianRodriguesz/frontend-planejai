import { useState } from "react";
import { X, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BotaoTipoTransacaoModal from "../atomos/BotaoTipoTransacaoModal";
import TituloModal from "../atomos/TituloModal";
import BotaoSalvar from "../atomos/BotaoSalvar";
import CampoOutlined from "../atomos/CampoOutlined";
import SelectCustomizado from "../atomos/SelectCustomizado";
import { useCategorias } from "../../hooks/useCategorias";

interface FiltroLancamento {
  categoria: string;
  dataInicio: string;
  dataFim: string;
  tipo: "todos" | "entrada" | "saida";
}

interface ModalFiltroLancamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filtros: FiltroLancamento) => void;
  filtrosAtuais?: FiltroLancamento;
}

const ModalFiltroLancamento = ({
  isOpen,
  onClose,
  onApplyFilter,
  filtrosAtuais,
}: ModalFiltroLancamentoProps) => {
  const { categorias, loading: loadingCategorias } = useCategorias();
  const [categoria, setCategoria] = useState(filtrosAtuais?.categoria || "");
  const [dataInicio, setDataInicio] = useState(filtrosAtuais?.dataInicio || "");
  const [dataFim, setDataFim] = useState(filtrosAtuais?.dataFim || "");
  const [tipo, setTipo] = useState<"todos" | "entrada" | "saida">(
    filtrosAtuais?.tipo || "todos"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onApplyFilter({
      categoria,
      dataInicio,
      dataFim,
      tipo,
    });

    onClose();
  };

  const handleLimparFiltros = () => {
    setCategoria("");
    setDataInicio("");
    setDataFim("");
    setTipo("todos");

    onApplyFilter({
      categoria: "",
      dataInicio: "",
      dataFim: "",
      tipo: "todos",
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal para Desktop */}
          <motion.div
            className="fixed inset-0 items-center justify-center p-4 z-50 hidden md:flex"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 shadow-xl rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <TituloModal
                  titulo="Filtrar lançamentos"
                  icone={<Filter className="w-5 h-5 text-purple-400" />}
                />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="space-y-5">
                  <CampoOutlined label="Categoria">
                    <SelectCustomizado
                      options={[
                        { value: "", label: "Todas as categorias" },
                        ...categorias.map((cat) => ({
                          value: cat.id.toString(),
                          label: cat.nome,
                        })),
                      ]}
                      value={categoria}
                      onChange={setCategoria}
                      placeholder={
                        loadingCategorias
                          ? "Carregando..."
                          : "Todas as categorias"
                      }
                      disabled={loadingCategorias}
                      size="md"
                    />
                  </CampoOutlined>

                  <div className="grid grid-cols-2 gap-3">
                    <CampoOutlined label="Data inicial">
                      <input
                        type="date"
                        id="dataInicio"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                      />
                    </CampoOutlined>
                    <CampoOutlined label="Data final">
                      <input
                        type="date"
                        id="dataFim"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                      />
                    </CampoOutlined>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <BotaoTipoTransacaoModal
                        tipo="todos"
                        isAtivo={tipo === "todos"}
                        onClick={() => setTipo("todos")}
                        size="sm"
                      >
                        Todos
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="entrada"
                        isAtivo={tipo === "entrada"}
                        onClick={() => setTipo("entrada")}
                        size="sm"
                      >
                        Entrada
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="saida"
                        isAtivo={tipo === "saida"}
                        onClick={() => setTipo("saida")}
                        size="sm"
                      >
                        Saída
                      </BotaoTipoTransacaoModal>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <button
                    type="button"
                    onClick={handleLimparFiltros}
                    className="bg-card/50 border border-purple-500/30 hover:bg-card/70 text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none"
                  >
                    Limpar
                  </button>
                  <BotaoSalvar>Aplicar</BotaoSalvar>
                </div>
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
                  <TituloModal
                    titulo="Filtrar lançamentos"
                    icone={<Filter className="w-5 h-5 text-purple-400" />}
                  />
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
                  <CampoOutlined label="Categoria" size="sm">
                    <SelectCustomizado
                      options={[
                        { value: "", label: "Todas as categorias" },
                        ...categorias.map((cat) => ({
                          value: cat.id.toString(),
                          label: cat.nome,
                        })),
                      ]}
                      value={categoria}
                      onChange={setCategoria}
                      placeholder={
                        loadingCategorias
                          ? "Carregando..."
                          : "Todas as categorias"
                      }
                      disabled={loadingCategorias}
                      size="sm"
                    />
                  </CampoOutlined>

                  <div className="space-y-3">
                    <CampoOutlined label="Data inicial" size="sm">
                      <input
                        type="date"
                        id="dataInicio-mobile"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                      />
                    </CampoOutlined>
                    <CampoOutlined label="Data final" size="sm">
                      <input
                        type="date"
                        id="dataFim-mobile"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                      />
                    </CampoOutlined>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <BotaoTipoTransacaoModal
                        tipo="todos"
                        isAtivo={tipo === "todos"}
                        onClick={() => setTipo("todos")}
                        size="sm"
                      >
                        Todos
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="entrada"
                        isAtivo={tipo === "entrada"}
                        onClick={() => setTipo("entrada")}
                        size="sm"
                      >
                        Entrada
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="saida"
                        isAtivo={tipo === "saida"}
                        onClick={() => setTipo("saida")}
                        size="sm"
                      >
                        Saída
                      </BotaoTipoTransacaoModal>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={handleLimparFiltros}
                    className="bg-card/50 border-solid border-purple-500/30 hover:bg-card/70 text-gray-300 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none"
                  >
                    Limpar
                  </button>
                  <BotaoSalvar>Aplicar</BotaoSalvar>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalFiltroLancamento;
