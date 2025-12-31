import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, Phone, Lock, Eye, EyeOff } from "lucide-react";
import BotaoSalvar from "../atomos/BotaoSalvar";
import { useLoading } from "../../contexts/LoadingContext";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [focado, setFocado] = useState<string | null>(null);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();

  const [mensagem, setMensagem] = useState("");
  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem("");
    showLoading("Registrando...", "Enviando confirmação de e-mail");
    try {
      // Simular delay de registro
      await new Promise((resolve) => setTimeout(resolve, 2000));
      // TODO: Implementar envio de e-mail de confirmação
      setMensagem(
        `Um e-mail de confirmação foi enviado para ${email}. Verifique sua caixa de entrada.`
      );
      setTimeout(() => {
        setMensagem("");
        navigate("/login");
      }, 3500);
    } finally {
      hideLoading();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex items-center justify-center px-4">
      <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 min-h-[450px] md:min-h-[460px]">
        <div className="mb-6 md:mb-6 text-center pb-4">
          <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 md:mb-2">
            Criar nova conta
          </h1>
          <p className="text-gray-400 text-base md:text-base font-medium">
            Preencha os dados para registrar-se
          </p>
        </div>
        {mensagem && (
          <div className="mb-4 p-3 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-300 text-center font-semibold shadow-md animate-fade-in">
            {mensagem}
          </div>
        )}
        <form
          className="space-y-4 md:space-y-4"
          onSubmit={handleRegistro}
          noValidate
        >
          {/* ...campos do formulário... */}
          <div className="relative">
            <input
              type="text"
              id="registro-nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              onFocus={() => setFocado("nome")}
              onBlur={() => setFocado(null)}
              required
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "nome" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="name"
            />
            <User
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "nome" || nome
                  ? "text-purple-400 drop-shadow-[0_0_8px_#a78bfa]"
                  : "text-gray-400"
              }`}
            />
            <label
              htmlFor="registro-nome"
              className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                ${
                  focado === "nome" || nome
                    ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                    : "top-1/2 -translate-y-1/2 scale-100"
                }`}
            >
              Nome
            </label>
          </div>
          <div className="relative">
            <input
              type="tel"
              id="registro-telefone"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              onFocus={() => setFocado("telefone")}
              onBlur={() => setFocado(null)}
              required
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "telefone" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="tel"
            />
            <Phone
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "telefone" || telefone
                  ? "text-purple-400 drop-shadow-[0_0_8px_#a78bfa]"
                  : "text-gray-400"
              }`}
            />
            <label
              htmlFor="registro-telefone"
              className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                ${
                  focado === "telefone" || telefone
                    ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                    : "top-1/2 -translate-y-1/2 scale-100"
                }`}
            >
              Telefone
            </label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="registro-email"
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
                  ? "text-purple-400 drop-shadow-[0_0_8px_#a78bfa]"
                  : "text-gray-400"
              }`}
            />
            <label
              htmlFor="registro-email"
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
              id="registro-senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onFocus={() => setFocado("senha")}
              onBlur={() => setFocado(null)}
              required
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pr-11 md:pr-10 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "senha" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="new-password"
            />
            <Lock
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "senha" || senha
                  ? "text-purple-400 drop-shadow-[0_0_8px_#a78bfa]"
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
              htmlFor="registro-senha"
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
          <div className="relative">
            <input
              type={mostrarConfirmarSenha ? "text" : "password"}
              id="registro-confirmar-senha"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              onFocus={() => setFocado("confirmarSenha")}
              onBlur={() => setFocado(null)}
              required
              className={`peer w-full bg-transparent border-2 border-gray-700 rounded-xl px-4 md:px-3.5 pl-10 md:pl-9 pr-11 md:pr-10 pt-4 md:pt-3.5 pb-3 md:pb-3.5 text-sm md:text-sm text-white outline-none transition-all duration-200 focus:border-purple-500 ${
                focado === "confirmarSenha" ? "border-purple-500 shadow-md" : ""
              }`}
              placeholder=" "
              autoComplete="new-password"
            />
            <Lock
              className={`absolute left-3 md:left-3 top-1/2 -translate-y-1/2 w-4 h-4 md:w-4 md:h-4 transition-colors duration-200 ${
                focado === "confirmarSenha" || confirmarSenha
                  ? "text-purple-400 drop-shadow-[0_0_8px_#a78bfa]"
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
              htmlFor="registro-confirmar-senha"
              className={`absolute left-8 md:left-9 text-xs font-medium text-gray-400 pointer-events-none transition-all duration-200
                ${
                  focado === "confirmarSenha" || confirmarSenha
                    ? "top-0 -translate-y-1.5 scale-90 bg-card px-1 text-purple-400"
                    : "top-1/2 -translate-y-1/2 scale-100"
                }`}
            >
              Confirmar Senha
            </label>
          </div>
          <div className="flex justify-center">
            <BotaoSalvar className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center">
              Criar conta
            </BotaoSalvar>
          </div>
        </form>
        <div className="mt-4 md:mt-5 text-center text-gray-400 text-sm md:text-sm">
          Já tem uma conta?{" "}
          <a
            href="/login"
            className="text-purple-400 hover:underline font-semibold"
          >
            Entrar
          </a>
        </div>
      </div>
    </div>
  );
}
