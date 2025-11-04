// src/app/new-project/page.tsx
import React from "react";
import Sidebar from "../../components/Sidebar";

export default function NewProjectPage() {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ padding: "2rem", flex: 1 }}>
        <h1>Crear nuevo proyecto (Setup 5DS MVP)</h1>
        {/* Acordeón paso 1 */}
        <section>
          <h2>1. Conexión con Supabase</h2>
        </section>
        {/* Acordeón paso 2 */}
        <section>
          <h2>2. Vincular repositorio GitHub</h2>
        </section>
        {/* Acordeón paso 3 */}
        <section>
          <h2>3. Configuración Vercel</h2>
        </section>
      </main>
    </div>
  );
}
