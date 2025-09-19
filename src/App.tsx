import "./App.css";
import "./index.css";
import AppRoutes from "./routes";
import { LoadingProvider } from "./contexts/LoadingContext";

function App() {
  return (
    <LoadingProvider>
      <AppRoutes />
    </LoadingProvider>
  );
}

export default App;
