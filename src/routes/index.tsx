import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/templates/Login";
import Home from "../components/templates/Home";
import ConfiguracoesUsuario from "../components/templates/ConfiguracoesUsuario";
import Registro from "../components/templates/Registro";
import DetalhesGastos from "../components/templates/DetalhesGastos";
import RedefinirSenha from "../components/templates/RedefinirSenha";
import MenuInferiorMobile from "../components/moleculas/MenuInferiorMobile";

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
        <Route path="/home" element={<Home />} />
        <Route path="/configuracoes" element={<ConfiguracoesUsuario />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/detalhes-gastos" element={<DetalhesGastos />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <MenuInferiorMobile />
    </BrowserRouter>
  );
}
