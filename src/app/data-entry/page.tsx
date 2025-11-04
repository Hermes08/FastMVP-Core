// src/app/data-entry/page.tsx
import React from "react";
import Sidebar from "../../components/Sidebar";

export default function DataEntryPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Gestión de contenido</h1>
        {/* Aquí van los formularios y gestión de artículos, imágenes, proyectos */}
      </main>
    </div>
  );
}
