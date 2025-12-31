import { apiClient } from "./apiClient";
import type {
  CriarUsuarioDto,
  LoginUsuarioDto,
  UsuarioDto,
  LoginResponseDto,
  BuscarUsuarioResponseDto,
  AtualizarUsuarioDto,
} from "../types/usuario";

/**
 * Cria um novo usuário
 */
export const criarUsuario = async (
  dados: CriarUsuarioDto
): Promise<UsuarioDto> => {
  return apiClient.post<UsuarioDto>("/planejai/usuario", dados);
};

/**
 * Faz login do usuário
 */
export const loginUsuario = async (
  dados: LoginUsuarioDto
): Promise<LoginResponseDto> => {
  return apiClient.post<LoginResponseDto>("/planejai/usuario/login", dados);
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
  dados: AtualizarUsuarioDto
): Promise<UsuarioDto> => {
  return apiClient.put<UsuarioDto>("/planejai/usuario", dados);
};

/**
 * Deleta o usuário autenticado
 */
export const deletarUsuario = async (): Promise<void> => {
  return apiClient.delete<void>("/planejai/usuario");
};

/**
 * Busca um usuário por ID
 */
export const buscarUsuarioPorId = async (id: string): Promise<UsuarioDto> => {
  return apiClient.get<UsuarioDto>(`/planejai/usuario/${id}`);
};
