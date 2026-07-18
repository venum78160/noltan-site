import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import Confidentialite from "@/pages/Confidentialite";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Confidentialite />
  </StrictMode>,
);
