import { useState, useEffect } from "react";
import { useCarteira } from "../contexts/CarteiraContext";
import { buscarGastosMensais } from "../api/gastosApi";

interface GastosCategoria {
  nome: string;
  valor: number;
  cor?: string;
  categoria?: {
    id: number;
    nome: string;
  };
}

interface UseGastosCategoriaReturn {
  dados: GastosCategoria[];
  totalGastos: number;
  relacaoMesAnterior: {
    diferencaGastosMensal: number;
    mensagemEconomia: string;
  } | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useGastosCategoria = (
  mes: number,
  ano: number
): UseGastosCategoriaReturn => {
  const { idCarteira } = useCarteira();
  const [dados, setDados] = useState<GastosCategoria[]>([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [relacaoMesAnterior, setRelacaoMesAnterior] = useState<{
    diferencaGastosMensal: number;
    mensagemEconomia: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGastos = async () => {
    if (!idCarteira) {
      setDados([]);
      setTotalGastos(0);
      setRelacaoMesAnterior(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const mesFormatado = mes.toString().padStart(2, "0");
      const mesAno = `${ano}-${mesFormatado}`;

      const response = await buscarGastosMensais(idCarteira, mesAno);

      const dadosFormatados: GastosCategoria[] =
        response.gastosPorCategoria.map((gasto) => ({
          nome: gasto.categoria.nome,
          valor: gasto.valor,
          categoria: gasto.categoria,
        }));

      setDados(dadosFormatados);
      setTotalGastos(response.totalGastos);
      setRelacaoMesAnterior(response.relacaoMesAnterior || null);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar gastos por categoria"
      );
      setDados([]);
      setTotalGastos(0);
      setRelacaoMesAnterior(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCarteira, mes, ano]);

  return {
    dados,
    totalGastos,
    relacaoMesAnterior,
    loading,
    error,
    refetch: fetchGastos,
  };
};
