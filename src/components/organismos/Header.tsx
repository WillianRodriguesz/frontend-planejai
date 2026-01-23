import { Wallet, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MenuHamburguer from "../moleculas/MenuHamburguer";
import { useAuth } from "../../hooks/useAuth";
import { useCarteira } from "../../contexts/CarteiraContext";

const Header = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { setIdCarteira } = useCarteira();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    } finally {
      // Limpar dados locais independentemente do resultado da API
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      setIdCarteira(null);
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md gradient-border-bottom shadow-lg shadow-purple-600/30 h-[60px]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MenuHamburguer />
          <img
            src="/logo-planejai.png"
            alt="Planejai Logo"
            className="w-12 h-12 cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => navigate("/home")}
            aria-label="Ir para home"
            tabIndex={0}
            role="button"
          />
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-[#6366f1] bg-clip-text text-transparent select-none cursor-pointer"
            onClick={() => navigate("/home")}
            aria-label="Ir para home"
            tabIndex={0}
            role="button"
          >
            Planejai
          </h1>
        </div>

        <div className="flex items-center">
          {/* Botão de Logout - Apenas Mobile */}
          <button
            onClick={handleLogout}
            className="md:hidden flex items-center justify-center group"
            aria-label="Sair"
            title="Sair"
          >
            <LogOut className="w-6 h-6 text-gray-400 group-hover:text-gray-300 group-hover:scale-110 transition-all" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
