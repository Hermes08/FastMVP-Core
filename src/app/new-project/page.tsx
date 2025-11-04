// src/app/new-project/page.tsx
'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function NewProjectPage() {
  // Estado local para capturar las credenciales API
  // TODO: Persistir estas credenciales en base de datos para integración futura
  const [apiCredentials, setApiCredentials] = useState({
    supabaseUrl: '',
    supabaseKey: '',
    vercelToken: '',
    pexelsKey: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setApiCredentials(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ padding: '2rem', flex: 1 }}>
        <h1>Crear nuevo proyecto (Setup 5DS MVP)</h1>
        
        {/* Acordeón paso 1 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>1. Conexión con Supabase</h2>
        </section>
        
        {/* Acordeón paso 2 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>2. Vincular repositorio GitHub</h2>
        </section>
        
        {/* Acordeón paso 3 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>3. Configuración Vercel</h2>
        </section>

        {/* Nueva sección: Formulario de Credenciales API */}
        <section style={{ marginTop: '3rem', padding: '1.5rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2 style={{ marginBottom: '1rem' }}>4. Credenciales API (Integraciones Futuras)</h2>
          <p style={{ marginBottom: '1.5rem', color: '#666' }}>
            Ingrese las credenciales para integraciones futuras. Estos datos se almacenarán para uso posterior.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Supabase URL */}
            <div>
              <label htmlFor="supabaseUrl" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Supabase URL:
              </label>
              <input
                id="supabaseUrl"
                type="text"
                placeholder="https://xxxx.supabase.co"
                value={apiCredentials.supabaseUrl}
                onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            {/* Supabase Key */}
            <div>
              <label htmlFor="supabaseKey" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Supabase Key:
              </label>
              <input
                id="supabaseKey"
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={apiCredentials.supabaseKey}
                onChange={(e) => handleInputChange('supabaseKey', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            {/* Vercel Token */}
            <div>
              <label htmlFor="vercelToken" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Vercel Token:
              </label>
              <input
                id="vercelToken"
                type="password"
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                value={apiCredentials.vercelToken}
                onChange={(e) => handleInputChange('vercelToken', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>

            {/* Pexels Key */}
            <div>
              <label htmlFor="pexelsKey" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                Pexels Key:
              </label>
              <input
                id="pexelsKey"
                type="password"
                placeholder="API Key de Pexels"
                value={apiCredentials.pexelsKey}
                onChange={(e) => handleInputChange('pexelsKey', e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
          </div>

          {/* Mostrar estado actual (solo para desarrollo) */}
          <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Estado actual (para verificación):</h3>
            <pre style={{ fontSize: '0.85rem', overflow: 'auto' }}>
              {JSON.stringify(apiCredentials, null, 2)}
            </pre>
            <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>
              // TODO: Implementar persistencia en base de datos<br />
              // Estos valores se almacenarán en la tabla de proyectos o en una tabla dedicada de credenciales
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
