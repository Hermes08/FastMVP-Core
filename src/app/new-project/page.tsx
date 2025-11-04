// src/app/new-project/page.tsx
'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

// TODO: Integración futura con DB - Estas credenciales se cargarán desde la base de datos
const MOCK_SAVED_CREDENTIALS = [
  {
    id: 'default',
    name: 'Nuevo (vacío)',
    supabaseUrl: '',
    supabaseKey: '',
    vercelToken: '',
    pexelsKey: '',
  },
  {
    id: 'prod-main',
    name: 'Producción Principal',
    supabaseUrl: 'https://xxxx.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    vercelToken: 'vercel_xxx_prod',
    pexelsKey: 'pexels_api_key_prod',
  },
  {
    id: 'dev-test',
    name: 'Desarrollo y Testing',
    supabaseUrl: 'https://dev-xxxx.supabase.co',
    supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_dev...',
    vercelToken: 'vercel_xxx_dev',
    pexelsKey: 'pexels_api_key_dev',
  },
];

export default function NewProjectPage() {
  // Estado para selección de credenciales guardadas
  const [selectedCredentialId, setSelectedCredentialId] = useState('default');
  
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

  // Manejar cambio de credenciales guardadas
  const handleCredentialSelect = (credentialId: string) => {
    setSelectedCredentialId(credentialId);
    const selected = MOCK_SAVED_CREDENTIALS.find(c => c.id === credentialId);
    if (selected) {
      setApiCredentials({
        supabaseUrl: selected.supabaseUrl,
        supabaseKey: selected.supabaseKey,
        vercelToken: selected.vercelToken,
        pexelsKey: selected.pexelsKey,
      });
    }
  };

  // TODO: Función para guardar nuevas credenciales en DB
  const handleSaveCredentials = () => {
    // Aquí se haría la integración con la DB para persistir las credenciales
    console.log('Guardar credenciales:', apiCredentials);
    alert('Credenciales guardadas (simulado). TODO: Integrar con DB');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ padding: '2rem', flex: 1 }}>
        <h1>Crear nuevo proyecto (Setup 5DS MVP)</h1>
        
        {/* NUEVA SECCIÓN: Selector de credenciales guardadas */}
        <section style={{ marginBottom: '2rem', padding: '1.5rem', backgroundColor: '#f5f5f5', borderRadius: '8px', border: '2px solid #ddd' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.3rem' }}>🔑 Credenciales del Proyecto</h2>
          
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="credential-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Seleccionar credenciales guardadas:
            </label>
            <select
              id="credential-select"
              value={selectedCredentialId}
              onChange={(e) => handleCredentialSelect(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '1rem',
                borderRadius: '4px',
                border: '1px solid #ccc',
                backgroundColor: 'white',
              }}
            >
              {MOCK_SAVED_CREDENTIALS.map((cred) => (
                <option key={cred.id} value={cred.id}>
                  {cred.name}
                </option>
              ))}
            </select>
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
              💡 Selecciona un set de credenciales guardadas o edita/crea nuevas abajo.
            </small>
          </div>

          {/* Inputs de credenciales (editables) */}
          <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'white', borderRadius: '4px', border: '1px solid #ddd' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Editar o agregar credenciales:</h3>
            
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Supabase URL:</label>
              <input
                type="text"
                value={apiCredentials.supabaseUrl}
                onChange={(e) => handleInputChange('supabaseUrl', e.target.value)}
                placeholder="https://xxxx.supabase.co"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Supabase Anon Key:</label>
              <input
                type="password"
                value={apiCredentials.supabaseKey}
                onChange={(e) => handleInputChange('supabaseKey', e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Vercel Token:</label>
              <input
                type="password"
                value={apiCredentials.vercelToken}
                onChange={(e) => handleInputChange('vercelToken', e.target.value)}
                placeholder="vercel_xxx"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem', fontWeight: '500' }}>Pexels API Key:</label>
              <input
                type="password"
                value={apiCredentials.pexelsKey}
                onChange={(e) => handleInputChange('pexelsKey', e.target.value)}
                placeholder="pexels_api_key"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
              />
            </div>

            <button
              onClick={handleSaveCredentials}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#0070f3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '0.5rem',
              }}
            >
              💾 Guardar estas credenciales (Mock)
            </button>
            <small style={{ display: 'block', marginTop: '0.5rem', color: '#666' }}>
              {/* TODO: Integrar con DB - Al hacer clic, las credenciales se guardarán en la base de datos */}
              Las credenciales se guardarán para uso futuro. Integración con DB pendiente.
            </small>
          </div>
        </section>
        
        {/* Acordeón paso 1 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>1. Conexión con Supabase</h2>
        </section>
        
        {/* Acordeón paso 2 */}
        <section style={{ marginBottom: '2rem' }}>
          <h2>2. Vincular repositorio GitHub</h2>
        </section>
      </main>
    </div>
  );
}
