import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Trash2, Calendar, DollarSign, Tag } from "lucide-react";
import { useState } from "react";
import TituloModal from "../atomos/TituloModal";
import CampoOutlined from "../atomos/CampoOutlined";
import { formataValorBRL } from "../../utils/formataValorBrl";
import ModalConfirmarExclusao from "./ModalConfirmarExclusao";

interface Lancamento {
  id: string;
  icone: any;
  titulo: string;
  data: string;
  valor: number;
  tipo: "entrada" | "saida";
  categoria?: string;
}

interface ModalDetalhesLancamentoProps {
  isOpen: boolean;
  onClose: () => void;
  lancamento: Lancamento | null;
  onEdit?: () => void;
  onDelete?: (idLancamento: string) => void;
}

const ModalDetalhesLancamento = ({
  isOpen,
  onClose,
  lancamento,
  onEdit,
  onDelete,
}: ModalDetalhesLancamentoProps) => {
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!lancamento) return null;

  const handleEdit = () => {
    if (onEdit) {
      onEdit();
    }
    onClose();
  };

  const handleDeleteClick = () => {
    setIsConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (onDelete) {
      onDelete(lancamento.id);
    }
    setIsConfirmDeleteOpen(false);
    onClose();
  };

  const getTipoCor = (tipo: "entrada" | "saida") => {
    return tipo === "entrada"
      ? "text-green-400 bg-green-500/20"
      : "text-red-400 bg-red-500/20";
  };

  const getCategoriaNome = (categoria?: string) => {
    const categorias: { [key: string]: string } = {
      alimentacao: "Alimentação",
      transporte: "Transporte",
      lazer: "Lazer",
      moradia: "Moradia",
      saude: "Saúde",
      educacao: "Educação",
      outros: "Outros",
    };
    return categoria ? categorias[categoria] || categoria : "Não especificada";
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
                  titulo="Detalhes do lançamento"
                  icone={
                    <lancamento.icone className="w-5 h-5 text-purple-400" />
                  }
                />
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    {lancamento.titulo}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getTipoCor(
                      lancamento.tipo
                    )}`}
                  >
                    {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                  </span>
                </div>

                {/* Valor */}
                <CampoOutlined label="Valor">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <DollarSign className="w-5 h-5 text-purple-400" />
                    </div>
                    <p
                      className={`text-xl font-semibold ${
                        lancamento.tipo === "entrada"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {lancamento.tipo === "entrada" ? "+" : "-"}
                      {formataValorBRL(lancamento.valor)}
                    </p>
                  </div>
                </CampoOutlined>

                {/* Data */}
                <CampoOutlined label="Data">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Calendar className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-lg font-medium text-white">
                      {lancamento.data}
                    </p>
                  </div>
                </CampoOutlined>

                {/* Categoria */}
                <CampoOutlined label="Categoria">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Tag className="w-5 h-5 text-purple-400" />
                    </div>
                    <p className="text-lg font-medium text-white">
                      {getCategoriaNome(lancamento.categoria)}
                    </p>
                  </div>
                </CampoOutlined>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-3 mt-8">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>

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
                    titulo="Detalhes do lançamento"
                    icone={
                      <lancamento.icone className="w-5 h-5 text-purple-400" />
                    }
                  />
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white p-1 rounded-full transition-colors focus:outline-none"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {/* Título e Tipo */}
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">
                    {lancamento.titulo}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoCor(
                      lancamento.tipo
                    )}`}
                  >
                    {lancamento.tipo === "entrada" ? "Entrada" : "Saída"}
                  </span>
                </div>

                {/* Valor */}
                <CampoOutlined label="Valor" size="sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <DollarSign className="w-4 h-4 text-purple-400" />
                    </div>
                    <p
                      className={`text-lg font-semibold ${
                        lancamento.tipo === "entrada"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {lancamento.tipo === "entrada" ? "+" : "-"}
                      {formataValorBRL(lancamento.valor)}
                    </p>
                  </div>
                </CampoOutlined>

                {/* Data */}
                <CampoOutlined label="Data" size="sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Calendar className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-base font-medium text-white">
                      {lancamento.data}
                    </p>
                  </div>
                </CampoOutlined>

                {/* Categoria */}
                <CampoOutlined label="Categoria" size="sm">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/20 rounded-xl">
                      <Tag className="w-4 h-4 text-purple-400" />
                    </div>
                    <p className="text-base font-medium text-white">
                      {getCategoriaNome(lancamento.categoria)}
                    </p>
                  </div>
                </CampoOutlined>
              </div>

              {/* Botões de Ação */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={handleEdit}
                  className="bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/30 text-blue-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Editar
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium py-3 px-4 rounded-xl transition-colors focus:outline-none flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>
            </div>
          </motion.div>

          <ModalConfirmarExclusao
            isOpen={isConfirmDeleteOpen}
            onClose={() => setIsConfirmDeleteOpen(false)}
            onConfirm={handleConfirmDelete}
            titulo={lancamento.titulo}
          />
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalDetalhesLancamento;
