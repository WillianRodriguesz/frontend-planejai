import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  
  base: "/",
  
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/planejai": {
        target: "http://72.60.52.217:3000", 
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: "localhost",
      },
    },
  },
});
