import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import Accueil from "@/pages/Accueil";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Accueil />
  </StrictMode>,
);
