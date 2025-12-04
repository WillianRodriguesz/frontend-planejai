import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import BotaoSalvar from "../atomos/BotaoSalvar";
import { useLoading } from "../../contexts/LoadingContext";
// Floating label custom input, não usa CampoOutlined para garantir animação

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [focado, setFocado] = useState<string | null>(null);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    showLoading("Entrando...", "Entrando na página inicial");

    try {
      // Simular delay de autenticação
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Após implementar autenticação real, pegar o ID da carteira do cookie
      // Por enquanto, o ID já vem da env no CarteiraContext

      navigate("/home");
    } finally {
      hideLoading();
    }
  };

  const handleGoogleLogin = () => {
    // lógica de login com Google
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex items-center justify-center px-4">
      <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 min-h-[450px] md:min-h-[460px]">
        <div className="mb-6 md:mb-6 text-center pb-4">
          <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 md:mb-2">
            Bem-vindo ao Planejai
          </h1>
          <p className="text-gray-400 text-base md:text-base font-medium">
            Seu app para organizar suas finanças
          </p>
        </div>

        <form
          className="space-y-4 md:space-y-4"
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

          <div className="flex justify-center">
            <BotaoSalvar className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center">
              Entrar
            </BotaoSalvar>
          </div>
        </form>

        <div className="flex items-center my-3 md:my-4">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="mx-3 md:mx-2.5 text-gray-400 text-sm md:text-sm">
            ou
          </span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 md:gap-2.5 bg-white/10 hover:bg-white/20 border border-gray-700 rounded-xl py-2.5 md:py-2 font-semibold text-white transition-all duration-200 shadow-md text-sm md:text-sm"
        >
          <FcGoogle className="w-5 h-5 md:w-4.5 md:h-4.5" />
          Entrar com Google
        </button>

        <div className="mt-4 md:mt-5 text-center text-gray-400 text-sm md:text-sm">
          Não tem uma conta?{" "}
          <a href="#" className="text-purple-400 hover:underline font-semibold">
            Registre-se
          </a>
        </div>
      </div>
    </div>
  );
}
