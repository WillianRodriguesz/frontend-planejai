import { apiClient } from "./apiClient";
import type {
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  TrocarSenhaDto,
  TrocarSenhaResponseDto,
} from "../types/auth";

/**
 * Faz login do usuário
 */
export const login = async (dados: LoginDto): Promise<LoginResponseDto> => {
  return apiClient.post<LoginResponseDto>("/planejai/auth/login", dados);
};

/**
 * Faz logout do usuário
 */
export const logout = async (): Promise<LogoutResponseDto> => {
  return apiClient.post<LogoutResponseDto>("/planejai/auth/logout", {});
};

/**
 * Troca a senha do usuário autenticado
 */
export const trocarSenha = async (
  dados: TrocarSenhaDto
): Promise<TrocarSenhaResponseDto> => {
  return apiClient.patch<TrocarSenhaResponseDto>(
    "/planejai/usuarios/senha",
    dados
  );
};
