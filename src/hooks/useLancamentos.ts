import { useState, useEffect } from "react";
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
import { obterIconeCategoria } from "../utils/categoriaIcones";

interface UseLancamentosParams {
  pagina?: number;
  itensPorPagina?: number;
  filtros?: FiltrarLancamentosDto;
  autoFetch?: boolean;
}

export interface LancamentoExibicao {
  id: string;
  icone: any;
  titulo: string;
  data: string;
  valor: number;
  tipo: "entrada" | "saida";
  idCategoria: number;
  nomeCategoria?: string;
}

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

      if (filtros && Object.keys(filtros).length > 0) {
        data = await filtrarLancamentos(idCarteira, {
          ...filtros,
          pagina,
          itensPorPagina,
        });
      } else {
        data = await buscarTodosLancamentos(idCarteira, pagina, itensPorPagina);
      }

      const lancamentosFormatados: LancamentoExibicao[] = data.lancamentos.map(
        (lanc) => {
          const nomeCategoria = lanc.categoria?.nome;
          const icone = obterIconeCategoria(nomeCategoria);

          return {
            id: lanc.id,
            icone,
            titulo: lanc.titulo,
            data: formatarDataBR(lanc.data),
            valor: lanc.valor,
            tipo: lanc.tipoTransacao,
            idCategoria: lanc.idCategoria,
            nomeCategoria,
          };
        }
      );

      const temMaisDados = lancamentosFormatados.length === itensPorPagina;
      setHasMore(temMaisDados);

      if (pagina === 1) {
        setTodosLancamentos(lancamentosFormatados);
      } else {
        setTodosLancamentos((prev) => [...prev, ...lancamentosFormatados]);
      }
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
      const idCategoria = parseInt(novoLancamento.categoria, 10);
      const dataFormatada = novoLancamento.data;

      const lancamentoDto: AdicionarLancamentoDto = {
        idCategoria,
        tipoTransacao: novoLancamento.tipo,
        valor: novoLancamento.valor,
        titulo: novoLancamento.titulo,
        descricao: "",
        data: dataFormatada,
      };

      await adicionarLancamentoApi(idCarteira, lancamentoDto);
      setTodosLancamentos([]);
      setHasMore(true);
      await fetchLancamentos();
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
      setTodosLancamentos([]);
      setHasMore(true);
      await fetchLancamentos();
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
      setTodosLancamentos([]);
      setHasMore(true);
      // Forçar refetch
      await fetchLancamentos();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch && idCarteira) {
      fetchLancamentos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFetch, idCarteira, pagina, itensPorPagina, filtros]);

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
