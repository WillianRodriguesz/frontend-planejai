import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
}

const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
}: ToastProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible) return null;

  const config = {
    success: {
      icon: CheckCircle,
      gradient: "from-green-500/90 via-emerald-500/90 to-teal-500/90",
      border: "border-green-400/50",
      shadow: "shadow-green-500/30",
      iconBg: "bg-green-400",
      iconColor: "text-green-900",
    },
    error: {
      icon: XCircle,
      gradient: "from-red-500/90 via-rose-500/90 to-pink-500/90",
      border: "border-red-400/50",
      shadow: "shadow-red-500/30",
      iconBg: "bg-red-400",
      iconColor: "text-red-900",
    },
    warning: {
      icon: AlertTriangle,
      gradient: "from-yellow-500/90 via-orange-500/90 to-amber-500/90",
      border: "border-yellow-400/50",
      shadow: "shadow-yellow-500/30",
      iconBg: "bg-yellow-400",
      iconColor: "text-yellow-900",
    },
    info: {
      icon: Info,
      gradient: "from-blue-500/90 via-cyan-500/90 to-sky-500/90",
      border: "border-blue-400/50",
      shadow: "shadow-blue-500/30",
      iconBg: "bg-blue-400",
      iconColor: "text-blue-900",
    },
  };

  const {
    icon: Icon,
    gradient,
    border,
    shadow,
    iconBg,
    iconColor,
  } = config[type];

  return (
    <div
      className={`fixed top-6 right-6 z-50 max-w-md transition-all duration-300 ${
        isLeaving
          ? "translate-x-full opacity-0"
          : "translate-x-0 opacity-100 animate-slide-in-right"
      }`}
    >
      <div
        className={`bg-gradient-to-r ${gradient} backdrop-blur-xl border ${border} rounded-2xl shadow-2xl ${shadow} overflow-hidden`}
      >
        <div className="relative p-4">
          {/* Efeito de brilho */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

          <div className="relative flex items-start gap-3">
            {/* Ícone com animação */}
            <div
              className={`${iconBg} rounded-xl p-2 flex items-center justify-center flex-shrink-0 shadow-lg animate-bounce`}
              style={{ animationDuration: "1s", animationIterationCount: "1" }}
            >
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>

            {/* Conteúdo */}
            <div className="flex-1 pt-0.5">
              <p className="text-white font-medium text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Botão de fechar */}
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Barra de progresso */}
          {duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
              <div
                className="h-full bg-white/60 transition-all ease-linear"
                style={{
                  animation: `shrink ${duration}ms linear`,
                }}
              />
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Toast;
