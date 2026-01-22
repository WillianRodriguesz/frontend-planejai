import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import BotaoSalvar from "../atomos/BotaoSalvar";
import Toast from "../atomos/Toast";
import { useLoading } from "../../contexts/LoadingContext";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useCarteiraStore } from "../../stores/useCarteiraStore";
import { useCategoriasStore } from "../../stores/useCategoriasStore";
import { solicitarRedefinicaoSenha } from "../../api/authApi";
import { apiClient } from "../../api/apiClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [focado, setFocado] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [tentativasErradas, setTentativasErradas] = useState(0);
  const [bloqueadoAte, setBloqueadoAte] = useState<Date | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const [mostrarRecuperacao, setMostrarRecuperacao] = useState(false);
  const [emailRecuperacao, setEmailRecuperacao] = useState("");
  const [recuperacaoEnviada, setRecuperacaoEnviada] = useState(false);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { login, loading } = useAuth();
  const { toasts, success, error: showError, hideToast } = useToast();
  const { fetchUsuario, reset: resetUsuario } = useUsuarioStore();
  const { clearCarteira } = useCarteiraStore();
  const { reset: resetCategorias } = useCategoriasStore();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiClient.get("/planejai/auth/validate");
        navigate("/home");
      } catch (error) {}
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (!bloqueadoAte) {
      setTimer(0);
      return;
    }
    const interval = setInterval(() => {
      const diff = Math.ceil((bloqueadoAte.getTime() - Date.now()) / 1000);
      setTimer(diff > 0 ? diff : 0);
      if (diff <= 0) {
        setBloqueadoAte(null);
        setTimer(0);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [bloqueadoAte]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (bloqueadoAte && new Date() < bloqueadoAte) {
      toasts.forEach((toast) => hideToast(toast.id));
      return;
    }

    showLoading("Entrando...", "Entrando na página inicial");

    try {
      await login({ email, senha });
      resetUsuario();
      resetCategorias();
      clearCarteira();
      await fetchUsuario();
      setTentativasErradas(0);
      navigate("/home");
    } catch (err) {
      setTentativasErradas((prev) => prev + 1);
      toasts.forEach((toast) => hideToast(toast.id));
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erro ao fazer login. Verifique suas credenciais.";
      showError(errorMsg);

      if (tentativasErradas + 1 >= 5) {
        const timeout = 60 * 1000; // 60 segundos
        setBloqueadoAte(new Date(Date.now() + timeout));
        setTentativasErradas(0);
        toasts.forEach((toast) => hideToast(toast.id));
        showError(
          "Muitas tentativas falhadas. Login bloqueado por 60 segundos.",
        );
      }
    } finally {
      hideLoading();
    }
  };

  const handleRecuperacaoSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailRecuperacao.trim()) {
      showError("Por favor, digite seu email.");
      return;
    }

    showLoading("Enviando...", "Enviando instruções de recuperação");

    try {
      await solicitarRedefinicaoSenha({ email: emailRecuperacao });
      setRecuperacaoEnviada(true);
      success("Instruções de recuperação enviadas para seu email!");
    } catch (err) {
      const errorMsg =
        err instanceof Error
          ? err.message
          : "Erro ao enviar instruções de recuperação.";
      showError(errorMsg);
    } finally {
      hideLoading();
    }
  };

  const voltarParaLogin = () => {
    setMostrarRecuperacao(false);
    setRecuperacaoEnviada(false);
    setEmailRecuperacao("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex flex-col items-center justify-center px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 flex flex-col">
        {!mostrarRecuperacao ? (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
                Bem-vindo ao Planejai
              </h1>
              <p className="text-gray-400 text-base md:text-base font-medium mb-3">
                Seu app para organizar suas finanças
              </p>
            </div>

            <form
              className="space-y-4 md:space-y-4 flex-1 flex flex-col justify-center"
              onSubmit={handleLogin}
              noValidate
            >
              <div className="relative">
                <input
                  type="email"
                  id="login-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocado("email")}
                  onBlur={() => setFocado(null)}
                  required
                  className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                    focado === "email" ? "border-purple-500 shadow-md" : ""
                  }`}
                  placeholder=" "
                  autoComplete="email"
                />
                <Mail
                  className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                    focado === "email" || email
                      ? "text-purple-400"
                      : "text-gray-400"
                  }`}
                />
                <label
                  htmlFor="login-email"
                  className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                    ${
                      focado === "email" || email
                        ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                        : "top-1/2 -translate-y-1/2 scale-100"
                    }`}
                >
                  E-mail
                </label>
              </div>

              <div className="relative">
                <input
                  type={mostrarSenha ? "text" : "password"}
                  id="login-senha"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  onFocus={() => setFocado("senha")}
                  onBlur={() => setFocado(null)}
                  required
                  className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pr-11 md:pr-10 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                    focado === "senha" ? "border-purple-500 shadow-md" : ""
                  }`}
                  placeholder=" "
                  autoComplete="current-password"
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
                  htmlFor="login-senha"
                  className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                    ${
                      focado === "senha" || senha
                        ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                        : "top-1/2 -translate-y-1/2 scale-100"
                    }`}
                >
                  Senha
                </label>
              </div>

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => setMostrarRecuperacao(true)}
                  className="text-purple-400 hover:text-purple-300 text-sm font-medium underline bg-transparent border-none outline-none cursor-pointer transition-colors"
                >
                  Esqueci minha senha
                </button>
              </div>

              <div className="flex flex-col items-center mt-2 space-y-2">
                <BotaoSalvar
                  className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center"
                  disabled={
                    !!(loading || (bloqueadoAte && new Date() < bloqueadoAte))
                  }
                >
                  Entrar
                </BotaoSalvar>
                {bloqueadoAte && new Date() < bloqueadoAte && timer > 0 && (
                  <span className="text-xs text-red-400 text-center">
                    Login bloqueado. Aguarde {timer} segundo(s) para tentar
                    novamente.
                  </span>
                )}
              </div>
            </form>
          </>
        ) : (
          <>
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
                {recuperacaoEnviada ? "Verifique seu email" : "Recuperar senha"}
              </h1>
              <p className="text-gray-400 text-base md:text-base font-medium">
                {recuperacaoEnviada
                  ? "Enviamos instruções para redefinir sua senha"
                  : "Digite seu email para receber instruções de recuperação"}
              </p>
            </div>

            {!recuperacaoEnviada ? (
              <form
                className="space-y-6 flex-1 flex flex-col justify-center"
                onSubmit={handleRecuperacaoSenha}
                noValidate
              >
                <div className="relative">
                  <input
                    type="email"
                    id="recuperacao-email"
                    value={emailRecuperacao}
                    onChange={(e) => setEmailRecuperacao(e.target.value)}
                    onFocus={() => setFocado("recuperacao")}
                    onBlur={() => setFocado(null)}
                    required
                    className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                      focado === "recuperacao"
                        ? "border-purple-500 shadow-md"
                        : ""
                    }`}
                    placeholder=" "
                    autoComplete="email"
                  />
                  <Mail
                    className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                      focado === "recuperacao" || emailRecuperacao
                        ? "text-purple-400"
                        : "text-gray-400"
                    }`}
                  />
                  <label
                    htmlFor="recuperacao-email"
                    className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                      ${
                        focado === "recuperacao" || emailRecuperacao
                          ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                          : "top-1/2 -translate-y-1/2 scale-100"
                      }`}
                  >
                    E-mail
                  </label>
                </div>

                <div className="flex justify-center mt-2">
                  <BotaoSalvar
                    className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center"
                    disabled={!!loading}
                  >
                    Enviar instruções
                  </BotaoSalvar>
                </div>
              </form>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 space-y-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600/20 to-purple-500/20 rounded-full flex items-center justify-center">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <p className="text-gray-300 text-center text-sm px-4">
                  Verifique sua caixa de entrada e siga as instruções para
                  redefinir sua senha.
                </p>
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={voltarParaLogin}
                className="text-purple-400 hover:text-purple-300 font-semibold text-sm underline bg-transparent border-none outline-none cursor-pointer transition-colors"
              >
                Voltar ao login
              </button>
            </div>
          </>
        )}
      </div>

      <div className="text-center text-gray-400 text-sm md:text-sm mt-6">
        Não tem uma conta?{" "}
        <button
          type="button"
          className="text-purple-400 hover:underline font-semibold bg-transparent border-none outline-none cursor-pointer"
          onClick={() => navigate("/registro")}
        >
          Registre-se
        </button>
      </div>
    </div>
  );
}
