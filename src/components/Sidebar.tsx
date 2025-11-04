// src/components/Sidebar.tsx
import React from "react";

export default function Sidebar() {
  return (
    <aside style={{ width: "220px", background: "#00345E", color: "#fff", minHeight: "100vh", padding: "1rem" }}>
      <h2 style={{ marginBottom: "2rem" }}>5 Day Sprint</h2>
      <nav>
        <ul style={{ listStyle: "none", paddingLeft: 0 }}>
          <li><a href="/new-project" style={{color: "#fff"}}>Nuevo Proyecto</a></li>
          <li><a href="/builder" style={{color: "#fff"}}>Builder</a></li>
          <li><a href="/seo-check" style={{color: "#fff"}}>Validador SEO</a></li>
          <li><a href="/data-entry" style={{color: "#fff"}}>Gestión de contenido</a></li>
        </ul>
      </nav>
    </aside>
  );
}
