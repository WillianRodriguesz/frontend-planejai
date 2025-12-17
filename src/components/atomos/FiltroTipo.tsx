import { useState, useRef, useEffect } from "react";
import { ArrowDownUp, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

interface FiltroTipoProps {
  onAplicar: (tipo: "todos" | "entrada" | "saida", label: string) => void;
}

const FiltroTipo = ({ onAplicar }: FiltroTipoProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleOpcaoClick = (
    tipo: "todos" | "entrada" | "saida",
    label: string
  ) => {
    onAplicar(tipo, label);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Filtrar por tipo"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 flex items-center justify-center gap-2 md:px-4"
      >
        <ArrowDownUp className="h-5 w-5" />
        <span className="hidden md:inline-block text-sm font-medium">Tipo</span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-48 bg-card/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-xl overflow-hidden">
          <div className="p-2">
            <button
              onClick={() => handleOpcaoClick("entrada", "Entradas")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
            >
              <ArrowUpCircle className="h-4 w-4 text-green-500" />
              <span>Entradas</span>
            </button>
            <button
              onClick={() => handleOpcaoClick("saida", "Saídas")}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
            >
              <ArrowDownCircle className="h-4 w-4 text-red-500" />
              <span>Saídas</span>
            </button>
            <div className="border-t border-purple-500/20 my-2"></div>
            <button
              onClick={() => handleOpcaoClick("todos", "Ambos")}
              className="w-full flex items-center gap-3 px-4 py-3 text-purple-400 hover:bg-purple-600/20 rounded-xl transition-colors text-sm font-medium"
            >
              <ArrowDownUp className="h-4 w-4" />
              <span>Ambos</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FiltroTipo;
