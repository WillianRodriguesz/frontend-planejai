"use client";

import type { ReactNode, MouseEvent } from "react";

interface BotaoCustomProps {
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  isLoading?: boolean;
  texto?: string;
  icon?: ReactNode; // recebe qualquer ícone JSX
}

export function BotaoCustom({
  onClick,
  disabled = false,
  isLoading = false,
  texto = "Botão",
  icon,
}: BotaoCustomProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className="
        relative group
        bg-[#9637EC] hover:bg-[#7C3AED] disabled:bg-[#9637EC]/70
        text-white font-semibold
        py-4 px-8
        rounded-2xl
        shadow-lg hover:shadow-xl
        transition-all duration-300
        transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed
        overflow-hidden
      "
    >
      <div className="
        absolute inset-0
        bg-gradient-to-r from-transparent via-white/20 to-transparent
        -translate-x-full group-hover:translate-x-full
        transition-transform duration-1000
      "></div>

      <div className="relative flex items-center justify-center gap-3">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && (
              <span className="w-5 h-5 flex items-center justify-center group-hover:translate-y-1 transition-transform duration-300">
                {icon}
              </span>
            )}
            <span>{texto}</span>
          </>
        )}
      </div>
    </button>
  );
}
