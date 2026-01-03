import { apiClient } from "./apiClient";
import type {
  CriarUsuarioDto,
  UsuarioDto,
  BuscarUsuarioResponseDto,
  AtualizarUsuarioDto,
} from "../types/usuario";

/**
 * Cria um novo usuário
 */
export const criarUsuario = async (
  dados: CriarUsuarioDto
): Promise<UsuarioDto> => {
  return apiClient.post<UsuarioDto>("/planejai/usuarios", dados);
};

/**
 * Busca o usuário autenticado e o ID da carteira
 */
export const buscarUsuario = async (): Promise<BuscarUsuarioResponseDto> => {
  return apiClient.get<BuscarUsuarioResponseDto>("/planejai/usuarios");
};

/**
 * Atualiza o usuário autenticado
 */
export const atualizarUsuario = async (
  dados: AtualizarUsuarioDto
): Promise<UsuarioDto> => {
  return apiClient.put<UsuarioDto>("/planejai/usuarios", dados);
};

/**
 * Deleta o usuário autenticado
 */
export const deletarUsuario = async (): Promise<void> => {
  return apiClient.delete<void>("/planejai/usuarios");
};

/**
 * Busca um usuário por ID
 */
export const buscarUsuarioPorId = async (id: string): Promise<UsuarioDto> => {
  return apiClient.get<UsuarioDto>(`/planejai/usuarios/${id}`);
};
