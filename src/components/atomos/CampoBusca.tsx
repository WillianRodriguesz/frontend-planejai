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
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
      <input
        type="text"
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-purple-600/15 border border-purple-500/30 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500/60 transition-colors text-sm"
      />
    </div>
  );
};

export default CampoBusca;
