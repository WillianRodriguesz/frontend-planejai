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
