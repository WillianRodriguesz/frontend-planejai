import { useState, useRef, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import CardLancamento from "../moleculas/CardLancamento";
import ModalAdicionarLancamento from "./ModalAdicionarLancamento";
import ModalEditarLancamento from "./ModalEditarLancamento";
import ModalDetalhesLancamento from "./ModalDetalhesLancamento";
import FiltroCalendario from "../atomos/FiltroCalendario";
import FiltroTipo from "../atomos/FiltroTipo";
import FiltroCategoria from "../atomos/FiltroCategoria";
import ChipFiltro from "../atomos/ChipFiltro";
import CampoBusca from "../atomos/CampoBusca";
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
  onFiltrar?: (filtros: {
    categoria: string;
    dataInicio: string;
    dataFim: string;
    tipo: "todos" | "entrada" | "saida";
  }) => void;
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
  onFiltrar,
  loading = false,
  hasMore = true,
  itensPorPagina = 10,
}: LancamentosProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [isModalDetalhesOpen, setIsModalDetalhesOpen] = useState(false);
  const [termoBusca, setTermoBusca] = useState("");
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
  const [filtrosAtivos, setFiltrosAtivos] = useState<
    Array<{
      tipo: "data" | "tipo" | "categoria";
      label: string;
      valor: string;
      valorOriginal?: string;
    }>
  >([
    {
      tipo: "data",
      label: "Período",
      valor: "Mês atual",
      valorOriginal: "default",
    },
  ]);

  const observerTarget = useRef<HTMLDivElement>(null);

  const aplicarFiltros = (novosFiltros: typeof filtrosAtivos) => {
    const filtroData = novosFiltros.find((f) => f.tipo === "data");
    const filtroTipo = novosFiltros.find((f) => f.tipo === "tipo");
    const filtroCategoria = novosFiltros.find((f) => f.tipo === "categoria");

    let dataInicio = "";
    let dataFim = "";

    if (filtroData?.valorOriginal && filtroData.valorOriginal !== "default") {
      [dataInicio, dataFim] = filtroData.valorOriginal.split("|");
    }

    if (onFiltrar) {
      onFiltrar({
        categoria: filtroCategoria?.valorOriginal || "",
        dataInicio,
        dataFim,
        tipo:
          (filtroTipo?.valorOriginal as "todos" | "entrada" | "saida") ||
          "todos",
      });
    }
  };

  const adicionarFiltroData = (
    dataInicio: string,
    dataFim: string,
    label: string
  ) => {
    const novosFiltros = filtrosAtivos.filter((f) => f.tipo !== "data");
    novosFiltros.push({
      tipo: "data",
      label: "Data",
      valor: label,
      valorOriginal: `${dataInicio}|${dataFim}`,
    });
    setFiltrosAtivos(novosFiltros);
    aplicarFiltros(novosFiltros);
  };

  const adicionarFiltroTipo = (
    tipo: "todos" | "entrada" | "saida",
    label: string
  ) => {
    const novosFiltros = filtrosAtivos.filter((f) => f.tipo !== "tipo");
    if (tipo !== "todos") {
      novosFiltros.push({
        tipo: "tipo",
        label: "Tipo",
        valor: label,
        valorOriginal: tipo,
      });
    }
    setFiltrosAtivos(novosFiltros);
    aplicarFiltros(novosFiltros);
  };

  const adicionarFiltroCategoria = (
    idCategoria: string,
    nomeCategoria: string
  ) => {
    const novosFiltros = filtrosAtivos.filter((f) => f.tipo !== "categoria");
    novosFiltros.push({
      tipo: "categoria",
      label: "Categoria",
      valor: nomeCategoria,
      valorOriginal: idCategoria,
    });
    setFiltrosAtivos(novosFiltros);
    aplicarFiltros(novosFiltros);
  };

  const removerFiltro = (tipoFiltro: "data" | "tipo" | "categoria") => {
    let novosFiltros = filtrosAtivos.filter((f) => f.tipo !== tipoFiltro);

    if (tipoFiltro === "data") {
      // Always keep the default data filter
      novosFiltros = novosFiltros.filter((f) => f.tipo !== "data");
      novosFiltros.push({
        tipo: "data",
        label: "Período",
        valor: "Mês atual",
        valorOriginal: "default",
      });
    }

    setFiltrosAtivos(novosFiltros);
    aplicarFiltros(novosFiltros);
  };

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

  const lancamentosFiltrados = lancamentos.filter((lancamento) => {
    if (!termoBusca) return true;
    const termoLower = termoBusca.toLowerCase();
    return (
      lancamento.titulo.toLowerCase().includes(termoLower) ||
      lancamento.nomeCategoria?.toLowerCase().includes(termoLower)
    );
  });

  return (
    <div className="w-full pt-3">
      <div className="flex flex-col gap-3 pb-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="w-full md:flex-1 order-1 md:order-1">
            <CampoBusca
              valor={termoBusca}
              onChange={setTermoBusca}
              placeholder="Buscar por título ou descrição..."
            />
          </div>
          <div className="flex items-center gap-1.5 md:gap-3 w-full md:w-auto order-2 md:order-2">
            <div className="grid grid-cols-3 gap-1.5 w-full md:flex md:flex-none md:w-auto">
              <FiltroCalendario onAplicar={adicionarFiltroData} />
              <FiltroTipo onAplicar={adicionarFiltroTipo} />
              <FiltroCategoria onAplicar={adicionarFiltroCategoria} />
            </div>
            <button
              aria-label="Adicionar lançamento"
              onClick={() => setIsModalOpen(true)}
              data-lancamentos-add-button
              className="hidden md:flex text-white bg-purple-600 hover:bg-purple-700 backdrop-blur-xl border-solid border border-purple-600 px-4 py-2 rounded-xl transition-all duration-200 focus:outline-none h-11 items-center justify-center gap-2 whitespace-nowrap"
            >
              <Plus className="h-5 w-5" />
              <span className="text-sm font-medium">Novo</span>
            </button>
          </div>
        </div>

        {filtrosAtivos.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {filtrosAtivos.map((filtro) => (
                <ChipFiltro
                  key={filtro.tipo}
                  valor={filtro.valor}
                  onRemover={() => removerFiltro(filtro.tipo)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
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
        ) : lancamentosFiltrados.length > 0 ? (
          lancamentosFiltrados.map((lancamento) => {
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
          <div className="p-6 flex items-center justify-center min-h-[100px]">
            <div className="flex items-center gap-4 opacity-60">
              {/* Ícone minimalista */}
              <div className="relative w-12 h-12 flex-shrink-0">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-purple-500/30"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-purple-400/70"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>

              {/* Texto */}
              <div className="flex flex-col">
                <p className="text-gray-400 text-sm font-medium">
                  {termoBusca
                    ? "Nenhum lançamento encontrado"
                    : "Nenhum lançamento para este período"}
                </p>
                <p className="text-gray-500 text-xs">
                  {termoBusca
                    ? "Tente outro termo de busca"
                    : "Adicione um novo lançamento para começar"}
                </p>
              </div>
            </div>
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
