export interface LancamentoDto {
  id: string;
  idCategoria: number;
  tipoTransacao: "entrada" | "saida";
  valor: number;
  titulo: string;
  descricao: string;
  data: string;
  createdAt: string;
  updatedAt: string;
}

export interface LancamentosPaginadosDto {
  lancamentos: LancamentoDto[];
  total: number;
  pagina: number;
  itensPorPagina: number;
  totalPaginas: number;
}

export interface FiltrarLancamentosDto {
  dataInicial?: string;
  dataFinal?: string;
  idCategoria?: number;
  titulo?: string;
  tipoTransacao?: "entrada" | "saida" | "todos";
  pagina?: number;
  itensPorPagina?: number;
}

export interface AdicionarLancamentoDto {
  idCategoria: number;
  tipoTransacao: "entrada" | "saida";
  valor: number;
  titulo: string;
  descricao: string;
  data: string;
}

export interface AtualizarLancamentoDto {
  idCategoria?: number;
  tipoTransacao?: "entrada" | "saida";
  valor?: number;
  titulo?: string;
  descricao?: string;
  data?: string;
}
