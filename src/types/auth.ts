export interface LoginDto {
  email: string;
  senha: string;
}

export interface LoginResponseDto {
  statusCode: number;
  message: string;
}

export interface LogoutResponseDto {
  statusCode: number;
  message: string;
}

export interface TrocarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
}

export interface TrocarSenhaResponseDto {
  statusCode: number;
  message: string;
}

export interface VerificarEmailDto {
  email: string;
  codigo: string;
}

export interface VerificarEmailResponseDto {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  avatar: string;
}

export interface ReenviarCodigoDto {
  email: string;
}

export interface ReenviarCodigoResponseDto {
  message: string;
}
