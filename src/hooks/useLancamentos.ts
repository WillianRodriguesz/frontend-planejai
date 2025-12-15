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
  const [dados, setDados] = useState<LancamentosPaginadosDto | null>(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<string | null>(null);

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

      setDados(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setDados(null);
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
      // Recarrega a lista após adicionar
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
      // Recarrega a lista após atualizar
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
      // Recarrega a lista após deletar
      await fetchLancamentos();
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchLancamentos();
    }
  }, [idCarteira, pagina, itensPorPagina, JSON.stringify(filtros)]);

  // Mapear os lançamentos da API para o formato de exibição
  const lancamentosFormatados: LancamentoExibicao[] =
    dados?.lancamentos.map((lanc) => {
      // Determinar ícone baseado na categoria (por enquanto genérico)
      let icone = ShoppingBag;
      // TODO: Mapear idCategoria para ícones específicos quando tiver endpoint de categorias

      return {
        icone,
        titulo: lanc.titulo,
        data: formatarDataBR(lanc.data),
        valor: lanc.valor,
        tipo: lanc.tipoTransacao,
      };
    }) || [];

  return {
    lancamentos: lancamentosFormatados,
    loading,
    error,
    refetch: fetchLancamentos,
    adicionarLancamento,
    atualizarLancamento,
    deletarLancamento,
  };
};
