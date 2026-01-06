import { User, Plus, BarChart3, Home } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function MenuInferiorMobile() {
  const navigate = useNavigate();
  const location = useLocation();

  // Não mostrar o menu nas páginas de login e registro
  if (location.pathname === "/login" || location.pathname === "/registro") {
    return null;
  }

  const isHome = location.pathname === "/home";

  const handleAddClick = () => {
    const lancamentosElement = document.querySelector(
      "[data-lancamentos-add-button]"
    ) as HTMLButtonElement;
    lancamentosElement?.click();
  };

  const handleGastosClick = () => {
    // Se já estiver na página de detalhes, não faz nada
    if (location.pathname === "/detalhes-gastos") return;

    // Tenta obter o mês e ano atual da Home ou usa o mês atual
    const mesAtual = new Date().toLocaleString("pt-BR", { month: "long" });
    const anoAtual = new Date().getFullYear();
    navigate(`/detalhes-gastos?mes=${mesAtual}&ano=${anoAtual}`);
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0a0118]/98 backdrop-blur-2xl border-t border-purple-500/20 shadow-[0_-10px_40px_-10px_rgba(168,85,247,0.4)]">
      <div className="flex items-center justify-around px-8 py-2 pb-safe max-w-md mx-auto">
        <button
          onClick={() => navigate("/configuracoes")}
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-purple-400 active:scale-95 transition-all touch-manipulation"
        >
          <div className="relative">
            <User className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-xs font-medium">Perfil</span>
        </button>

        {isHome ? (
          <button
            onClick={handleAddClick}
            className="relative flex items-center justify-center -mt-6 w-14 h-14 bg-gradient-to-br from-purple-600 via-purple-600 to-purple-700 text-white rounded-full shadow-[0_8px_32px_rgba(168,85,247,0.5)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.6)] active:scale-95 transition-all touch-manipulation"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <Plus className="w-6 h-6 relative z-10" strokeWidth={2.5} />
          </button>
        ) : (
          <button
            onClick={() => navigate("/home")}
            className="relative flex items-center justify-center -mt-6 w-14 h-14 bg-gradient-to-br from-purple-600 via-purple-600 to-purple-700 text-white rounded-full shadow-[0_8px_32px_rgba(168,85,247,0.5)] hover:shadow-[0_8px_40px_rgba(168,85,247,0.6)] active:scale-95 transition-all touch-manipulation"
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
            <Home className="w-6 h-6 relative z-10" strokeWidth={2.5} />
          </button>
        )}

        <button
          onClick={handleGastosClick}
          className="flex flex-col items-center gap-1.5 text-gray-400 hover:text-purple-400 active:scale-95 transition-all touch-manipulation"
        >
          <div className="relative">
            <BarChart3 className="w-6 h-6" strokeWidth={2} />
          </div>
          <span className="text-xs font-medium">Gastos</span>
        </button>
      </div>
    </div>
  );
}
