// src/lib/contentGenerator.ts
export function generateContent(input: string, mode: "A" | "B" = "A") {
  // Simulación: dependiendo del modo, retorna diferente output
  if (mode === "A") {
    return `Modo A: Resumen automático generado para '${input}'`;
  }
  return `Modo B: Generación de contenido extendido para '${input}'`;
}
