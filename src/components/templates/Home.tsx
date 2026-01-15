import { Settings } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLancamentos } from "../../hooks/useLancamentos";
import { useSaldo } from "../../hooks/useSaldo";
import { useToast } from "../../hooks/useToast";
import { useGastosCategoria } from "../../hooks/useGastosCategoria";
import {
  converterMesParaNumero,
  obterPrimeiroeUltimoDiaDoMes,
} from "../../utils/dateUtils";
import Toast from "../atomos/Toast";
import CardSaldo from "../moleculas/CardSaldo";
import CardGraficoPizza from "../moleculas/CardGraficoPizza";
import MenuSelecionadorMes from "../moleculas/MenuCalendario";
import Header from "../organismos/Header";
import Lancamentos from "../organismos/Lancamentos";

export default function Home() {
  const navigate = useNavigate();
  const [dataSelecionada, setDataSelecionada] = useState({
    mes: new Date().toLocaleString("pt-BR", { month: "long" }),
    ano: new Date().getFullYear(),
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [filtrosAtuais, setFiltrosAtuais] = useState<{
    categoria: string;
    dataInicio: string;
    dataFim: string;
    tipo: "todos" | "entrada" | "saida";
  }>({
    categoria: "",
    dataInicio: "",
    dataFim: "",
    tipo: "todos",
  });
  const itensPorPagina = isMobile ? 5 : 10;

  const { toasts, success, error: showError, hideToast } = useToast();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPaginaAtual(1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mesNumero = converterMesParaNumero(dataSelecionada.mes);
  const { dataInicio: dataInicioMes, dataFim: dataFimMes } =
    obterPrimeiroeUltimoDiaDoMes(mesNumero, dataSelecionada.ano);

  const buscarTodos =
    filtrosAtuais?.dataInicio === "BUSCAR_TODOS" ||
    filtrosAtuais?.dataFim === "BUSCAR_TODOS";
  const usarDatasPadrao = !filtrosAtuais?.dataInicio && !filtrosAtuais?.dataFim;

  const filtrosApi = useMemo(
    () => ({
      ...(filtrosAtuais?.categoria && {
        idCategoria: parseInt(filtrosAtuais.categoria, 10),
      }),
      ...(!buscarTodos && usarDatasPadrao
        ? { dataInicial: dataInicioMes, dataFinal: dataFimMes }
        : {}),
      ...(filtrosAtuais?.dataInicio &&
        filtrosAtuais.dataInicio !== "BUSCAR_TODOS" && {
          dataInicial: filtrosAtuais.dataInicio,
        }),
      ...(filtrosAtuais?.dataFim &&
        filtrosAtuais.dataFim !== "BUSCAR_TODOS" && {
          dataFinal: filtrosAtuais.dataFim,
        }),
      ...(filtrosAtuais?.tipo &&
        filtrosAtuais.tipo !== "todos" && {
          tipoTransacao: filtrosAtuais.tipo,
        }),
    }),
    [
      filtrosAtuais?.categoria,
      filtrosAtuais?.dataInicio,
      filtrosAtuais?.dataFim,
      filtrosAtuais?.tipo,
      buscarTodos,
      usarDatasPadrao,
      dataInicioMes,
      dataFimMes,
    ]
  );

  useEffect(() => {
    setPaginaAtual(1);
  }, [dataSelecionada.mes, dataSelecionada.ano]);

  const {
    saldo,
    loading,
    error,
    refetch: refetchSaldo,
  } = useSaldo({
    mes: mesNumero,
    ano: dataSelecionada.ano,
  });

  const {
    dados: dadosGrafico,
    loading: loadingGrafico,
    refetch: refetchGrafico,
  } = useGastosCategoria(mesNumero, dataSelecionada.ano);

  const {
    lancamentos,
    loading: loadingLancamentos,
    error: _errorLancamentos,
    hasMore,
    adicionarLancamento: adicionarLancamentoOriginal,
    atualizarLancamento: atualizarLancamentoOriginal,
    deletarLancamento: deletarLancamentoOriginal,
  } = useLancamentos({
    pagina: paginaAtual,
    itensPorPagina: itensPorPagina,
    filtros: filtrosApi,
  });

  const adicionarLancamento = async (novoLancamento: any) => {
    try {
      await adicionarLancamentoOriginal(novoLancamento);
      refetchSaldo();
      refetchGrafico();
      success("Lançamento adicionado com sucesso!");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Erro ao adicionar lançamento"
      );
    }
  };

  const atualizarLancamento = async (lancamento: {
    id: string;
    titulo: string;
    categoria: string;
    valor: number;
    data: string;
    tipo: "entrada" | "saida";
  }) => {
    try {
      const idCategoria = parseInt(lancamento.categoria, 10);
      await atualizarLancamentoOriginal(lancamento.id, {
        idCategoria,
        tipoTransacao: lancamento.tipo,
        valor: lancamento.valor,
        titulo: lancamento.titulo,
        data: lancamento.data,
      });
      refetchSaldo();
      refetchGrafico();
      success("Lançamento atualizado com sucesso!");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Erro ao atualizar lançamento"
      );
    }
  };

  const deletarLancamento = async (idLancamento: string) => {
    try {
      await deletarLancamentoOriginal(idLancamento);
      refetchSaldo();
      refetchGrafico();
      success("Lançamento excluído com sucesso!");
    } catch (err) {
      showError(
        err instanceof Error ? err.message : "Erro ao excluir lançamento"
      );
    }
  };

  const carregarMais = () => {
    setPaginaAtual((prev) => prev + 1);
  };

  const handleFiltrar = (filtros: {
    categoria: string;
    dataInicio: string;
    dataFim: string;
    tipo: "todos" | "entrada" | "saida";
  }) => {
    setFiltrosAtuais(filtros);
    setPaginaAtual(1);
  };

  return (
    <div className="bg-background min-h-screen w-full h-full flex flex-col overflow-x-hidden pb-20 md:pb-0">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
      <Header />
      <div className="min-h-[60px] w-full"></div>

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center">
        <div className="w-full max-w-7xl">
          <div className="w-full z-10 pt-2 menu-altura-ajustada">
            <MenuSelecionadorMes
              onChange={(data) => setDataSelecionada(data)}
              mesInicial={new Date().getMonth()}
              anoInicial={new Date().getFullYear()}
            />
          </div>
          {/* Grid responsivo: 1 coluna no mobile, 2 colunas no desktop */}
          <div className="w-full pt-2 grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="w-full">
              {error ? (
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
                  <p className="text-red-400 font-semibold">
                    Erro ao carregar saldo
                  </p>
                  <p className="text-red-300 text-sm mt-1">{error}</p>
                </div>
              ) : loading ? (
                <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6 relative overflow-hidden h-[220px] lg:h-[280px] flex flex-col justify-between">
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

                  <div className="flex items-center justify-between mb-6">
                    <h2 className="flex items-baseline gap-1">
                      <span className="text-white text-lg font-semibold">
                        {dataSelecionada.mes}
                      </span>
                      <span className="text-gray-400 text-sm">/</span>
                      <span className="text-gray-400 text-sm">
                        {dataSelecionada.ano}
                      </span>
                    </h2>
                    <Settings className="text-gray-400 hover:text-violet-600 cursor-pointer w-5 h-5" />
                  </div>

                  <div className="text-left flex-1 flex flex-col justify-center">
                    <p className="text-gray-400 text-sm mb-2">Saldo do mês</p>
                    <div className="relative h-9 w-40 bg-gray-700/50 rounded overflow-hidden">
                      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="flex flex-col">
                      <span className="text-gray-400 text-sm">Entradas</span>
                      <div className="relative h-5 w-24 bg-gray-700/50 rounded overflow-hidden mt-1">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-gray-400 text-sm">Saídas</span>
                      <div className="relative h-5 w-24 bg-gray-700/50 rounded overflow-hidden mt-1">
                        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : saldo ? (
                <CardSaldo
                  key={`${dataSelecionada.mes}-${dataSelecionada.ano}`}
                  dataMes={dataSelecionada.mes}
                  dataAno={dataSelecionada.ano.toString()}
                  saldo={saldo.saldoMes}
                  saldoEntrada={saldo.entradas}
                  saldoSainda={saldo.saidas}
                />
              ) : null}
            </div>

            <div className="w-full">
              <CardGraficoPizza
                key={`grafico-${dataSelecionada.mes}-${dataSelecionada.ano}`}
                dataMes={dataSelecionada.mes}
                dataAno={dataSelecionada.ano.toString()}
                dados={dadosGrafico}
                loading={loadingGrafico}
                onVerDetalhes={() => {
                  navigate(
                    `/detalhes-gastos?mes=${dataSelecionada.mes}&ano=${dataSelecionada.ano}`
                  );
                }}
              />
            </div>
          </div>

          <Lancamentos
            lancamentos={lancamentos}
            onAdicionarLancamento={adicionarLancamento}
            onAtualizarLancamento={atualizarLancamento}
            onDeletarLancamento={deletarLancamento}
            onCarregarMais={carregarMais}
            onFiltrar={handleFiltrar}
            loading={loadingLancamentos}
            hasMore={hasMore}
            itensPorPagina={itensPorPagina}
          />
        </div>
      </div>
    </div>
  );
}
