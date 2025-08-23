import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const meses = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

interface MenuSelecionadorMesProps {
  onChange?: (data: { mes: string; ano: number }) => void;
  mesInicial?: number;
  anoInicial?: number;
}

const MenuSelecionadorMes = ({
  onChange,
  mesInicial = new Date().getMonth(),
  anoInicial = new Date().getFullYear(),
}: MenuSelecionadorMesProps) => {
  const [mesIndex, setMesIndex] = useState(mesInicial);
  const [ano, setAno] = useState(anoInicial);

  const getMesesVisiveis = () => {
    const visiveis = [];
    for (let i = -2; i <= 2; i++) {
      let calculatedMesIndex = mesIndex + i;
      let calculatedAno = ano;

      if (calculatedMesIndex < 0) {
        calculatedMesIndex += 12;
        calculatedAno--;
      } else if (calculatedMesIndex > 11) {
        calculatedMesIndex -= 12;
        calculatedAno++;
      }

      visiveis.push({
        mes: meses[calculatedMesIndex],
        index: calculatedMesIndex,
        position: i,
        ano: calculatedAno,
      });
    }
    return visiveis;
  };

  const navegarMes = (direcao: "anterior" | "proximo") => {
    if (direcao === "anterior") {
      if (mesIndex === 0) {
        setMesIndex(11);
        setAno(ano - 1);
      } else {
        setMesIndex(mesIndex - 1);
      }
    } else {
      if (mesIndex === 11) {
        setMesIndex(0);
        setAno(ano + 1);
      } else {
        setMesIndex(mesIndex + 1);
      }
    }

    if (onChange) {
      onChange({
        mes: meses[
          direcao === "anterior"
            ? mesIndex === 0
              ? 11
              : mesIndex - 1
            : mesIndex === 11
            ? 0
            : mesIndex + 1
        ],
        ano:
          direcao === "anterior"
            ? mesIndex === 0
              ? ano - 1
              : ano
            : mesIndex === 11
            ? ano + 1
            : ano,
      });
    }
  };

  const selecionarMes = (index: number, anoSelecionado: number) => {
    setMesIndex(index);
    setAno(anoSelecionado);

    if (onChange) {
      onChange({ mes: meses[index], ano: anoSelecionado });
    }
  };

  const mesesVisiveis = getMesesVisiveis();

  return (
    <div className="flex items-center justify-center w-full max-w-4xl mx-auto pt-4 pb-2">
      {/* Botão de navegação - Anterior */}
      <button
        onClick={() => navegarMes("anterior")}
        className="h-10 w-10 bg-transparent border-none outline-none cursor-pointer"
      >
        <ChevronLeft className="h-5 w-5 text-white" />
      </button>

      {/* Container do carrossel de meses */}
      <div className="flex items-center justify-center mx-4 sm:mx-6 md:mx-8 relative">
        <div className="flex items-center gap-4 sm:gap-6">
          {mesesVisiveis.map((item, index) => {
            const isCentral = item.position === 0;
            const isAdjacente = Math.abs(item.position) === 1;
            const isExterno = Math.abs(item.position) === 2;

            return (
              <div
                key={`${item.index}-${index}`}
                className={`
                  transition-all duration-300 ease-in-out cursor-pointer transform
                  ${
                    isCentral
                      ? "scale-125"
                      : isAdjacente
                      ? "scale-100"
                      : "scale-85"
                  }
                  ${
                    isExterno
                      ? "opacity-40"
                      : isCentral
                      ? "opacity-100"
                      : "opacity-70"
                  }
                  active:scale-110
                `}
                onClick={() => selecionarMes(item.index, item.ano)}
              >
                <div className="text-center min-w-[60px] transition-all duration-300 ease-in-out">
                  <span
                    className={`
                      block font-medium transition-all duration-300 ease-in-out
                      ${
                        isCentral
                          ? "text-white text-xl font-semibold"
                          : "text-white/60 text-base"
                      }
                    `}
                  >
                    {item.mes.substring(0, 3)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão de navegação - Próximo */}
      <button
        onClick={() => navegarMes("proximo")}
        className="h-10 w-10 bg-transparent border-none outline-none cursor-pointer"
      >
        <ChevronRight className="h-5 w-5 text-white" />
      </button>
    </div>
  );
};

export default MenuSelecionadorMes;
