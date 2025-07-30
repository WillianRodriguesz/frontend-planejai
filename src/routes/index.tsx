import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../components/templates/Login";
import Home from "../components/templates/Home";


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}
