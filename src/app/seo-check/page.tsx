// src/app/seo-check/page.tsx
import React from "react";
import Sidebar from "../../components/Sidebar";

export default function SeoCheckPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flex: 1, padding: "2rem" }}>
        <h1>Validador de nichos SEO</h1>
        {/* Aquí van los formularios y resultados de análisis SEO para nichos y palabras clave */}
      </main>
    </div>
  );
}
