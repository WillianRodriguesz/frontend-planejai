import { useState, useEffect } from "react";
import { useCarteira } from "../contexts/CarteiraContext";
// import { buscarGastosPorCategoria } from '../api/lancamentosApi';

interface GastosCategoria {
  nome: string;
  valor: number;
  cor?: string;
}

interface UseGastosCategoriaReturn {
  dados: GastosCategoria[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Dados mockados para desenvolvimento
const dadosMockados: GastosCategoria[] = [
  { nome: "Alimentação", valor: 850.5 },
  { nome: "Transporte", valor: 320.0 },
  { nome: "Lazer", valor: 150.0 },
  { nome: "Saúde", valor: 200.0 },
  { nome: "Educação", valor: 120.0 },
  { nome: "Outros", valor: 95.3 },
];

export const useGastosCategoria = (
  mes: number,
  ano: number
): UseGastosCategoriaReturn => {
  const { idCarteira } = useCarteira();
  const [dados, setDados] = useState<GastosCategoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGastos = async () => {
    if (!idCarteira) {
      setDados([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // TODO: Descomentar quando o endpoint estiver pronto
      // const response = await buscarGastosPorCategoria(idCarteira, mes, ano);
      // setDados(response);

      // Dados mockados por enquanto
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simular delay da API
      setDados(dadosMockados);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao carregar gastos por categoria"
      );
      setDados([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGastos();
  }, [idCarteira, mes, ano]);

  return {
    dados,
    loading,
    error,
    refetch: fetchGastos,
  };
};
