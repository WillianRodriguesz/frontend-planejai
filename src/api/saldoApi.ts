import { apiClient } from "./apiClient";
import type { SaldoMensalDto } from "../types/saldo";

/**
 * Busca o saldo mensal de uma carteira específica
 * @param idCarteira - ID da carteira
 * @param data - Data no formato YYYY-MM-DD
 * @returns Dados do saldo mensal
 */
export const buscarSaldoMensal = async (
  idCarteira: string,
  data: string
): Promise<SaldoMensalDto> => {
  return apiClient.get<SaldoMensalDto>(`/planejai/carteira/${idCarteira}`, {
    data,
  });
};
