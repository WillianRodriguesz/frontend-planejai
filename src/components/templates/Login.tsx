import React from "react";
import { TextField, Button } from "@mui/material";

export default function Login() {
  return (
    <div className="min-h-screen bg-[#212121] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#1c1c1c] rounded-2xl shadow-lg p-10">
        <h1 className="text-4xl font-bold text-[#8257E5] mb-8 text-center">
          Rocketseat Login
        </h1>

        <form className="space-y-6">
          <TextField
            fullWidth
            variant="standard"
            label="E-mail"
            type="email"
            placeholder="seuemail@exemplo.com"
            required
            InputLabelProps={{
              className:
                "text-gray-400 peer-focus:text-[#8257E5] transition-colors duration-300",
            }}
            InputProps={{
              disableUnderline: true,
              className:
                "bg-[#2c2c2c] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8257E5] focus:outline-none",
            }}
          />

          <TextField
            fullWidth
            variant="standard"
            label="Senha"
            type="password"
            placeholder="********"
            required
            InputLabelProps={{
              className:
                "text-gray-400 peer-focus:text-[#8257E5] transition-colors duration-300",
            }}
            InputProps={{
              disableUnderline: true,
              className:
                "bg-[#2c2c2c] rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-[#8257E5] focus:outline-none",
            }}
          />

          <Button
            type="submit"
            fullWidth
            className="bg-[#8257E5] hover:bg-[#6a48c8] transition-colors duration-300 font-bold py-3 rounded-lg shadow-md text-white text-lg"
          >
            Entrar
          </Button>
        </form>

        <div className="mt-6 text-center text-gray-400">
          Não tem uma conta?{" "}
          <a href="#" className="text-[#8257E5] hover:underline font-semibold">
            Registre-se
          </a>
        </div>
      </div>
    </div>
  );
}
