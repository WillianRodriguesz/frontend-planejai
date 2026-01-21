import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buscarTermo } from "../../api/usuarioApi";
import { useLoading } from "../../contexts/LoadingContext";
import { useToast } from "../../hooks/useToast";
import BotaoSalvar from "../atomos/BotaoSalvar";
import Toast from "../atomos/Toast";

export default function Termos() {
  const [termos, setTermos] = useState<
    Array<{
      tipo: string;
      titulo: string;
      texto: string;
    }>
  >([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const navigate = useNavigate();
  const { showLoading, hideLoading } = useLoading();
  const { toasts, error: showError, hideToast } = useToast();

  useEffect(() => {
    if (hasLoaded) return;

    const carregarTermos = async () => {
      showLoading("Carregando...", "Buscando termos");
      try {
        const tipos = ["lgpd", "termos_uso", "politica_privacidade"];
        const termosData = await Promise.all(
          tipos.map(async (tipo) => {
            const data = await buscarTermo(tipo);
            return data
              ? { tipo, titulo: data.titulo, texto: data.texto }
              : null;
          }),
        );
        const validTermos = termosData.filter((t) => t !== null) as Array<{
          tipo: string;
          titulo: string;
          texto: string;
        }>;
        setTermos(validTermos);
        setHasLoaded(true);
        if (validTermos.length === 0) {
          showError("Nenhum termo encontrado.");
          navigate("/registro");
        }
      } catch (err) {
        showError("Erro ao carregar os termos.");
        navigate("/registro");
      } finally {
        hideLoading();
      }
    };

    carregarTermos();
  }, [hasLoaded, navigate, showLoading, hideLoading, showError]);

  const handleVoltar = () => {
    navigate("/registro");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1c1c1c] to-[#212121] flex items-center justify-center px-4">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => hideToast(toast.id)}
        />
      ))}
      <div className="max-w-4xl w-full bg-gradient-to-br from-card/90 to-card/80 backdrop-blur-xl border border-purple-500/30 rounded-2xl shadow-xl p-6 md:p-8">
        <div className="mb-6">
          <button
            onClick={handleVoltar}
            className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 text-center">
            Termos e Políticas
          </h1>
        </div>
        {termos.length > 0 ? (
          <div className="space-y-10">
            {termos.map((termo, index) => (
              <div
                key={termo.tipo}
                className="bg-gray-800/50 rounded-lg p-6 border border-gray-700"
              >
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 shadow-lg">
                    {index + 1}
                  </div>
                  {termo.titulo}
                </h2>
                <div className="prose prose-invert max-w-none">
                  <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
                    {termo.texto}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        )}
        <div className="mt-8 flex justify-center">
          <BotaoSalvar onClick={handleVoltar} className="w-full max-w-xs">
            Entendi
          </BotaoSalvar>
        </div>
      </div>
    </div>
  );
}
