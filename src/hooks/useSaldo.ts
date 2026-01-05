import { useState, useEffect } from "react";
import type { SaldoMensalDto } from "../types/saldo";
import { useCarteira } from "../contexts/CarteiraContext";
import { buscarSaldoMensal } from "../api/saldoApi";

interface UseSaldoParams {
  mes: number;
  ano: number;
}

interface UseSaldoReturn {
  saldo: SaldoMensalDto | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useSaldo = ({ mes, ano }: UseSaldoParams): UseSaldoReturn => {
  const { idCarteira } = useCarteira();
  const [saldo, setSaldo] = useState<SaldoMensalDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSaldo = async () => {
    if (!idCarteira) {
      setError("ID da carteira não encontrado");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Formatar a data como YYYY-MM-DD (adiciona o dia 01)
      const dataFormatada = `${ano}-${String(mes).padStart(2, "0")}-01`;

      // Chama a API através da camada de API
      const data = await buscarSaldoMensal(idCarteira, dataFormatada);
      setSaldo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setSaldo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idCarteira) {
      fetchSaldo();
    } else {
      setLoading(true);
      setSaldo(null);
      setError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCarteira, mes, ano]);

  return {
    saldo,
    loading,
    error,
    refetch: fetchSaldo,
  };
};
