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

  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50; 

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

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null); 
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      navegarMes("proximo");
    } else if (isRightSwipe) {
      navegarMes("anterior");
    }
  };

  const mesesVisiveis = getMesesVisiveis();

  return (
    <div className="flex items-center justify-center w-full max-w-full mx-auto sm:pt-5 sm:pb-3">
      <button
        onClick={() => navegarMes("anterior")}
        className="flex justify-start items-center h-12 w-12 sm:h-12 sm:w-12 p-2 sm:p-2 bg-transparent border-none outline-none cursor-pointer"
      >
        <ChevronLeft className="h-6 w-6 sm:h-6 sm:w-6 text-white" />
      </button>

      <div
        className="flex items-center justify-center mx-3 sm:mx-5 md:mx-6 relative touch-pan-x"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div className="flex items-center gap-3 xs:gap-4 sm:gap-5 md:gap-6">
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
                      ? "scale-110 sm:scale-125"
                      : isAdjacente
                      ? "scale-100"
                      : "scale-90 sm:scale-85"
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
                <div className="text-center min-w-[45px] xs:min-w-[55px] sm:min-w-[65px] transition-all duration-300 ease-in-out">
                  <span
                    className={`
                      block font-medium transition-all duration-300 ease-in-out
                      ${
                        isCentral
                          ? "text-white text-lg xs:text-xl sm:text-2xl font-semibold"
                          : "text-white/60 text-base xs:text-lg sm:text-xl"
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

      <button
        onClick={() => navegarMes("proximo")}
        className="flex justify-end items-center h-12 w-12 sm:h-12 sm:w-12 p-2 sm:p-2 bg-transparent border-none outline-none cursor-pointer"
      >
        <ChevronRight className="h-6 w-6 sm:h-6 sm:w-6 text-white" />
      </button>
    </div>
  );
};

export default MenuSelecionadorMes;
