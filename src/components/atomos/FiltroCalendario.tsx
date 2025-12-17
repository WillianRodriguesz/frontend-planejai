import { useState, useRef, useEffect } from "react";
import { Calendar } from "lucide-react";
import { obterPrimeiroeUltimoDiaDoMes } from "../../utils/dateUtils";

interface FiltroCalendarioProps {
  onAplicar: (dataInicio: string, dataFim: string, label: string) => void;
}

const FiltroCalendario = ({ onAplicar }: FiltroCalendarioProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [mostrarPersonalizado, setMostrarPersonalizado] = useState(false);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setMostrarPersonalizado(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const calcularUltimos7Dias = () => {
    const hoje = new Date();
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(hoje.getDate() - 7);

    return {
      dataInicio: seteDiasAtras.toISOString().split("T")[0],
      dataFim: hoje.toISOString().split("T")[0],
    };
  };

  const calcularUltimos30Dias = () => {
    const hoje = new Date();
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(hoje.getDate() - 30);

    return {
      dataInicio: trintaDiasAtras.toISOString().split("T")[0],
      dataFim: hoje.toISOString().split("T")[0],
    };
  };

  const calcularMesAtual = () => {
    const hoje = new Date();
    return obterPrimeiroeUltimoDiaDoMes(
      hoje.getMonth() + 1,
      hoje.getFullYear()
    );
  };

  const calcularMesAnterior = () => {
    const hoje = new Date();
    const mesAnterior = hoje.getMonth() === 0 ? 12 : hoje.getMonth();
    const anoAnterior =
      hoje.getMonth() === 0 ? hoje.getFullYear() - 1 : hoje.getFullYear();

    return obterPrimeiroeUltimoDiaDoMes(mesAnterior, anoAnterior);
  };

  const handleOpcaoClick = (opcao: string) => {
    if (opcao === "personalizado") {
      setMostrarPersonalizado(true);
      return;
    }

    let datas = { dataInicio: "", dataFim: "" };
    let label = "";

    switch (opcao) {
      case "ultimos7":
        datas = calcularUltimos7Dias();
        label = "Últimos 7 dias";
        break;
      case "ultimos30":
        datas = calcularUltimos30Dias();
        label = "Últimos 30 dias";
        break;
      case "mesAtual":
        datas = calcularMesAtual();
        label = "Mês atual";
        break;
      case "mesAnterior":
        datas = calcularMesAnterior();
        label = "Mês anterior";
        break;
    }

    onAplicar(datas.dataInicio, datas.dataFim, label);
    setIsOpen(false);
  };

  const handleAplicarPersonalizado = () => {
    if (dataInicio && dataFim) {
      const inicio = new Date(dataInicio);
      const fim = new Date(dataFim);
      const label = `${inicio.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })} - ${fim.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      })}`;
      onAplicar(dataInicio, dataFim, label);
      setIsOpen(false);
      setMostrarPersonalizado(false);
      setDataInicio("");
      setDataFim("");
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        aria-label="Filtrar por data"
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:text-violet-600 bg-purple-600/15 p-2 rounded-xl transition-all duration-200 focus:outline-none border-none outline-none ring-0 focus:ring-0 h-10 flex items-center justify-center gap-2 md:px-4"
      >
        <Calendar className="h-5 w-5" />
        <span className="hidden md:inline-block text-sm font-medium">
          Período
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-12 right-0 z-50 w-64 bg-card/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-xl overflow-hidden">
          {!mostrarPersonalizado ? (
            <div className="p-2">
              <button
                onClick={() => handleOpcaoClick("ultimos7")}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
              >
                Últimos 7 dias
              </button>
              <button
                onClick={() => handleOpcaoClick("ultimos30")}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => handleOpcaoClick("mesAtual")}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
              >
                Mês atual
              </button>
              <button
                onClick={() => handleOpcaoClick("mesAnterior")}
                className="w-full text-left px-4 py-3 text-gray-300 hover:bg-purple-600/20 rounded-xl transition-colors text-sm"
              >
                Mês anterior
              </button>
              <div className="border-t border-purple-500/20 my-2"></div>
              <button
                onClick={() => handleOpcaoClick("personalizado")}
                className="w-full text-left px-4 py-3 text-purple-400 hover:bg-purple-600/20 rounded-xl transition-colors text-sm font-medium"
              >
                Personalizado
              </button>
            </div>
          ) : (
            <div className="p-4">
              <h3 className="text-white text-sm font-semibold mb-3">
                Período personalizado
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">
                    Data início
                  </label>
                  <input
                    type="date"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                    className="w-full bg-transparent border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div>
                  <label className="text-gray-400 text-xs mb-1 block">
                    Data fim
                  </label>
                  <input
                    type="date"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                    className="w-full bg-transparent border border-purple-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500/60"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      setMostrarPersonalizado(false);
                      setDataInicio("");
                      setDataFim("");
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600/20 text-gray-300 rounded-lg hover:bg-gray-600/30 transition-colors text-sm"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={handleAplicarPersonalizado}
                    disabled={!dataInicio || !dataFim}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FiltroCalendario;
