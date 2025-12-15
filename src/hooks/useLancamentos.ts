import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import type {
  LancamentosPaginadosDto,
  FiltrarLancamentosDto,
  AdicionarLancamentoDto,
  AtualizarLancamentoDto,
} from "../types/lancamento";
import { useCarteira } from "../contexts/CarteiraContext";
import {
  buscarTodosLancamentos,
  filtrarLancamentos,
  adicionarLancamento as adicionarLancamentoApi,
  atualizarLancamento as atualizarLancamentoApi,
  deletarLancamento as deletarLancamentoApi,
} from "../api/lancamentosApi";
import { formatarDataBR } from "../utils/dateUtils";

interface UseLancamentosParams {
  pagina?: number;
  itensPorPagina?: number;
  filtros?: FiltrarLancamentosDto;
  autoFetch?: boolean; // Se deve buscar automaticamente ao montar
}

// Formato simplificado para o componente usar
export interface LancamentoExibicao {
  icone: any;
  titulo: string;
  data: string;
  valor: number;
  tipo: "entrada" | "saida";
}

// Formato do modal de adicionar
export interface NovoLancamentoForm {
  titulo: string;
  categoria: string;
  valor: number;
  data: string;
  tipo: "entrada" | "saida";
}

interface UseLancamentosReturn {
  lancamentos: LancamentoExibicao[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  refetch: () => void;
  adicionarLancamento: (lancamento: NovoLancamentoForm) => Promise<void>;
  atualizarLancamento: (
    idLancamento: string,
    dados: AtualizarLancamentoDto
  ) => Promise<void>;
  deletarLancamento: (idLancamento: string) => Promise<void>;
}

export const useLancamentos = ({
  pagina = 1,
  itensPorPagina = 10,
  filtros,
  autoFetch = true,
}: UseLancamentosParams = {}): UseLancamentosReturn => {
  const { idCarteira } = useCarteira();
  const [todosLancamentos, setTodosLancamentos] = useState<
    LancamentoExibicao[]
  >([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);
  const [paginaAnterior, setPaginaAnterior] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchLancamentos = async () => {
    if (!idCarteira) {
      setError("ID da carteira não encontrado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      let data: LancamentosPaginadosDto;

      // Se tem filtros, usa o endpoint de filtrar, senão busca todos
      if (filtros && Object.keys(filtros).length > 0) {
        data = await filtrarLancamentos(idCarteira, {
          ...filtros,
          pagina,
          itensPorPagina,
        });
      } else {
        data = await buscarTodosLancamentos(idCarteira, pagina, itensPorPagina);
      }

      // Formatar os novos lançamentos
      const lancamentosFormatados: LancamentoExibicao[] = data.lancamentos.map(
        (lanc) => {
          let icone = ShoppingBag;
          return {
            icone,
            titulo: lanc.titulo,
            data: formatarDataBR(lanc.data),
            valor: lanc.valor,
            tipo: lanc.tipoTransacao,
          };
        }
      );

      // Verifica se há mais dados: se retornou menos que o solicitado, acabou
      const temMaisDados = lancamentosFormatados.length === itensPorPagina;
      setHasMore(temMaisDados);

      // Se for página 1, substitui. Senão, adiciona aos existentes
      if (pagina === 1) {
        setTodosLancamentos(lancamentosFormatados);
      } else {
        setTodosLancamentos((prev) => [...prev, ...lancamentosFormatados]);
      }

      setPaginaAnterior(pagina);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      if (pagina === 1) {
        setTodosLancamentos([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const adicionarLancamento = async (novoLancamento: NovoLancamentoForm) => {
    if (!idCarteira) {
      throw new Error("ID da carteira não encontrado");
    }

    try {
      // Converte o ID da categoria (string) para número
      const idCategoria = parseInt(novoLancamento.categoria, 10);

      // A data já vem no formato ISO (YYYY-MM-DD) do input type="date"
      // Não precisa converter, apenas usar diretamente
      const dataFormatada = novoLancamento.data;

      // Monta o DTO para a API
      const lancamentoDto: AdicionarLancamentoDto = {
        idCategoria,
        tipoTransacao: novoLancamento.tipo,
        valor: novoLancamento.valor,
        titulo: novoLancamento.titulo,
        descricao: "", // Por enquanto vazio
        data: dataFormatada,
      };

      await adicionarLancamentoApi(idCarteira, lancamentoDto);
      // Recarrega a lista do zero após adicionar
      setTodosLancamentos([]);
      setPaginaAnterior(0);
      setHasMore(true);
    } catch (err) {
      throw err;
    }
  };

  const atualizarLancamento = async (
    idLancamento: string,
    dadosAtualizacao: AtualizarLancamentoDto
  ) => {
    if (!idCarteira) {
      throw new Error("ID da carteira não encontrado");
    }

    try {
      await atualizarLancamentoApi(idCarteira, idLancamento, dadosAtualizacao);
      // Recarrega a lista do zero após atualizar
      setTodosLancamentos([]);
      setPaginaAnterior(0);
      setHasMore(true);
    } catch (err) {
      throw err;
    }
  };

  const deletarLancamento = async (idLancamento: string) => {
    if (!idCarteira) {
      throw new Error("ID da carteira não encontrado");
    }

    try {
      await deletarLancamentoApi(idCarteira, idLancamento);
      // Recarrega a lista do zero após deletar
      setTodosLancamentos([]);
      setPaginaAnterior(0);
      setHasMore(true);
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    // Só busca se a página mudou ou é a primeira vez
    if (autoFetch && pagina !== paginaAnterior) {
      fetchLancamentos();
    }
  }, [idCarteira, pagina, itensPorPagina, JSON.stringify(filtros)]);

  return {
    lancamentos: todosLancamentos,
    loading,
    error,
    hasMore,
    refetch: fetchLancamentos,
    adicionarLancamento,
    atualizarLancamento,
    deletarLancamento,
  };
};
