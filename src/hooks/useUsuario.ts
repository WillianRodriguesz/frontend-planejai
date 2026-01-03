import { useState } from "react";
import type {
  CriarUsuarioDto,
  UsuarioDto,
  BuscarUsuarioResponseDto,
  AtualizarUsuarioDto,
} from "../types/usuario";
import {
  criarUsuario as criarUsuarioApi,
  buscarUsuario as buscarUsuarioApi,
  atualizarUsuario as atualizarUsuarioApi,
  deletarUsuario as deletarUsuarioApi,
  buscarUsuarioPorId as buscarUsuarioPorIdApi,
} from "../api/usuarioApi";

interface UseUsuarioReturn {
  loading: boolean;
  error: string | null;
  criarUsuario: (dados: CriarUsuarioDto) => Promise<UsuarioDto>;
  buscarUsuario: () => Promise<BuscarUsuarioResponseDto>;
  atualizarUsuario: (dados: AtualizarUsuarioDto) => Promise<UsuarioDto>;
  deletarUsuario: () => Promise<void>;
  buscarUsuarioPorId: (id: string) => Promise<UsuarioDto>;
}

export const useUsuario = (): UseUsuarioReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const criarUsuario = async (dados: CriarUsuarioDto): Promise<UsuarioDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await criarUsuarioApi(dados);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuario = async (): Promise<BuscarUsuarioResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await buscarUsuarioApi();
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const atualizarUsuario = async (
    dados: AtualizarUsuarioDto
  ): Promise<UsuarioDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await atualizarUsuarioApi(dados);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletarUsuario = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await deletarUsuarioApi();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const buscarUsuarioPorId = async (id: string): Promise<UsuarioDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await buscarUsuarioPorIdApi(id);
      return result;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    criarUsuario,
    buscarUsuario,
    atualizarUsuario,
    deletarUsuario,
    buscarUsuarioPorId,
  };
};
