import { Search } from "lucide-react";

interface CampoBuscaProps {
  valor: string;
  onChange: (valor: string) => void;
  placeholder?: string;
}

const CampoBusca = ({
  valor,
  onChange,
  placeholder = "Buscar por título ou descrição...",
}: CampoBuscaProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        className="w-full h-11 text-white hover:text-violet-600 bg-card/80 backdrop-blur-xl border-solid border border-purple-500/30 rounded-xl pl-10 pr-4 placeholder-gray-400 focus:outline-none focus:border-purple-500/60 transition-all duration-200 text-sm"
      />
    </div>
  );
};

export default CampoBusca;
