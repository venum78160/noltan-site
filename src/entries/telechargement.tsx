import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import Telechargement from "@/pages/Telechargement";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Telechargement />
  </StrictMode>,
);
