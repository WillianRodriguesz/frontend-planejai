import { apiClient } from "./apiClient";
import type { CategoriaDto } from "../types/categoria";

export const buscarTodasCategorias = async (): Promise<CategoriaDto[]> => {
  return apiClient.get<CategoriaDto[]>("/planejai/categoria");
};

export const buscarCategoriaPorId = async (
  id: number
): Promise<CategoriaDto> => {
  return apiClient.get<CategoriaDto>(`/planejai/categoria/${id}`);
};
