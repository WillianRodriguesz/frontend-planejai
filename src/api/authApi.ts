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


export const login = async (dados: LoginDto): Promise<LoginResponseDto> => {
  return apiClient.post<LoginResponseDto>("/planejai/auth/login", dados);
};


export const logout = async (): Promise<LogoutResponseDto> => {
  return apiClient.post<LogoutResponseDto>("/planejai/auth/logout", {});
};


export const trocarSenha = async (
  dados: TrocarSenhaDto
): Promise<TrocarSenhaResponseDto> => {
  return apiClient.patch<TrocarSenhaResponseDto>(
    "/planejai/usuario/senha",
    dados
  );
};


export const verificarEmail = async (
  dados: VerificarEmailDto
): Promise<VerificarEmailResponseDto> => {
  return apiClient.post<VerificarEmailResponseDto>(
    "/planejai/auth/verificar-email",
    dados
  );
};


export const reenviarCodigo = async (
  dados: ReenviarCodigoDto
): Promise<ReenviarCodigoResponseDto> => {
  return apiClient.post<ReenviarCodigoResponseDto>(
    "/planejai/auth/reenviar-codigo",
    dados
  );
};


export const solicitarRedefinicaoSenha = async (
  dados: SolicitarRedefinicaoSenhaDto
): Promise<SolicitarRedefinicaoSenhaResponseDto> => {
  return apiClient.post<SolicitarRedefinicaoSenhaResponseDto>(
    "/planejai/auth/solicitar-redefinicao-senha",
    dados
  );
};


export const redefinirSenha = async (
  dados: RedefinirSenhaDto
): Promise<RedefinirSenhaResponseDto> => {
  return apiClient.post<RedefinirSenhaResponseDto>(
    "/planejai/auth/redefinir-senha",
    dados
  );
};
