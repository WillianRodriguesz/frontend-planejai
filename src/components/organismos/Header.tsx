import { Wallet } from "lucide-react";
import {useNavigate } from "react-router-dom";
import MenuHamburguer from "../moleculas/MenuHamburguer";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent backdrop-blur-md border-b-4 border-purple-600 shadow-lg shadow-purple-600/30 h-[60px]">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MenuHamburguer />
          <div
            className="relative w-10 h-10 bg-gradient-to-br from-purple-500 via-purple-600 to-purple-800 rounded-xl flex items-center justify-center shadow-2xl shadow-purple-500/40 ring-1 ring-white/20 hover:scale-105 transition-transform duration-300 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/20 before:to-transparent before:rounded-xl cursor-pointer"
            onClick={() => navigate("/")}
            aria-label="Ir para home"
            tabIndex={0}
            role="button"
          >
            <Wallet className="relative text-white w-6 h-6 drop-shadow-lg z-10" />
          </div>
          <h1
            className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent select-none cursor-pointer"
            onClick={() => navigate("/home")}
            aria-label="Ir para home"
            tabIndex={0}
            role="button"
          >
            Planejai
          </h1>
        </div>

        <div className="flex items-center"></div>
      </div>
    </header>
  );
};

export default Header;
