import { apiClient } from "./apiClient";
import type {
  CriarUsuarioDto,
  LoginUsuarioDto,
  UsuarioDto,
  LoginResponseDto,
  BuscarUsuarioResponseDto,
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
