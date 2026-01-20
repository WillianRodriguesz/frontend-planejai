import {
  Wallet,
  Laptop,
  UtensilsCrossed,
  Car,
  Ticket,
  Receipt,
  Package,
  Dumbbell,
  BookOpen,
  Home,
  Repeat,
  CreditCard,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const categoriaIconeMap: Record<string, LucideIcon> = {
  salário: Wallet,
  freelance: Laptop,
  alimentação: UtensilsCrossed,
  transporte: Car,
  lazer: Ticket,
  contas: Receipt,
  outros: Package,
  "cartão de crédito": CreditCard,
  academia: Dumbbell,
  educação: BookOpen,
  aluguel: Home,
  assinaturas: Repeat,
};

export const obterIconeCategoria = (nomeCategoria?: string): LucideIcon => {
  if (!nomeCategoria) {
    return Package;
  }

  const nomeNormalizado = nomeCategoria.toLowerCase().trim();
  return categoriaIconeMap[nomeNormalizado] || Package;
};
