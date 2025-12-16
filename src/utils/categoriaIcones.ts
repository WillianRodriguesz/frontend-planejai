import {
  Wallet,
  Laptop,
  UtensilsCrossed,
  Car,
  Ticket,
  Receipt,
  Package,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoriaIconeMap: Record<string, LucideIcon> = {
  salário: Wallet,
  salario: Wallet,
  freelance: Laptop,
  alimentação: UtensilsCrossed,
  alimentacao: UtensilsCrossed,
  transporte: Car,
  lazer: Ticket,
  contas: Receipt,
};

export const obterIconeCategoria = (nomeCategoria?: string): LucideIcon => {
  if (!nomeCategoria) {
    return Package;
  }

  const nomeNormalizado = nomeCategoria.toLowerCase().trim();
  return categoriaIconeMap[nomeNormalizado] || Package;
};
