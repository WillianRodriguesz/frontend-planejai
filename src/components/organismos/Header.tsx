import { User, Wallet, LogOut, ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCarteira } from "../../contexts/CarteiraContext";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setIdCarteira } = useCarteira();
  const isConfiguracoes = location.pathname === "/configuracoes";

  const handleLogout = () => {
    // Remove o cookie de autenticação
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    // Reseta o ID da carteira no contexto global
    setIdCarteira(null);
    // Redireciona para login
    navigate("/login");
  };
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md border-b-4 border-purple-600 shadow-lg shadow-purple-600/30 h-[60px]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isConfiguracoes && (
            <button
              onClick={() => navigate("/home")}
              aria-label="Voltar para home"
              className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 mr-2 border-none outline-none ring-0 focus:ring-0 flex items-center justify-center"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          {!isConfiguracoes && (
            <div
              className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/40 ring-1 ring-white/20 hover:scale-105 transition-transform duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-xl cursor-pointer"
              onClick={() => navigate("/")}
              aria-label="Ir para home"
              tabIndex={0}
              role="button"
            >
              <Wallet className="relative text-white w-6 h-6 drop-shadow-lg z-10" />
            </div>
          )}
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent select-none cursor-pointer"
            onClick={() => navigate("/home")}
            aria-label="Ir para home"
            tabIndex={0}
            role="button"
          >
            Planejai
          </h1>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => navigate("/configuracoes")}
            aria-label="Perfil do usuário"
            className="hidden md:block text-white hover:text-violet-600 hover:bg-purple-600/15 p-2 rounded-xl transition-all duration-200 bg-transparent focus:outline-none border-none outline-none ring-0 focus:ring-0"
          >
            <User className="h-6 w-6" />
          </button>

          <button
            aria-label="Sair"
            onClick={handleLogout}
            className="text-white hover:text-violet-600 hover:bg-purple-600/15 p-2 rounded-xl transition-all duration-200 bg-transparent focus:outline-none border-none outline-none ring-0 focus:ring-0"
          >
            <LogOut className="h-6 w-6" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
