export interface UsuarioDto {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CriarUsuarioDto {
  nome: string;
  email: string;
  telefone?: string;
  senha: string;
}

export interface AtualizarUsuarioDto {
  nome?: string;
  email?: string;
  telefone?: string;
}

export interface BuscarUsuarioResponseDto {
  usuario: UsuarioDto;
  carteiraId: string;
}
