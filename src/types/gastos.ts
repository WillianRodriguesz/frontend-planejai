export interface GastoPorCategoriaDto {
  categoria: {
    id: number;
    nome: string;
  };
  valor: number;
  porcentagem: number;
}

export interface RelacaoMesAnteriorDto {
  diferencaGastosMensal: number;
  mensagemEconomia: string;
}

export interface GastosMensaisDto {
  totalGastos: number;
  gastosPorCategoria: GastoPorCategoriaDto[];
  relacaoMesAnterior: RelacaoMesAnteriorDto;
}
