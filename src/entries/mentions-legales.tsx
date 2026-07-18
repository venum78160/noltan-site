import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import MentionsLegales from "@/pages/MentionsLegales";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MentionsLegales />
  </StrictMode>,
);
