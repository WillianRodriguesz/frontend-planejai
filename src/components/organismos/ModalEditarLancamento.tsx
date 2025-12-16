import { useState, useEffect } from "react";
import { X, Edit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BotaoTipoTransacaoModal from "../atomos/BotaoTipoTransacaoModal";
import TituloModal from "../atomos/TituloModal";
import BotaoSalvar from "../atomos/BotaoSalvar";
import CampoOutlined from "../atomos/CampoOutlined";
import SelectCustomizado from "../atomos/SelectCustomizado";
import { useCategorias } from "../../hooks/useCategorias";

interface Lancamento {
  id: string;
  titulo: string;
  valor: number;
  data: string;
  tipo: "entrada" | "saida";
  idCategoria?: number;
  nomeCategoria?: string;
}

interface ModalEditarLancamentoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lancamento: {
    id: string;
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => void;
  lancamento: Lancamento | null;
}

const ModalEditarLancamento = ({
  isOpen,
  onClose,
  onSave,
  lancamento,
}: ModalEditarLancamentoProps) => {
  const { categorias, loading: loadingCategorias } = useCategorias();
  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState("");
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");

  useEffect(() => {
    if (lancamento && isOpen) {
      setTitulo(lancamento.titulo);
      setCategoria(lancamento.idCategoria?.toString() || "");
      setValor(lancamento.valor.toString());

      const dataFormatada = lancamento.data.split("/").reverse().join("-");
      setData(dataFormatada);

      setTipo(lancamento.tipo);
    }
  }, [lancamento, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !categoria || !valor || !data || !lancamento) {
      return;
    }

    onSave({
      id: lancamento.id,
      titulo,
      categoria,
      valor: parseFloat(valor),
      data,
      tipo,
    });

    onClose();
  };

  if (!lancamento) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[70]"
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-0 items-center justify-center p-4 z-[70] hidden md:flex"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 shadow-xl rounded-2xl p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-6">
                <TituloModal
                  titulo="Editar lançamento"
                  icone={<Edit className="w-5 h-5 text-purple-400" />}
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
                  <CampoOutlined label="Título da transação" size="md">
                    <input
                      type="text"
                      id="titulo"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none"
                      placeholder="Ex: Supermercado"
                      required
                    />
                  </CampoOutlined>

                  <CampoOutlined label="Categoria" size="md">
                    <SelectCustomizado
                      options={categorias.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.nome,
                      }))}
                      value={categoria}
                      onChange={setCategoria}
                      placeholder={
                        loadingCategorias
                          ? "Carregando..."
                          : "Selecione uma categoria"
                      }
                      disabled={loadingCategorias}
                      size="md"
                    />
                  </CampoOutlined>

                  <div className="grid grid-cols-2 gap-4">
                    <CampoOutlined label="Valor" size="md">
                      <input
                        type="number"
                        id="valor"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        placeholder="R$ 0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </CampoOutlined>
                    <CampoOutlined label="Data" size="md">
                      <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        required
                      />
                    </CampoOutlined>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <BotaoTipoTransacaoModal
                        tipo="entrada"
                        isAtivo={tipo === "entrada"}
                        onClick={() => setTipo("entrada")}
                      >
                        Entrada
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="saida"
                        isAtivo={tipo === "saida"}
                        onClick={() => setTipo("saida")}
                      >
                        Saída
                      </BotaoTipoTransacaoModal>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <BotaoSalvar>Salvar alterações</BotaoSalvar>
                </div>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="fixed inset-x-0 bottom-0 z-[70] md:hidden"
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
                    titulo="Editar lançamento"
                    icone={<Edit className="w-5 h-5 text-purple-400" />}
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
                  <CampoOutlined label="Título da transação" size="sm">
                    <input
                      type="text"
                      id="titulo-mobile"
                      value={titulo}
                      onChange={(e) => setTitulo(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none"
                      placeholder="Ex: Supermercado"
                      required
                    />
                  </CampoOutlined>

                  <CampoOutlined label="Categoria" size="sm">
                    <SelectCustomizado
                      options={categorias.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.nome,
                      }))}
                      value={categoria}
                      onChange={setCategoria}
                      placeholder={
                        loadingCategorias
                          ? "Carregando..."
                          : "Selecione uma categoria"
                      }
                      disabled={loadingCategorias}
                      size="sm"
                    />
                  </CampoOutlined>

                  <div className="grid grid-cols-2 gap-3">
                    <CampoOutlined label="Valor" size="sm">
                      <input
                        type="number"
                        id="valor-mobile"
                        value={valor}
                        onChange={(e) => setValor(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        placeholder="R$ 0,00"
                        step="0.01"
                        min="0"
                        required
                      />
                    </CampoOutlined>
                    <CampoOutlined label="Data" size="sm">
                      <input
                        type="date"
                        id="data-mobile"
                        value={data}
                        onChange={(e) => setData(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        required
                      />
                    </CampoOutlined>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Tipo de transação
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <BotaoTipoTransacaoModal
                        tipo="entrada"
                        isAtivo={tipo === "entrada"}
                        onClick={() => setTipo("entrada")}
                      >
                        Entrada
                      </BotaoTipoTransacaoModal>
                      <BotaoTipoTransacaoModal
                        tipo="saida"
                        isAtivo={tipo === "saida"}
                        onClick={() => setTipo("saida")}
                      >
                        Saída
                      </BotaoTipoTransacaoModal>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <BotaoSalvar>Salvar alterações</BotaoSalvar>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalEditarLancamento;
