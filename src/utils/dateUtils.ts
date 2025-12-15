/**
 * Mapeamento de nomes de meses em português para números (1-12)
 */
export const mesesMap: Record<string, number> = {
  janeiro: 1,
  fevereiro: 2,
  março: 3,
  abril: 4,
  maio: 5,
  junho: 6,
  julho: 7,
  agosto: 8,
  setembro: 9,
  outubro: 10,
  novembro: 11,
  dezembro: 12,
};

/**
 * Converte o nome de um mês em português para seu número correspondente
 * @param nomeMes - Nome do mês em português (ex: "janeiro", "Dezembro")
 * @returns Número do mês (1-12) ou mês atual se o nome não for encontrado
 */
export const converterMesParaNumero = (nomeMes: string): number => {
  const mesNumero = mesesMap[nomeMes.toLowerCase()];
  return mesNumero || new Date().getMonth() + 1;
};

/**
 * Converte um número de mês (1-12) para o nome em português
 * @param numeroMes - Número do mês (1-12)
 * @returns Nome do mês em português
 */
export const converterNumeroParaMes = (numeroMes: number): string => {
  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];
  return meses[numeroMes - 1] || "janeiro";
};

/**
 * Formata uma data no padrão brasileiro DD/MM/YYYY
 * @param data - Data no formato YYYY-MM-DD, YYYY-MM-DDTHH:mm:ss.sssZ ou objeto Date
 * @returns Data formatada como DD/MM/YYYY
 */
export const formatarDataBR = (data: string | Date): string => {
  if (typeof data === "string") {
    const dataLimpa = data.split("T")[0];
    const [ano, mes, dia] = dataLimpa.split("-");
    return `${dia}/${mes}/${ano}`;
  }

  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = data.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

/**
 * Formata uma data no padrão ISO (YYYY-MM-DD)
 * @param data - Data no formato DD/MM/YYYY ou objeto Date
 * @returns Data formatada como YYYY-MM-DD
 */
export const formatarDataISO = (data: string | Date): string => {
  if (typeof data === "string") {
    const [dia, mes, ano] = data.split("/");
    return `${ano}-${mes}-${dia}`;
  }

  const ano = data.getFullYear();
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${ano}-${mes}-${dia}`;
};
