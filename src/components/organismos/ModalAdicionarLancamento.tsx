import { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BotaoTipoTransacaoModal from "../atomos/BotaoTipoTransacaoModal";
import TituloModal from "../atomos/TituloModal";
import BotaoSalvar from "../atomos/BotaoSalvar";
import CampoOutlined from "../atomos/CampoOutlined";
import SelectCustomizado from "../atomos/SelectCustomizado";
import Toast from "../atomos/Toast";
import { useCategorias } from "../../hooks/useCategorias";
import { useToast } from "../../hooks/useToast";
import { obterIconeCategoria } from "../../utils/categoriaIcones";

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
  const { categorias, loading: loadingCategorias } = useCategorias();
  const { toasts, warning, hideToast } = useToast();

  const getDataHoje = () => {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    return `${ano}-${mes}-${dia}`;
  };

  const [titulo, setTitulo] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valor, setValor] = useState("");
  const [data, setData] = useState(getDataHoje());
  const [tipo, setTipo] = useState<"entrada" | "saida">("saida");
  const [tituloFocused, setTituloFocused] = useState(false);
  const [valorFocused, setValorFocused] = useState(false);

  // Bloqueia scroll da página quando modal está aberto (mobile)
  useEffect(() => {
    if (isOpen) {
      // Salva a posição atual do scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaura a posição do scroll ao fechar
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup ao desmontar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  // Bloqueia scroll da página quando modal está aberto (mobile)
  useEffect(() => {
    if (isOpen) {
      // Salva a posição atual do scroll
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
    } else {
      // Restaura a posição do scroll ao fechar
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    return () => {
      // Cleanup ao desmontar
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo || !categoria || !valor || !data) {
      warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    onSave({
      titulo,
      categoria,
      valor: parseFloat(valor),
      data,
      tipo,
    });

    setTitulo("");
    setCategoria("");
    setValor("");
    setData(getDataHoje());
    setTipo("saida");

    onClose();
  };

  return (
    <AnimatePresence>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
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
                <TituloModal
                  titulo="Novo lançamento"
                  icone={<Plus className="w-5 h-5 text-purple-400" />}
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
                      onFocus={() => setTituloFocused(true)}
                      onBlur={() => setTituloFocused(false)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none"
                      placeholder={!tituloFocused ? "Ex: Supermercado" : ""}
                      required
                    />
                  </CampoOutlined>

                  <CampoOutlined label="Categoria" size="md">
                    <SelectCustomizado
                      options={categorias.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.nome,
                        icon: obterIconeCategoria(cat.nome),
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
                        onFocus={() => setValorFocused(true)}
                        onBlur={() => setValorFocused(false)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        placeholder={!valorFocused ? "R$ 0,00" : ""}
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
                  <BotaoSalvar>Salvar</BotaoSalvar>
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
            <div className="bg-gradient-to-b from-card/90 to-card/80 backdrop-blur-xl border-t border-purple-500/30 shadow-xl rounded-t-2xl p-6 pb-24">
              <div className="flex flex-col items-center mb-4">
                <div className="w-10 h-1 bg-gray-500/30 rounded-full mb-4"></div>
                <div className="flex items-center justify-between w-full">
                  <TituloModal
                    titulo="Novo lançamento"
                    icone={<Plus className="w-5 h-5 text-purple-400" />}
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
                      onFocus={() => setTituloFocused(true)}
                      onBlur={() => setTituloFocused(false)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none"
                      placeholder={!tituloFocused ? "Ex: Supermercado" : ""}
                      required
                    />
                  </CampoOutlined>

                  <CampoOutlined label="Categoria" size="sm">
                    <SelectCustomizado
                      options={categorias.map((cat) => ({
                        value: cat.id.toString(),
                        label: cat.nome,
                        icon: obterIconeCategoria(cat.nome),
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
                        onFocus={() => setValorFocused(true)}
                        onBlur={() => setValorFocused(false)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none"
                        placeholder={!valorFocused ? "R$ 0,00" : ""}
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
                  <BotaoSalvar>Salvar</BotaoSalvar>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalAdicionarLancamento;
