import { useState, useEffect, useRef } from "react";
import { Menu, Home, User, BarChart3, LogOut, X } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCarteira } from "../../contexts/CarteiraContext";
import { useUsuarioStore } from "../../stores/useUsuarioStore";
import { useAuth } from "../../hooks/useAuth";

export default function MenuHamburguer() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIdCarteira } = useCarteira();
  const { usuario } = useUsuarioStore();
  const { logout } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Não mostrar nas páginas de login e registro
  if (location.pathname === "/login" || location.pathname === "/registro") {
    return null;
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

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
      setIsOpen(false);
    }
  };

  const handleNavigation = (path: string) => {
    if (path === "/detalhes-gastos") {
      const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
      const anoAtual = new Date().getFullYear();
      navigate(`/detalhes-gastos?mes=${mesAtual}&ano=${anoAtual}`);
    } else {
      navigate(path);
    }
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu"
        className="hidden md:block text-white hover:text-violet-600 hover:bg-purple-600/15 p-2 rounded-xl transition-all duration-200 bg-transparent focus:outline-none border-none outline-none ring-0 focus:ring-0"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="hidden md:block fixed inset-0 top-[60px] bg-black/60 backdrop-blur-sm z-[44]" />
      )}

      {/* Sidebar Menu */}
      <div
        ref={menuRef}
        className={`hidden md:block fixed top-[60px] left-0 h-[calc(100vh-60px)] w-80 bg-[#1D1D1E] border-r border-purple-500/30 shadow-2xl shadow-purple-900/50 z-[45] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header do Menu */}
          <div className="relative px-6 py-5 border-b border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👋</span>
              <div>
                <p className="text-xs text-gray-400 font-medium">Olá,</p>
                <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                  {usuario?.nome || "Usuário"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-purple-400 hover:bg-purple-600/15 p-1.5 rounded-lg transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Itens do Menu */}
          <div className="flex-1 p-6 space-y-2">
            <button
              onClick={() => handleNavigation("/home")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-base ${
                location.pathname === "/home"
                  ? "bg-purple-600/30 text-purple-400 border border-purple-500/50"
                  : "text-gray-300 hover:bg-purple-600/20 hover:text-purple-400"
              }`}
            >
              <Home className="h-6 w-6" />
              <span className="font-medium">Home</span>
            </button>

            <button
              onClick={() => handleNavigation("/configuracoes")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-base ${
                location.pathname === "/configuracoes"
                  ? "bg-purple-600/30 text-purple-400 border border-purple-500/50"
                  : "text-gray-300 hover:bg-purple-600/20 hover:text-purple-400"
              }`}
            >
              <User className="h-6 w-6" />
              <span className="font-medium">Perfil</span>
            </button>

            <button
              onClick={() => handleNavigation("/detalhes-gastos")}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl transition-all text-base ${
                location.pathname === "/detalhes-gastos"
                  ? "bg-purple-600/30 text-purple-400 border border-purple-500/50"
                  : "text-gray-300 hover:bg-purple-600/20 hover:text-purple-400"
              }`}
            >
              <BarChart3 className="h-6 w-6" />
              <span className="font-medium">Gastos</span>
            </button>
          </div>

          {/* Botão Sair (fixo no bottom) */}
          <div className="px-6 pb-6 pt-3 border-t border-purple-500/20">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-4 px-6 py-4 text-red-400 hover:bg-red-600/20 hover:text-red-300 rounded-xl transition-all text-base font-medium"
            >
              <LogOut className="h-6 w-6" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
