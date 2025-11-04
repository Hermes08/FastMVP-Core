// src/app/builder/page.tsx
'use client';
import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

export default function BuilderPage() {
  const [mvpName, setMvpName] = useState('');
  const [selectedCredential, setSelectedCredential] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  // Mock de credenciales guardadas (misma lógica de New Project)
  const mockCredentials = [
    { id: '1', name: 'AWS Production', provider: 'AWS' },
    { id: '2', name: 'Vercel Main', provider: 'Vercel' },
    { id: '3', name: 'Google Cloud Dev', provider: 'GCP' },
  ];

  const handleLaunchMVP = async () => {
    if (!mvpName.trim()) {
      setError('Por favor ingresa un nombre para el MVP');
      return;
    }
    if (!selectedCredential) {
      setError('Por favor selecciona unas credenciales');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      // POST a /api/credentials/save con credenciales + nombre de proyecto
      const res = await fetch('/api/credentials/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectName: mvpName,
          credentialId: selectedCredential,
          // Datos mock para la demo
          provider: mockCredentials.find(c => c.id === selectedCredential)?.provider,
          timestamp: new Date().toISOString(),
        }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
        // TODO: Aquí se integrará con el endpoint de onboarding real
        // await fetch('/api/onboarding/start', { method: 'POST', body: JSON.stringify({ projectId: data.projectId }) });
        
        // TODO: Aquí se integrará con el endpoint de despliegue futuro
        // await fetch('/api/deploy/trigger', { method: 'POST', body: JSON.stringify({ projectId: data.projectId, credentialId: selectedCredential }) });
      } else {
        setError(data.error || 'Error al lanzar el MVP');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
      console.error('Error launching MVP:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Generador de MVPs</h1>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Lanza tu MVP usando credenciales guardadas
        </p>

        <div style={{ maxWidth: '600px' }}>
          {/* Input para nombre del MVP */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Nombre del MVP
            </label>
            <input
              type="text"
              value={mvpName}
              onChange={(e) => setMvpName(e.target.value)}
              placeholder="Ej: MiAppSaaS"
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            />
          </div>

          {/* Dropdown para seleccionar credenciales */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Seleccionar Credenciales
            </label>
            <select
              value={selectedCredential}
              onChange={(e) => setSelectedCredential(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '1rem',
              }}
            >
              <option value="">-- Selecciona credenciales --</option>
              {mockCredentials.map((cred) => (
                <option key={cred.id} value={cred.id}>
                  {cred.name} ({cred.provider})
                </option>
              ))}
            </select>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: '#fee',
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c33',
                marginBottom: '1.5rem',
              }}
            >
              {error}
            </div>
          )}

          {/* Botón Lanzar MVP */}
          <button
            onClick={handleLaunchMVP}
            disabled={loading}
            style={{
              padding: '0.75rem 2rem',
              backgroundColor: loading ? '#999' : '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Lanzando...' : 'Lanzar MVP'}
          </button>

          {/* Respuesta del servidor - Mensaje de éxito */}
          {response && (
            <div
              style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#efe',
                border: '1px solid #cfc',
                borderRadius: '4px',
              }}
            >
              <h3 style={{ color: '#2a2', marginTop: 0 }}>✓ MVP Lanzado Exitosamente</h3>
              <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                <p><strong>Proyecto:</strong> {response.projectName || mvpName}</p>
                <p><strong>Estado:</strong> {response.message || 'Credenciales guardadas'}</p>
                <p><strong>ID:</strong> {response.id || 'N/A'}</p>
                <p style={{ marginTop: '1rem', color: '#666', fontStyle: 'italic' }}>
                  Nota: La integración completa con onboarding y despliegue automático se activará cuando los endpoints reales estén disponibles.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Comentarios informativos para desarrolladores */}
        <div
          style={{
            marginTop: '3rem',
            padding: '1rem',
            backgroundColor: '#f5f5f5',
            borderLeft: '4px solid #0070f3',
            fontSize: '0.85rem',
          }}
        >
          <strong>🔧 Integración futura:</strong>
          <ul style={{ marginTop: '0.5rem' }}>
            <li>POST /api/onboarding/start - Iniciar flujo de onboarding</li>
            <li>POST /api/deploy/trigger - Disparar despliegue automático</li>
            <li>GET /api/credentials/list - Listar credenciales reales del usuario</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
