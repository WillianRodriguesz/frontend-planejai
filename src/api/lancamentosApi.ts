import { apiClient } from "./apiClient";
import type {
  LancamentosPaginadosDto,
  LancamentoDto,
  FiltrarLancamentosDto,
  AdicionarLancamentoDto,
  AtualizarLancamentoDto,
} from "../types/lancamento";

/**
 * Busca todos os lançamentos de uma carteira com paginação
 */
export const buscarTodosLancamentos = async (
  idCarteira: string,
  pagina: number = 1,
  itensPorPagina: number = 10
): Promise<LancamentosPaginadosDto> => {
  return apiClient.get<LancamentosPaginadosDto>(
    `/planejai/carteira/${idCarteira}/lancamentos`,
    {
      pagina: pagina.toString(),
      itensPorPagina: itensPorPagina.toString(),
    }
  );
};

/**
 * Filtra lançamentos de uma carteira com base em critérios
 */
export const filtrarLancamentos = async (
  idCarteira: string,
  filtros: FiltrarLancamentosDto
): Promise<LancamentosPaginadosDto> => {
  const queryParams: Record<string, string> = {};

  if (filtros.dataInicial) queryParams.dataInicial = filtros.dataInicial;
  if (filtros.dataFinal) queryParams.dataFinal = filtros.dataFinal;
  if (filtros.idCategoria)
    queryParams.idCategoria = filtros.idCategoria.toString();
  if (filtros.titulo) queryParams.titulo = filtros.titulo;
  if (filtros.tipoTransacao) queryParams.tipoTransacao = filtros.tipoTransacao;
  if (filtros.pagina) queryParams.pagina = filtros.pagina.toString();
  if (filtros.itensPorPagina)
    queryParams.itensPorPagina = filtros.itensPorPagina.toString();

  return apiClient.get<LancamentosPaginadosDto>(
    `/planejai/carteira/${idCarteira}/lancamentos/filtrar`,
    queryParams
  );
};

/**
 * Busca um lançamento específico por ID
 */
export const buscarLancamentoPorId = async (
  idCarteira: string,
  idLancamento: string
): Promise<LancamentoDto> => {
  return apiClient.get<LancamentoDto>(
    `/planejai/carteira/${idCarteira}/lancamento/${idLancamento}`
  );
};

/**
 * Adiciona um novo lançamento à carteira
 */
export const adicionarLancamento = async (
  idCarteira: string,
  lancamento: AdicionarLancamentoDto
): Promise<{ message: string }> => {
  return apiClient.post<{ message: string }>(
    `/planejai/carteira/${idCarteira}/lancamento`,
    lancamento
  );
};

/**
 * Atualiza um lançamento existente
 */
export const atualizarLancamento = async (
  idCarteira: string,
  idLancamento: string,
  dados: AtualizarLancamentoDto
): Promise<{ message: string }> => {
  return apiClient.put<{ message: string }>(
    `/planejai/carteira/${idCarteira}/lancamento/${idLancamento}`,
    dados
  );
};

/**
 * Deleta um lançamento
 */
export const deletarLancamento = async (
  idCarteira: string,
  idLancamento: string
): Promise<{ message: string }> => {
  return apiClient.delete<{ message: string }>(
    `/planejai/carteira/${idCarteira}/lancamento/${idLancamento}`
  );
};
