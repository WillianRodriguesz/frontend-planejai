import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import BotaoSalvar from "../atomos/BotaoSalvar";
import Toast from "../atomos/Toast";
import { useLoading } from "../../contexts/LoadingContext";
import { useToast } from "../../hooks/useToast";
import { redefinirSenha } from "../../api/authApi";

export default function RedefinirSenha() {
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [focado, setFocado] = useState<string | null>(null);
  const [token, setToken] = useState("");
  const [sucesso, setSucesso] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const { toasts, success, error: showError, hideToast } = useToast();

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      showError("Token inválido ou expirado.");
      setTimeout(() => navigate("/login"), 3000);
    }
  }, [searchParams, navigate, showError]);

  const handleRedefinirSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      showError("Token inválido.");
      return;
    }

    if (senha.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmarSenha) {
      showError("As senhas não coincidem.");
      return;
    }

    showLoading("Redefinindo...", "Atualizando sua senha");

    try {
      await redefinirSenha({ token, novaSenha: senha });
      setSucesso(true);
      success("Senha redefinida com sucesso!");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erro ao redefinir senha. Tente novamente.";
      showError(errorMsg);
    } finally {
      hideLoading();
    }
  };

  if (sucesso) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex items-center justify-center px-4">
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => hideToast(toast.id)}
          />
        ))}
        <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4 animate-pulse" />
          <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4">
            Senha redefinida com sucesso!
          </h1>
          <p className="text-gray-400 text-base md:text-base font-medium">
            Redirecionando para o login em alguns segundos...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex items-center justify-center px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
      <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 flex flex-col">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
            Redefinir Senha
          </h1>
          <p className="text-gray-400 text-base md:text-base font-medium">
            Digite sua nova senha
          </p>
        </div>

        <form
          className="space-y-6 flex-1 flex flex-col justify-center"
          onSubmit={handleRedefinirSenha}
          noValidate
        >
          <div className="relative">
            <input
              type={mostrarSenha ? "text" : "password"}
              id="nova-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setFocado("senha")}
              onBlur={() => setFocado(null)}
              required
              minLength={6}
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pr-11 md:pr-10 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "senha" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="new-password"
            />
            <Lock
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "senha" || senha
                  ? "text-purple-400"
                  : "text-gray-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarSenha(!mostrarSenha)}
              className="absolute right-3 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
            >
              {mostrarSenha ? (
                <EyeOff className="w-4 h-4 md:w-4 md:h-4" />
              ) : (
                <Eye className="w-4 h-4 md:w-4 md:h-4" />
              )}
            </button>
            <label
              htmlFor="nova-senha"
              className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                ${
                  focado === "senha" || senha
                    ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                    : "top-1/2 -translate-y-1/2 scale-100"
                }`}
            >
              Nova Senha
            </label>
          </div>

          <div className="relative">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              id="confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              onFocus={() => setFocado("confirmar")}
              onBlur={() => setFocado(null)}
              required
              minLength={6}
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pr-11 md:pr-10 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "confirmar" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="new-password"
            />
            <Lock
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "confirmar" || confirmarSenha
                  ? "text-purple-400"
                  : "text-gray-400"
              }`}
            />
            <button
              type="button"
              onClick={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}
              className="absolute right-3 md:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
            >
              {mostrarConfirmarSenha ? (
                <EyeOff className="w-4 h-4 md:w-4 md:h-4" />
              ) : (
                <Eye className="w-4 h-4 md:w-4 md:h-4" />
              )}
            </button>
            <label
              htmlFor="confirmar-senha"
              className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                ${
                  focado === "confirmar" || confirmarSenha
                    ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                    : "top-1/2 -translate-y-1/2 scale-100"
                }`}
            >
              Confirmar Senha
            </label>
          </div>

          <div className="flex justify-center mt-2">
            <BotaoSalvar
              className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center"
              disabled={!senha || !confirmarSenha || senha !== confirmarSenha}
            >
              Redefinir Senha
            </BotaoSalvar>
          </div>
        </form>

        <div className="mt-8 text-center text-gray-400 text-sm md:text-sm">
          Lembrou sua senha?{" "}
          <button
            type="button"
            className="text-purple-400 hover:underline font-semibold bg-transparent border-none outline-none cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Fazer login
          </button>
        </div>
      </div>
    </div>
  );
}
