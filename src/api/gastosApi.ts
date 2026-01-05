import { apiClient } from "./apiClient";
import type { GastosMensaisDto } from "../types/gastos";

/**
 * Busca os gastos mensais de uma carteira específica
 * @param idCarteira - ID da carteira
 * @param mes - Mês no formato YYYY-MM
 * @returns Dados dos gastos mensais por categoria
 */
export const buscarGastosMensais = async (
  idCarteira: string,
  mes: string
): Promise<GastosMensaisDto> => {
  return apiClient.get<GastosMensaisDto>(
    `/planejai/carteira/${idCarteira}/gastos-mensais`,
    { mes }
  );
};
