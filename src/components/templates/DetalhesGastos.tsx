import { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, TrendingDown, TrendingUp, List, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../organismos/Header";
import CardLancamento from "../moleculas/CardLancamento";
import { useGastosCategoria } from "../../hooks/useGastosCategoria";
import { useLancamentos } from "../../hooks/useLancamentos";
import {
  converterMesParaNumero,
  obterPrimeiroeUltimoDiaDoMes,
} from "../../utils/dateUtils";
import { formataValorBRL } from "../../utils/formataValorBrl";
import { obterIconeCategoria } from "../../utils/categoriaIcones";

export default function DetalhesGastos() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mesParam =
    searchParams.get("mes") ||
    new Date().toLocaleString("pt-BR", { month: "long" });
  const anoParam = parseInt(
    searchParams.get("ano") || new Date().getFullYear().toString()
  );

  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    number | null
  >(null);
  const [nomeCategoriaSelecionada, setNomeCategoriaSelecionada] =
    useState<string>("");

  const mesNumero = converterMesParaNumero(mesParam);
  const { dataInicio: dataInicioMes, dataFim: dataFimMes } =
    obterPrimeiroeUltimoDiaDoMes(mesNumero, anoParam);

  const {
    dados: dadosGrafico,
    totalGastos,
    loading: loadingGrafico,
  } = useGastosCategoria(mesNumero, anoParam);

  const filtrosLancamentos = useMemo(
    () =>
      categoriaSelecionada
        ? {
            idCategoria: categoriaSelecionada,
            tipoTransacao: "saida" as const,
            dataInicial: dataInicioMes,
            dataFinal: dataFimMes,
          }
        : undefined,
    [categoriaSelecionada, dataInicioMes, dataFimMes]
  );

  const { lancamentos, loading: loadingLancamentos } = useLancamentos({
    pagina: 1,
    itensPorPagina: 100,
    filtros: filtrosLancamentos,
    autoFetch: !!categoriaSelecionada,
  });

  const categoriasComId = useMemo(() => {
    return dadosGrafico.map((cat) => ({
      ...cat,
      id: cat.categoria?.id ?? 0,
    }));
  }, [dadosGrafico]);

  const topCategoria = useMemo(() => {
    if (categoriasComId.length === 0) return null;
    return categoriasComId.reduce((max, cat) =>
      cat.valor > max.valor ? cat : max
    );
  }, [categoriasComId]);

  useEffect(() => {
    if (topCategoria && !categoriaSelecionada) {
      setCategoriaSelecionada(topCategoria.id);
      setNomeCategoriaSelecionada(topCategoria.nome);
    }
  }, [topCategoria]);

  const handleCategoriaClick = (idCategoria: number, nomeCategoria: string) => {
    if (categoriaSelecionada === idCategoria) {
      setCategoriaSelecionada(null);
      setNomeCategoriaSelecionada("");
    } else {
      setCategoriaSelecionada(idCategoria);
      setNomeCategoriaSelecionada(nomeCategoria);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex flex-col">
      <Header />
      <div className="min-h-[60px] w-full"></div>

      <div className="flex-1 w-full px-4 md:px-8 flex flex-col items-center pb-8">
        <div className="w-full max-w-7xl">
          <div className="flex items-center gap-4 py-6">
            <button
              onClick={() => navigate("/home")}
              className="p-2 rounded-lg bg-card/50 border border-purple-500/30 hover:bg-card/80 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-purple-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Detalhes de Gastos
              </h1>
              <p className="text-gray-400 text-sm">
                {mesParam} / {anoParam}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div className="w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-lg p-4 flex items-center justify-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/30">
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Total de Gastos</p>
                <p className="text-xl font-bold text-white">
                  {formataValorBRL(totalGastos)}
                </p>
              </div>
            </div>

            {topCategoria && (
              <div className="w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-lg p-4 flex items-center justify-start gap-3">
                <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                  <Award className="w-5 h-5 text-purple-400" />
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-gray-400 text-xs mb-1">Top Gasto</p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white truncate flex-1">
                      {topCategoria.nome}
                    </p>
                    <p className="text-sm font-semibold text-purple-400 whitespace-nowrap">
                      {formataValorBRL(topCategoria.valor)}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-lg p-4 flex items-center justify-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
                <List className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">Categorias</p>
                <p className="text-xl font-bold text-white">
                  {categoriasComId.length}
                </p>
              </div>
            </div>

            <div className="w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-lg p-4 flex items-center justify-start gap-3">
              <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-gray-400 text-xs mb-1">
                  Média por Categoria
                </p>
                <p className="text-xl font-bold text-white">
                  {formataValorBRL(
                    categoriasComId.length > 0
                      ? totalGastos / categoriasComId.length
                      : 0
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Distribuição de Gastos
            </h2>
            <div className="w-full rounded-xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-lg p-6">
              {loadingGrafico ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-700/50 rounded w-24 animate-pulse"></div>
                        <div className="h-4 bg-gray-700/50 rounded w-16 animate-pulse"></div>
                      </div>
                      <div className="w-full h-8 bg-gray-700/30 rounded-lg overflow-hidden">
                        <div
                          className="h-full bg-gray-600/50 rounded-lg animate-pulse"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : categoriasComId.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">
                    Nenhum gasto registrado neste período
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categoriasComId.map((categoria) => {
                    const Icone = obterIconeCategoria(categoria.nome);
                    const percentual =
                      totalGastos > 0
                        ? (categoria.valor / totalGastos) * 100
                        : 0;

                    return (
                      <div key={categoria.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
                              <Icone className="w-4 h-4 text-purple-400" />
                            </div>
                            <span className="text-white font-medium text-sm">
                              {categoria.nome}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-300 text-sm">
                              {formataValorBRL(categoria.valor)}
                            </span>
                            <span className="text-purple-400 text-xs font-semibold min-w-[45px] text-right">
                              {percentual.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full h-3 bg-gray-700/30 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentual}%` }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Gastos por Categoria
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {categoriasComId.map((categoria) => {
                const Icone = obterIconeCategoria(categoria.nome);
                const percentual =
                  totalGastos > 0
                    ? ((categoria.valor / totalGastos) * 100).toFixed(1)
                    : "0.0";
                const isSelected = categoriaSelecionada === categoria.id;

                return (
                  <motion.button
                    key={categoria.id}
                    onClick={() =>
                      handleCategoriaClick(categoria.id, categoria.nome)
                    }
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full rounded-xl bg-gradient-to-br backdrop-blur-xl border shadow-lg p-4 text-left transition-all ${
                      isSelected
                        ? "from-purple-500/20 to-purple-600/10 border-purple-500/50"
                        : "from-card/80 to-card/40 border-purple-500/30 hover:border-purple-500/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                        <Icone className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="text-right">
                        <p className="text-purple-400 text-xs font-medium">
                          {percentual}%
                        </p>
                      </div>
                    </div>
                    <h3 className="text-white font-semibold text-sm mb-1">
                      {categoria.nome}
                    </h3>
                    <p className="text-gray-300 font-bold text-base">
                      {formataValorBRL(categoria.valor)}
                    </p>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {categoriaSelecionada !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">
                    Lançamentos - {nomeCategoriaSelecionada}
                  </h2>
                  <button
                    onClick={() => {
                      setCategoriaSelecionada(null);
                      setNomeCategoriaSelecionada("");
                    }}
                    className="text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Limpar filtro
                  </button>
                </div>

                {loadingLancamentos ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-full rounded-xl bg-card/50 border border-purple-500/30 p-4 animate-pulse"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-700/50 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-700/50 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-700/50 rounded w-1/4"></div>
                          </div>
                          <div className="h-4 bg-gray-700/50 rounded w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : lancamentos.length === 0 ? (
                  <div className="w-full rounded-xl bg-card/50 border border-purple-500/30 p-8 text-center">
                    <p className="text-gray-400">
                      Nenhum lançamento encontrado nesta categoria
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {lancamentos.map((lancamento) => (
                      <CardLancamento
                        key={lancamento.id}
                        icone={lancamento.icone}
                        titulo={lancamento.titulo}
                        data={lancamento.data}
                        valor={lancamento.valor}
                        tipo={lancamento.tipo}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
