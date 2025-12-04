import { apiClient } from "./apiClient";

// Exemplo de tipos para lançamentos (ajuste conforme sua API)
export interface Lancamento {
  id: string;
  titulo: string;
  valor: number;
  data: string;
  tipo: "entrada" | "saida";
  categoria: string;
}

/**
 * Busca todos os lançamentos de uma carteira
 * @param idCarteira - ID da carteira
 * @param mes - Mês (1-12)
 * @param ano - Ano
 * @returns Lista de lançamentos
 */
export const buscarLancamentos = async (
  idCarteira: string,
  mes: number,
  ano: number
): Promise<Lancamento[]> => {
  const data = `${ano}-${String(mes).padStart(2, "0")}`;
  return apiClient.get<Lancamento[]>(`/lancamentos/${idCarteira}`, { data });
};

/**
 * Cria um novo lançamento
 * @param idCarteira - ID da carteira
 * @param lancamento - Dados do lançamento
 * @returns Lançamento criado
 */
export const criarLancamento = async (
  idCarteira: string,
  lancamento: Omit<Lancamento, "id">
): Promise<Lancamento> => {
  return apiClient.post<Lancamento>(`/lancamentos/${idCarteira}`, lancamento);
};

/**
 * Atualiza um lançamento existente
 * @param idCarteira - ID da carteira
 * @param idLancamento - ID do lançamento
 * @param lancamento - Dados atualizados
 * @returns Lançamento atualizado
 */
export const atualizarLancamento = async (
  idCarteira: string,
  idLancamento: string,
  lancamento: Partial<Lancamento>
): Promise<Lancamento> => {
  return apiClient.put<Lancamento>(
    `/lancamentos/${idCarteira}/${idLancamento}`,
    lancamento
  );
};

/**
 * Deleta um lançamento
 * @param idCarteira - ID da carteira
 * @param idLancamento - ID do lançamento
 */
export const deletarLancamento = async (
  idCarteira: string,
  idLancamento: string
): Promise<void> => {
  return apiClient.delete(`/lancamentos/${idCarteira}/${idLancamento}`);
};
