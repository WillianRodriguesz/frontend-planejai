export interface UsuarioDto {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  avatar?: string;
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

export interface AtualizarAvatarDto {
  avatar: string;
}

export interface BuscarUsuarioResponseDto {
  usuario: UsuarioDto;
  carteiraId: string;
}
