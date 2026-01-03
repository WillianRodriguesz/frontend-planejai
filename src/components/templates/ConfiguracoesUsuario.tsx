import { useState, useEffect } from "react";
import { User, Lock, Eye, EyeOff, Save, Camera } from "lucide-react";
import Header from "../organismos/Header";
import CampoOutlined from "../atomos/CampoOutlined";
import Toast from "../atomos/Toast";
import { useUsuario } from "../../hooks/useUsuario";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";

const ConfiguracoesUsuario = () => {
  const { buscarUsuario, atualizarUsuario, loading } = useUsuario();
  const { trocarSenha, loading: loadingAuth } = useAuth();
  const { toasts, success, error: showError, hideToast } = useToast();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

  // Buscar dados do usuário ao carregar o componente
  useEffect(() => {
    const carregarDadosUsuario = async () => {
      try {
        const response = await buscarUsuario();
        setNome(response.usuario.nome);
        setEmail(response.usuario.email);
        setTelefone(response.usuario.telefone || "");
      } catch (err) {
        console.error("Erro ao carregar dados do usuário:", err);
      }
    };

    carregarDadosUsuario();
  }, []);

  const handleSalvarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await atualizarUsuario({
        nome,
        email,
        telefone: telefone || undefined,
      });
      success("Perfil atualizado com sucesso!");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erro ao salvar perfil");
    }
  };

  const handleTrocarSenha = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!senhaAtual) {
      showError("Por favor, digite sua senha atual!");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      showError("As senhas não coincidem!");
      return;
    }

    if (novaSenha.length < 6) {
      showError("A senha deve ter pelo menos 6 caracteres!");
      return;
    }

    try {
      const response = await trocarSenha({
        senhaAtual,
        novaSenha,
      });
      success(response.message || "Senha alterada com sucesso!");
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (err) {
      showError(err instanceof Error ? err.message : "Erro ao trocar senha");
    }
  };

  return (
    <div className="bg-background min-h-screen w-full h-full flex flex-col overflow-x-hidden">
      <Header />
      <div className="min-h-[60px] w-full"></div>

      {/* Toasts modernos */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="space-y-8">
            <div className="mt-8 bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-purple-600 hover:bg-purple-700 rounded-full flex items-center justify-center shadow-lg transition-colors">
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">{nome}</h3>
                  <p className="text-gray-400">{email}</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 md:gap-8 space-y-8 md:space-y-0">
              <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Informações Pessoais
                  </h2>
                </div>

                <form onSubmit={handleSalvarPerfil} className="space-y-6">
                  <CampoOutlined label="Nome Completo">
                    <input
                      type="text"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none text-white"
                      placeholder="Digite seu nome completo"
                    />
                  </CampoOutlined>

                  <CampoOutlined label="E-mail">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none text-white"
                      placeholder="Digite seu e-mail"
                    />
                  </CampoOutlined>

                  <CampoOutlined label="Telefone">
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      className="w-full bg-transparent border-none outline-none focus:outline-none text-white"
                      placeholder="(11) 99999-9999"
                    />
                  </CampoOutlined>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </form>
              </div>

              <div className="bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-white">
                    Segurança
                  </h2>
                </div>

                <form onSubmit={handleTrocarSenha} className="space-y-6">
                  <CampoOutlined label="Senha Atual">
                    <div className="relative">
                      <input
                        type={mostrarSenhaAtual ? "text" : "password"}
                        value={senhaAtual}
                        onChange={(e) => setSenhaAtual(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none text-white pr-10"
                        placeholder="Digite sua senha atual"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {mostrarSenhaAtual ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </CampoOutlined>

                  <CampoOutlined label="Nova Senha">
                    <div className="relative">
                      <input
                        type={mostrarNovaSenha ? "text" : "password"}
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none text-white pr-10"
                        placeholder="Digite sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {mostrarNovaSenha ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </CampoOutlined>

                  <CampoOutlined label="Confirmar Nova Senha">
                    <div className="relative">
                      <input
                        type={mostrarConfirmarSenha ? "text" : "password"}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                        className="w-full bg-transparent border-none outline-none focus:outline-none text-white pr-10"
                        placeholder="Confirme sua nova senha"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setMostrarConfirmarSenha(!mostrarConfirmarSenha)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {mostrarConfirmarSenha ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </CampoOutlined>

                  <button
                    type="submit"
                    disabled={loadingAuth}
                    className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Lock className="w-5 h-5" />
                    {loadingAuth ? "Alterando..." : "Alterar Senha"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfiguracoesUsuario;
