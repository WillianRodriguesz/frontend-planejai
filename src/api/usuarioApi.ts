import { apiClient } from "./apiClient";
import type {
  CriarUsuarioDto,
  UsuarioDto,
  BuscarUsuarioResponseDto,
  AtualizarUsuarioDto,
  AtualizarAvatarDto,
  TermoDto,
} from "../types/usuario";

/**
 * Cria um novo usuário
 */
export const criarUsuario = async (
  dados: CriarUsuarioDto,
): Promise<UsuarioDto> => {
  return apiClient.post<UsuarioDto>("/planejai/usuario", dados);
};

/**
 * Busca o usuário autenticado e o ID da carteira
 */
export const buscarUsuario = async (): Promise<BuscarUsuarioResponseDto> => {
  return apiClient.get<BuscarUsuarioResponseDto>("/planejai/usuario");
};

/**
 * Atualiza o usuário autenticado
 */
export const atualizarUsuario = async (
  dados: AtualizarUsuarioDto,
): Promise<UsuarioDto> => {
  return apiClient.put<UsuarioDto>("/planejai/usuario", dados);
};

/**
 * Atualiza o avatar do usuário autenticado
 */
export const atualizarAvatar = async (
  dados: AtualizarAvatarDto,
): Promise<UsuarioDto> => {
  return apiClient.patch<UsuarioDto>("/planejai/usuario/avatar", dados);
};

/**
 * Deleta o usuário autenticado
 */
export const deletarUsuario = async (): Promise<void> => {
  return apiClient.delete<void>("/planejai/usuario");
};

/**
 * Busca o termo ativo por tipo
 */
export const buscarTermo = async (tipo: string): Promise<TermoDto | null> => {
  return apiClient.get<TermoDto | null>(`/planejai/usuario/termos/${tipo}`);
};

/**
 * Busca um usuário por ID
 */
export const buscarUsuarioPorId = async (id: string): Promise<UsuarioDto> => {
  return apiClient.get<UsuarioDto>(`/planejai/usuario/${id}`);
};
