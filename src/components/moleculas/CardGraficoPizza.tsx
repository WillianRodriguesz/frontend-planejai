import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronRight } from "lucide-react";

interface DadosCategoria {
  nome: string;
  valor: number;
  cor?: string;
}

interface CardGraficoPizzaProps {
  dataMes: string;
  dataAno: string;
  dados: DadosCategoria[];
  loading?: boolean;
  onVerDetalhes?: () => void;
}

const CardGraficoPizza: React.FC<CardGraficoPizzaProps> = ({
  dataMes,
  dataAno,
  dados,
  loading = false,
  onVerDetalhes,
}) => {
  // Cores neon fracas e minimalistas do projeto
  const cores = [
    "#8B5CF6", // Roxo neon fraco
    "#06B6D4", // Ciano neon fraco
    "#10B981", // Verde neon fraco
    "#F59E0B", // Âmbar neon fraco
    "#EF4444", // Vermelho neon fraco
    "#EC4899", // Rosa neon fraco
    "#84CC16", // Lima neon fraco
    "#6366F1", // Índigo neon fraco
  ];

  // Adicionar cores aos dados se não tiverem
  const dadosComCores = dados.map((item, index) => ({
    ...item,
    cor: item.cor || cores[index % cores.length],
  }));

  const totalGastos = dadosComCores.reduce((acc, item) => acc + item.valor, 0);

  // Custom tooltip minimalista
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentual = ((data.valor / totalGastos) * 100).toFixed(1);
      return (
        <div className="bg-card/95 backdrop-blur-xl border border-purple-500/20 rounded-lg p-2 shadow-lg">
          <p className="text-white font-medium text-xs">{data.nome}</p>
          <p className="text-gray-300 text-xs">
            R${" "}
            {data.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-purple-400 text-xs">{percentual}%</p>
        </div>
      );
    }
    return null;
  };

  // Label para mostrar porcentagem nas fatias
  const renderLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    if (percent < 0.05) return null; // Só mostrar se for maior que 5%

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading) {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6 relative overflow-hidden h-[280px]">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>

        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-baseline gap-2">
            <span className="text-white text-lg font-semibold">
              Gastos por Categoria
            </span>
            <span className="text-gray-400 text-xs">
              {dataMes}/{dataAno}
            </span>
          </h2>
        </div>

        <div className="flex items-center gap-6">
          <div
            className="flex-shrink-0 relative"
            style={{ width: "160px", height: "160px" }}
          >
            <div className="w-full h-full bg-gray-700/50 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-8 h-2 bg-gray-600/50 rounded animate-pulse mb-1"></div>
              <div className="w-6 h-2 bg-gray-600/50 rounded animate-pulse"></div>
            </div>
          </div>

          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse flex-1"></div>
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-gray-600/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse flex-1 w-5/6"></div>
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gray-600/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse flex-1 w-4/6"></div>
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div className="h-full w-2/5 bg-gray-600/50 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between gap-2">
                <div className="h-3 bg-gray-700/50 rounded animate-pulse flex-1 w-3/6"></div>
                <div className="h-3 bg-gray-700/50 rounded animate-pulse w-8"></div>
              </div>
              <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                <div className="h-full w-1/4 bg-gray-600/50 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dadosComCores.length) {
    return (
      <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6 h-[280px] flex flex-col">
        <div className="flex items-center justify-between mb-8">
          <h2 className="flex items-baseline gap-2">
            <span className="text-white text-lg font-semibold">
              Gastos por Categoria
            </span>
            <span className="text-gray-400 text-xs">
              {dataMes}/{dataAno}
            </span>
          </h2>
        </div>

        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-700/50 flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-purple-500/20"></div>
            </div>
            <p className="text-gray-400 text-xs">Nenhum gasto registrado</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-gradient-to-br from-card/80 to-card/40 backdrop-blur-xl border border-purple-500/30 shadow-xl p-6 h-[280px] flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="flex items-baseline gap-2">
          <span className="text-white text-lg font-semibold">
            Gastos por Categoria
          </span>
          <span className="text-gray-400 text-xs">
            {dataMes}/{dataAno}
          </span>
        </h2>
        {onVerDetalhes && (
          <button
            onClick={onVerDetalhes}
            className="flex items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors text-xs group"
          >
            <span className="hidden sm:inline">Ver detalhes</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-6 flex-1">
        <div
          className="flex-shrink-0 relative"
          style={{ width: "160px", height: "160px" }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={dadosComCores}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderLabel}
                outerRadius={72}
                innerRadius={45}
                fill="#8884d8"
                dataKey="valor"
                stroke="rgba(139, 92, 246, 0.15)"
                strokeWidth={1}
              >
                {dadosComCores.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-gray-400 text-[10px] leading-tight">Total</p>
            <p className="text-white text-sm font-bold leading-tight">
              {totalGastos >= 1000
                ? `R$ ${(totalGastos / 1000).toFixed(1)}k`
                : `R$ ${totalGastos.toFixed(0)}`}
            </p>
          </div>
        </div>

        <div className="flex-1 space-y-2.5 overflow-hidden">
          {dadosComCores.slice(0, 4).map((item, index) => {
            const percentual = ((item.valor / totalGastos) * 100).toFixed(1);
            return (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-gray-300 text-xs truncate">{item.nome}</p>
                  <p className="text-white text-xs font-medium flex-shrink-0">
                    {percentual}%
                  </p>
                </div>
                <div className="w-full h-1.5 bg-gray-700/30 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${percentual}%`,
                      backgroundColor: item.cor,
                    }}
                  />
                </div>
              </div>
            );
          })}
          {dadosComCores.length > 4 && (
            <div className="text-left pt-1">
              <p className="text-gray-500 text-[10px]">
                +{dadosComCores.length - 4} outras categorias
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardGraficoPizza;
