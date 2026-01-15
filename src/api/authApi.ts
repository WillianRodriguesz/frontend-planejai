import { apiClient } from "./apiClient";
import type {
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  TrocarSenhaDto,
  TrocarSenhaResponseDto,
  VerificarEmailDto,
  VerificarEmailResponseDto,
  ReenviarCodigoDto,
  ReenviarCodigoResponseDto,
  SolicitarRedefinicaoSenhaDto,
  SolicitarRedefinicaoSenhaResponseDto,
  RedefinirSenhaDto,
  RedefinirSenhaResponseDto,
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

/**
 * Verifica o email do usuário com código de 6 dígitos
 */
export const verificarEmail = async (
  dados: VerificarEmailDto
): Promise<VerificarEmailResponseDto> => {
  return apiClient.post<VerificarEmailResponseDto>(
    "/planejai/auth/verificar-email",
    dados
  );
};

/**
 * Reenvia o código de verificação de email
 */
export const reenviarCodigo = async (
  dados: ReenviarCodigoDto
): Promise<ReenviarCodigoResponseDto> => {
  return apiClient.post<ReenviarCodigoResponseDto>(
    "/planejai/auth/reenviar-codigo",
    dados
  );
};

/**
 * Solicita redefinição de senha
 */
export const solicitarRedefinicaoSenha = async (
  dados: SolicitarRedefinicaoSenhaDto
): Promise<SolicitarRedefinicaoSenhaResponseDto> => {
  return apiClient.post<SolicitarRedefinicaoSenhaResponseDto>(
    "/planejai/auth/solicitar-redefinicao-senha",
    dados
  );
};

/**
 * Redefinir senha com token
 */
export const redefinirSenha = async (
  dados: RedefinirSenhaDto
): Promise<RedefinirSenhaResponseDto> => {
  return apiClient.post<RedefinirSenhaResponseDto>(
    "/planejai/auth/redefinir-senha",
    dados
  );
};
