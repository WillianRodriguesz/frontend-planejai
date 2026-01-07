import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./altura-responsiva.css";
import App from "./App.tsx";

let scrollbarTimeout: NodeJS.Timeout;
let isScrolling = false;

const handleScroll = () => {
  if (!isScrolling) {
    document.documentElement.classList.add("scrolling");
    isScrolling = true;
  }

  clearTimeout(scrollbarTimeout);

  scrollbarTimeout = setTimeout(() => {
    document.documentElement.classList.remove("scrolling");
    isScrolling = false;
  }, 1000);
};

window.addEventListener("scroll", handleScroll, { passive: true });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
