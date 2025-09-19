import React from "react";
import { DollarSign, TrendingUp, Lock } from "lucide-react";

interface LoadingScreenProps {
  title?: string;
  subtitle?: string;
  message?: string;
  showIcons?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  title = "Entrando...",
  subtitle = "Preparando seu dashboard financeiro",
  message,
  showIcons = true,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-4">
        <div className="relative w-20 h-20 mx-auto mb-8">
          <div className="absolute inset-0 border-4 border-purple-200/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <DollarSign className="w-8 h-8 text-purple-400 animate-pulse" />
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-base text-gray-300">{subtitle}</p>
          {message && <p className="text-sm text-gray-400">{message}</p>}

          {showIcons && (
            <div className="flex justify-center space-x-6 mt-8">
              <TrendingUp
                className="w-6 h-6 text-green-400 animate-bounce"
                style={{ animationDelay: "0s" }}
              />
              <DollarSign
                className="w-6 h-6 text-purple-400 animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
              <Lock
                className="w-6 h-6 text-blue-400 animate-bounce"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
