import { useState } from "react";
import type {
  LoginDto,
  LoginResponseDto,
  LogoutResponseDto,
  TrocarSenhaDto,
  TrocarSenhaResponseDto,
} from "../types/auth";
import {
  login as loginApi,
  logout as logoutApi,
  trocarSenha as trocarSenhaApi,
} from "../api/authApi";

interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  login: (dados: LoginDto) => Promise<LoginResponseDto>;
  logout: () => Promise<LogoutResponseDto>;
  trocarSenha: (dados: TrocarSenhaDto) => Promise<TrocarSenhaResponseDto>;
}

export const useAuth = (): UseAuthReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (dados: LoginDto): Promise<LoginResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await loginApi(dados);
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

  const logout = async (): Promise<LogoutResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await logoutApi();
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

  const trocarSenha = async (
    dados: TrocarSenhaDto
  ): Promise<TrocarSenhaResponseDto> => {
    setLoading(true);
    setError(null);
    try {
      const result = await trocarSenhaApi(dados);
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
    login,
    logout,
    trocarSenha,
  };
};
