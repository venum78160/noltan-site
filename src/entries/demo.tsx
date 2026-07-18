import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import Demo from "@/pages/Demo";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Demo />
  </StrictMode>,
);
