import { useState, useRef, useEffect } from "react";
import { Filter, Plus, Loader2 } from "lucide-react";
import CardLancamento from "../moleculas/CardLancamento";
import ModalAdicionarLancamento from "./ModalAdicionarLancamento";
import ModalEditarLancamento from "./ModalEditarLancamento";
import ModalFiltroLancamento from "./ModalFiltroLancamento";
import ModalDetalhesLancamento from "./ModalDetalhesLancamento";
import { obterIconeCategoria } from "../../utils/categoriaIcones";

interface LancamentosProps {
  lancamentos?: Array<{
    id: string;
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
    idCategoria?: number;
    nomeCategoria?: string;
  }>;
  onAdicionarLancamento?: (novoLancamento: {
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => void;
  onAtualizarLancamento?: (lancamento: {
    id: string;
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => void;
  onDeletarLancamento?: (idLancamento: string) => void;
  onCarregarMais?: () => void;
  loading?: boolean;
  hasMore?: boolean;
  itensPorPagina?: number;
}

const Lancamentos = ({
  lancamentos = [],
  onAdicionarLancamento,
  onAtualizarLancamento,
  onDeletarLancamento,
  onCarregarMais,
  loading = false,
  hasMore = true,
  itensPorPagina = 10,
}: LancamentosProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalFiltroOpen, setIsModalFiltroOpen] = useState(false);
  const [isModalDetalhesOpen, setIsModalDetalhesOpen] = useState(false);
  const [lancamentoSelecionado, setLancamentoSelecionado] = useState<{
    id: string;
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
    idCategoria?: number;
    nomeCategoria?: string;
  } | null>(null);
  const [filtrosAtuais, setFiltrosAtuais] = useState<{
    categoria: string;
    dataInicio: string;
    dataFim: string;
    tipo: "todos" | "entrada" | "saida";
  }>({
    categoria: "",
    dataInicio: "",
    dataFim: "",
    tipo: "todos",
  });

  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          onCarregarMais
        ) {
          onCarregarMais();
        }
      },
      { threshold: 0.1 }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loading, hasMore, onCarregarMais]);

  const abrirModalDetalhes = (lancamento: {
    id: string;
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
    idCategoria?: number;
    nomeCategoria?: string;
  }) => {
    setLancamentoSelecionado(lancamento);
    setIsModalDetalhesOpen(true);
  };

  const isLoadingInitial = loading && lancamentos.length === 0;

  return (
    <div className="w-full pt-3">
      <div className="flex items-center justify-between pb-3">
        <h2 className="text-gray-300 text-lg font-semibold">
          Últimos lançamentos
        </h2>
        <div className="flex items-center gap-3">
          <button
            aria-label="Filtrar lançamentos"
            onClick={() => setIsModalFiltroOpen(true)}
            className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 w-10 flex items-center justify-center"
          >
            <Filter className="h-5 w-5" />
          </button>
          <button
            aria-label="Adicionar lançamento"
            onClick={() => setIsModalOpen(true)}
            className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 w-10 flex items-center justify-center"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl">
        {isLoadingInitial ? (
          Array.from({ length: itensPorPagina }).map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border-b border-purple-500/20 last:border-b-0 animate-pulse"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-gray-700/50"></div>
                <div className="flex flex-col gap-2 flex-1">
                  <div className="h-4 w-32 bg-gray-700/50 rounded"></div>
                  <div className="h-3 w-24 bg-gray-700/50 rounded"></div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-4 w-20 bg-gray-700/50 rounded"></div>
              </div>
            </div>
          ))
        ) : lancamentos.length > 0 ? (
          lancamentos.map((lancamento) => {
            const IconeCategoria = obterIconeCategoria(
              lancamento.nomeCategoria
            );
            return (
              <CardLancamento
                key={lancamento.id}
                icone={IconeCategoria}
                titulo={lancamento.titulo}
                data={lancamento.data}
                valor={lancamento.valor}
                tipo={lancamento.tipo}
                nomeCategoria={lancamento.nomeCategoria}
                onClick={() => abrirModalDetalhes(lancamento)}
              />
            );
          })
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">
              Nenhum lançamento encontrado
            </p>
          </div>
        )}
      </div>

      {loading && lancamentos.length > 0 && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
          <span className="ml-2 text-gray-400 text-sm">Carregando mais...</span>
        </div>
      )}

      <div ref={observerTarget} className="h-4" />

      <div className="h-8 md:h-12"></div>

      <ModalAdicionarLancamento
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={(novoLancamento) => {
          if (onAdicionarLancamento) {
            onAdicionarLancamento(novoLancamento);
          }
          setIsModalOpen(false);
        }}
      />

      <ModalFiltroLancamento
        isOpen={isModalFiltroOpen}
        onClose={() => setIsModalFiltroOpen(false)}
        onApplyFilter={(novosFiltros) => {
          setFiltrosAtuais(novosFiltros);
        }}
        filtrosAtuais={filtrosAtuais}
      />

      <ModalDetalhesLancamento
        isOpen={isModalDetalhesOpen}
        onClose={() => setIsModalDetalhesOpen(false)}
        lancamento={lancamentoSelecionado}
        onEdit={() => {
          setIsModalDetalhesOpen(false);
          setIsModalEditOpen(true);
        }}
        onDelete={onDeletarLancamento}
      />

      <ModalEditarLancamento
        isOpen={isModalEditOpen}
        onClose={() => setIsModalEditOpen(false)}
        lancamento={lancamentoSelecionado}
        onSave={(lancamentoAtualizado) => {
          if (onAtualizarLancamento) {
            onAtualizarLancamento(lancamentoAtualizado);
          }
          setIsModalEditOpen(false);
        }}
      />
    </div>
  );
};

export default Lancamentos;
