import { useState, useRef, useEffect } from "react";
import { Filter, Plus, ShoppingBag, Loader2 } from "lucide-react";
import CardLancamento from "../moleculas/CardLancamento";
import ModalAdicionarLancamento from "./ModalAdicionarLancamento";
import ModalEditarLancamento from "./ModalEditarLancamento";
import ModalFiltroLancamento from "./ModalFiltroLancamento";
import ModalDetalhesLancamento from "./ModalDetalhesLancamento";

interface LancamentosProps {
  lancamentos?: Array<{
    id: string;
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
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
}

const Lancamentos = ({
  lancamentos = [],
  onAdicionarLancamento,
  onAtualizarLancamento,
  onDeletarLancamento,
  onCarregarMais,
  loading = false,
  hasMore = true,
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
    categoria?: string;
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

  // Ref para o observador de scroll infinito
  const observerTarget = useRef<HTMLDivElement>(null);

  // Implementa scroll infinito
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Quando o elemento observado está visível, não está carregando e ainda há mais dados
        if (
          entries[0].isIntersecting &&
          !loading &&
          hasMore &&
          onCarregarMais
        ) {
          onCarregarMais();
        }
      },
      { threshold: 0.1 } // Dispara quando 10% do elemento está visível
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
    categoria?: string;
  }) => {
    setLancamentoSelecionado(lancamento);
    setIsModalDetalhesOpen(true);
  };

  const lancamentosParaExibir: Array<{
    id: string;
    icone: any;
    titulo: string;
    data: string;
    valor: number;
    tipo: "entrada" | "saida";
  }> =
    lancamentos.length > 0
      ? lancamentos
      : [
          {
            id: "demo-1",
            icone: ShoppingBag,
            titulo: "Supermercado",
            data: "24/08/2025",
            valor: 280.5,
            tipo: "saida" as const,
          },
        ];

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
        {lancamentosParaExibir.map((lancamento) => (
          <CardLancamento
            key={lancamento.id}
            icone={lancamento.icone}
            titulo={lancamento.titulo}
            data={lancamento.data}
            valor={lancamento.valor}
            tipo={lancamento.tipo}
            onClick={() => abrirModalDetalhes(lancamento)}
          />
        ))}
      </div>

      {/* Indicador de carregamento lazy loading */}
      {loading && (
        <div className="flex justify-center items-center py-6">
          <Loader2 className="h-6 w-6 text-violet-500 animate-spin" />
          <span className="ml-2 text-gray-400 text-sm">Carregando mais...</span>
        </div>
      )}

      {/* Elemento observador para scroll infinito */}
      <div ref={observerTarget} className="h-4" />

      {/* Espaçamento no final */}
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
          console.log("Filtros aplicados:", novosFiltros);
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
