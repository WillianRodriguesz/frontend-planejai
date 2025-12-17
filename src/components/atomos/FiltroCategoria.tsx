import { useState, useRef, useEffect } from "react";
import { Tag } from "lucide-react";
import { useCategorias } from "../../hooks/useCategorias";

interface FiltroCategoriaProps {
  onAplicar: (idCategoria: string, nomeCategoria: string) => void;
}

const FiltroCategoria = ({ onAplicar }: FiltroCategoriaProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { categorias, loading } = useCategorias();

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

  const handleCategoriaClick = (id: number, nome: string) => {
    onAplicar(id.toString(), nome);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Filtrar por categoria"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 flex items-center justify-center gap-2 md:px-4"
      >
        <Tag className="h-5 w-5" />
        <span className="hidden md:inline-block text-sm font-medium">
          Categoria
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-56 bg-card/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-4 text-center">
              <span className="text-gray-400 text-sm">Carregando...</span>
            </div>
          ) : (
            <div className="p-2 max-h-80 overflow-y-auto">
              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() =>
                    handleCategoriaClick(categoria.id, categoria.nome)
                  }
                  className="w-full flex items-center justify-between px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
                >
                  <span>{categoria.nome}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltroCategoria;
