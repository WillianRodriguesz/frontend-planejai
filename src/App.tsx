import "./App.css";
import "./index.css";
import AppRoutes from "./routes";
import { LoadingProvider } from "./contexts/LoadingContext";
import { CarteiraProvider } from "./contexts/CarteiraContext";

function App() {
  return (
    <LoadingProvider>
      <CarteiraProvider>
        <AppRoutes />
      </CarteiraProvider>
    </LoadingProvider>
  );
}

export default App;
