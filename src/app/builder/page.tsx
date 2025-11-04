// src/app/builder/page.tsx
import React from "react";
import Sidebar from "../../components/Sidebar";

export default function BuilderPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Generador de MVPs</h1>
        {/* Aquí va el generador visual, formularios para inputs, selectores de features, etc. */}
      </main>
    </div>
  );
}
