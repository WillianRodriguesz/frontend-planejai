import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/templates/Login";
import Home from "../components/templates/Home";
import ConfiguracoesUsuario from "../components/templates/ConfiguracoesUsuario";
import Registro from "../components/templates/Registro";
import DetalhesGastos from "../components/templates/DetalhesGastos";
import RedefinirSenha from "../components/templates/RedefinirSenha";
import Termos from "../components/templates/Termos";
import MenuInferiorMobile from "../components/moleculas/MenuInferiorMobile";
import ProtectedRoute from "../components/atomos/ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/termos" element={<Termos />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/configuracoes"
          element={
            <ProtectedRoute>
              <ConfiguracoesUsuario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/detalhes-gastos"
          element={
            <ProtectedRoute>
              <DetalhesGastos />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <MenuInferiorMobile />
    </BrowserRouter>
  );
}
