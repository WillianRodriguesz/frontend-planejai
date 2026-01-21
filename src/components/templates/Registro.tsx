import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  User,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  Check,
  RefreshCw,
} from "lucide-react";
import BotaoSalvar from "../atomos/BotaoSalvar";
import Toast from "../atomos/Toast";
import { useLoading } from "../../contexts/LoadingContext";
import { useUsuario } from "../../hooks/useUsuario";
import { useToast } from "../../hooks/useToast";
import { verificarEmail, reenviarCodigo } from "../../api/authApi";

export default function Registro() {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
  const [focado, setFocado] = useState<string | null>(null);
  const [aceitouTodosTermos, setAceitouTodosTermos] = useState(false);

  const handleAbrirTermo = () => {
    navigate("/termos");
  };
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { criarUsuario, loading } = useUsuario();
  const { toasts, success, error: showError, hideToast } = useToast();

  const [registroSucesso, setRegistroSucesso] = useState(false);
  const [aguardandoVerificacao, setAguardandoVerificacao] = useState(false);
  const [codigo, setCodigo] = useState(["", "", "", "", "", ""]);
  const [countdownReenvio, setCountdownReenvio] = useState(0);
  const [podeReenviar, setPodeReenviar] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdownReenvio > 0) {
      const timer = setTimeout(() => {
        setCountdownReenvio(countdownReenvio - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdownReenvio === 0 && aguardandoVerificacao) {
      setPodeReenviar(true);
    }
  }, [countdownReenvio, aguardandoVerificacao]);

  const handleRegistro = async (e: React.FormEvent) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      showError("As senhas não coincidem.");
      return;
    }

    if (!aceitouTodosTermos) {
      showError("Você deve aceitar todos os termos para criar a conta.");
      return;
    }

    showLoading("Registrando...", "Criando sua conta");
    try {
      await criarUsuario({
        nome,
        email,
        telefone,
        senha,
        aceitouLgpd: true,
        aceitouTermosUso: true,
        aceitouPoliticaPrivacidade: true,
      });
      setAguardandoVerificacao(true);
      setCountdownReenvio(60);
      setPodeReenviar(false);
      success(
        "Conta criada! Verifique seu email para o código de verificação.",
      );
    } catch (err) {
      showError(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente.",
      );
    } finally {
      hideLoading();
    }
  };

  const handleVerificarCodigo = async (e: React.FormEvent) => {
    e.preventDefault();

    const codigoCompleto = codigo.join("");
    if (codigoCompleto.length !== 6) {
      showError("O código deve ter 6 caracteres.");
      return;
    }

    showLoading("Verificando...", "Validando código");
    try {
      await verificarEmail({ email, codigo: codigoCompleto });
      setAguardandoVerificacao(false);
      setRegistroSucesso(true);
      success("Email verificado com sucesso!");
      navigate("/login");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao verificar código";

      // Mensagens específicas para erros comuns
      if (errorMessage.includes("Código de verificação incorreto")) {
        showError(
          "Código incorreto. Verifique o código enviado para seu email e tente novamente.",
        );
      } else if (
        errorMessage.includes("expirado") ||
        errorMessage.includes("expirou")
      ) {
        showError("Código expirado. Solicite um novo código.");
      } else {
        showError(errorMessage);
      }
    } finally {
      hideLoading();
    }
  };

  const handleCodigoChange = (index: number, value: string) => {
    // Apenas alfanuméricos em maiúsculo
    const sanitized = value.toUpperCase().replace(/[^A-Z0-9]/g, "");

    if (sanitized.length > 1) {
      // Usuário colou um código
      const chars = sanitized.slice(0, 6).split("");
      const newCodigo = [...codigo];
      chars.forEach((char, i) => {
        if (index + i < 6) {
          newCodigo[index + i] = char;
        }
      });
      setCodigo(newCodigo);

      const nextIndex = Math.min(index + chars.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else if (sanitized.length === 1) {
      const newCodigo = [...codigo];
      newCodigo[index] = sanitized;
      setCodigo(newCodigo);

      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      const newCodigo = [...codigo];
      newCodigo[index] = "";
      setCodigo(newCodigo);
    }
  };

  const handleCodigoKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleReenviarCodigo = async () => {
    if (!podeReenviar) return;

    showLoading("Reenviando...", "Enviando novo código");
    try {
      await reenviarCodigo({ email });
      setCodigo(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setCountdownReenvio(60);
      setPodeReenviar(false);
      success("Novo código enviado para seu email!");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao reenviar código";

      if (errorMessage.includes("muitos")) {
        showError(
          "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.",
        );
      } else {
        showError(errorMessage);
      }
    } finally {
      hideLoading();
    }
  };

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
      {registroSucesso ? (
        <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 flex flex-col items-center justify-center text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mb-4 animate-pulse" />
          <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4">
            Email verificado com sucesso!
          </h1>
          <p className="text-gray-400 text-base md:text-base font-medium mb-6">
            Sua conta foi ativada e está pronta para uso.
          </p>
          <a
            href="/home"
            className="text-purple-400 hover:text-purple-300 font-semibold text-base underline"
          >
            Ir para a página inicial
          </a>
        </div>
      ) : aguardandoVerificacao ? (
        <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 flex flex-col">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-3">
              Verificar Email
            </h1>
            <p className="text-gray-400 text-base md:text-base font-medium">
              Digite o código de 6 caracteres enviado para{" "}
              <span className="text-purple-400 font-semibold">{email}</span>
            </p>
          </div>
          <form
            className="space-y-6 flex-1 flex flex-col justify-center"
            onSubmit={handleVerificarCodigo}
            noValidate
          >
            <div className="flex justify-center gap-2 md:gap-3">
              {codigo.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  value={digit}
                  onChange={(e) => handleCodigoChange(index, e.target.value)}
                  onKeyDown={(e) => handleCodigoKeyDown(index, e)}
                  maxLength={1}
                  className="w-12 h-14 md:w-11 md:h-13 bg-transparent border-2 border-gray-700 rounded-xl text-2xl md:text-xl text-white text-center font-mono font-bold outline-none transition-all duration-200 focus:border-purple-500 focus:shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                  autoComplete="off"
                />
              ))}
            </div>
            <div className="flex justify-center mt-2">
              <BotaoSalvar
                className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center"
                disabled={codigo.join("").length !== 6}
              >
                Verificar Código
              </BotaoSalvar>
            </div>
          </form>
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={handleReenviarCodigo}
              disabled={!podeReenviar}
              className={`flex items-center justify-center gap-2 text-sm md:text-sm font-semibold mx-auto transition-colors ${
                podeReenviar
                  ? "text-purple-400 hover:text-purple-300 cursor-pointer"
                  : "text-gray-500 cursor-not-allowed"
              }`}
            >
              <RefreshCw
                className={`w-4 h-4 ${!podeReenviar && "opacity-50"}`}
              />
              {countdownReenvio > 0
                ? `Reenviar código em ${countdownReenvio}s`
                : "Reenviar código"}
            </button>
          </div>
          <div className="mt-4 text-center text-gray-400 text-sm md:text-sm">
            Já verificou seu email?{" "}
            <a
              href="/login"
              className="text-purple-400 hover:underline font-semibold"
            >
              Entrar
            </a>
          </div>
        </div>
      ) : (
        <div className="max-w-md md:max-w-96 w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-6 min-h-[450px] md:min-h-[460px]">
          <div className="mb-6 md:mb-6 text-center pb-4">
            <h1 className="text-3xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-2 md:mb-2">
              Criar nova conta
            </h1>
            <p className="text-gray-400 text-base md:text-base font-medium">
              Preencha os dados para registrar-se
            </p>
          </div>
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
                  focado === "confirmarSenha"
                    ? "border-purple-500 shadow-md"
                    : ""
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
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="aceitou-todos-termos"
                    checked={aceitouTodosTermos}
                    onChange={(e) => setAceitouTodosTermos(e.target.checked)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 border-2 rounded-md flex items-center justify-center cursor-pointer transition-all duration-200 ${
                      aceitouTodosTermos
                        ? "bg-purple-600 border-purple-600"
                        : "border-gray-600 hover:border-purple-400"
                    }`}
                    onClick={() => setAceitouTodosTermos(!aceitouTodosTermos)}
                  >
                    {aceitouTodosTermos && (
                      <Check className="w-4 h-4 text-white transform scale-100 transition-transform duration-200" />
                    )}
                  </div>
                </div>
                <label
                  htmlFor="aceitou-todos-termos"
                  className="text-sm text-gray-300 cursor-pointer"
                  onClick={() => setAceitouTodosTermos(!aceitouTodosTermos)}
                >
                  Aceito todos os{" "}
                  <button
                    type="button"
                    className="text-purple-400 hover:underline font-medium"
                    onClick={handleAbrirTermo}
                  >
                    termos e políticas
                  </button>
                </label>
              </div>
            </div>
            <div className="flex justify-center">
              <BotaoSalvar
                className="text-sm md:text-sm h-10 md:h-9 w-full max-w-xs flex items-center justify-center"
                disabled={!!loading}
              >
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
      )}
    </div>
  );
}
