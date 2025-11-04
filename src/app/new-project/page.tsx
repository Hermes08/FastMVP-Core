// src/app/new-project/page.tsx
'use client';
import React, { useState } from 'react';

// Paso 3: Features configurables (pueden ser extendidos)
const FEATURES = [
  { key: 'auth', label: 'Autenticación' },
  { key: 'database', label: 'Base de datos' },
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'storage', label: 'Almacenamiento de archivos' },
  { key: 'images', label: 'API de imágenes (Pexels)' },
  { key: 'ai', label: 'Integración AI' },
];

// Mock para credenciales guardadas
const MOCK_SAVED_CREDENTIALS = [
  { id: 'default', name: 'Nuevo (vacío)', supabaseUrl: '', supabaseKey: '', vercelToken: '', pexelsKey: '' },
  { id: 'prod-main', name: 'Producción Principal', supabaseUrl: 'https://xxxx.supabase.co', supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', vercelToken: 'vercel_xxx_prod', pexelsKey: 'pexels_api_key_prod' },
  { id: 'dev-test', name: 'Desarrollo y Testing', supabaseUrl: 'https://dev-xxxx.supabase.co', supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_dev...', vercelToken: 'vercel_xxx_dev', pexelsKey: 'pexels_api_key_dev' },
];

export default function NewProjectPage() {
  const [step, setStep] = useState(0);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedCredentialId, setSelectedCredentialId] = useState(MOCK_SAVED_CREDENTIALS[0].id);
  const credentials = MOCK_SAVED_CREDENTIALS.find(c => c.id === selectedCredentialId) || MOCK_SAVED_CREDENTIALS[0];
  const [customCredentials, setCustomCredentials] = useState({
    supabaseUrl: credentials.supabaseUrl,
    supabaseKey: credentials.supabaseKey,
    vercelToken: credentials.vercelToken,
    pexelsKey: credentials.pexelsKey,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Sincroniza los campos al cambiar credenciales guardadas
  React.useEffect(() => {
    setCustomCredentials({
      supabaseUrl: credentials.supabaseUrl,
      supabaseKey: credentials.supabaseKey,
      vercelToken: credentials.vercelToken,
      pexelsKey: credentials.pexelsKey,
    });
  }, [selectedCredentialId]);

  const handleFeatureChange = (featureKey) => {
    setSelectedFeatures(prev => prev.includes(featureKey) ? prev.filter(f => f !== featureKey) : [...prev, featureKey]);
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const body = {
      name: projectName,
      description: projectDescription,
      features: selectedFeatures,
      credentials: customCredentials,
    };
    try {
      const resp = await fetch('/api/generate-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (resp.ok) {
        setSuccess(true);
      } else {
        setError('Error al crear el proyecto');
      }
    } catch (err) {
      setError('Error de red al crear el proyecto');
    }
    setSubmitting(false);
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', padding: 16, background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.09)' }}>
      <h1 style={{ textAlign: 'center' }}>Nuevo Proyecto</h1>
      <form onSubmit={handleSubmit}>
        {/* Paso 1: Nombre */}
        <div style={{ marginBottom: 20, border: step === 0 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step === 0 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(0)} style={{ cursor: 'pointer' }}><b>1. Nombre del Proyecto</b></div>
          {step === 0 && (
            <div style={{ marginTop: 8 }}>
              <input type="text" required autoFocus value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Nombre..." style={{ width: '100%', fontSize: 16, padding: 8, marginBottom: 8 }}/>
              <button type="button" onClick={nextStep} disabled={!projectName} style={{ float: 'right', marginLeft: 8 }}>Siguiente</button>
            </div>
          )}
        </div>
        {/* Paso 2: Descripción */}
        <div style={{ marginBottom: 20, border: step === 1 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step === 1 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(1)} style={{ cursor: 'pointer' }}><b>2. Descripción</b></div>
          {step === 1 && (
            <div style={{ marginTop: 8 }}>
              <textarea value={projectDescription} onChange={e => setProjectDescription(e.target.value)} required placeholder="¿Qué hace el proyecto?" style={{ width: '100%', fontSize: 16, padding: 8, marginBottom: 8 }} />
              <button type="button" onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button type="button" onClick={nextStep} disabled={!projectDescription}>Siguiente</button>
            </div>
          )}
        </div>
        {/* Paso 3: Features seleccionables */}
        <div style={{ marginBottom: 20, border: step === 2 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step === 2 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(2)} style={{ cursor: 'pointer' }}><b>3. Selecciona Features</b></div>
          {step === 2 && (
            <div style={{ marginTop: 8 }}>
              {FEATURES.map(f => (
                <label key={f.key} style={{ display: 'block', padding: '4px 0' }}>
                  <input type="checkbox" checked={selectedFeatures.includes(f.key)} onChange={() => handleFeatureChange(f.key)} /> {f.label}
                </label>
              ))}
              <button type="button" onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button type="button" onClick={nextStep}>Siguiente</button>
            </div>
          )}
        </div>
        {/* Paso 4: Credenciales */}
        <div style={{ marginBottom: 20, border: step === 3 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step === 3 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(3)} style={{ cursor: 'pointer' }}><b>4. Credenciales de servicios</b></div>
          {step === 3 && (
            <div style={{ marginTop: 8 }}>
              <label>Usar credenciales guardadas:
                <select value={selectedCredentialId} onChange={e => setSelectedCredentialId(e.target.value)} style={{ marginLeft: 8 }}>
                  {MOCK_SAVED_CREDENTIALS.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </label>
              <hr />
              <label>Supabase URL<br /><input type="text" value={customCredentials.supabaseUrl} onChange={e => setCustomCredentials({ ...customCredentials, supabaseUrl: e.target.value })} style={{ width: '100%' }} /></label><br />
              <label>Supabase Key<br /><input type="text" value={customCredentials.supabaseKey} onChange={e => setCustomCredentials({ ...customCredentials, supabaseKey: e.target.value })} style={{ width: '100%' }} /></label><br />
              <label>Vercel Token<br /><input type="text" value={customCredentials.vercelToken} onChange={e => setCustomCredentials({ ...customCredentials, vercelToken: e.target.value })} style={{ width: '100%' }} /></label><br />
              <label>Pexels Key<br /><input type="text" value={customCredentials.pexelsKey} onChange={e => setCustomCredentials({ ...customCredentials, pexelsKey: e.target.value })} style={{ width: '100%' }} /></label><br />
              <button type="button" onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button type="button" onClick={nextStep}>Siguiente</button>
            </div>
          )}
        </div>
        {/* Paso 5: Resumen */}
        <div style={{ marginBottom: 20, border: step === 4 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step === 4 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(4)} style={{ cursor: 'pointer' }}><b>5. Resumen</b></div>
          {step === 4 && (
            <div style={{ marginTop: 8 }}>
              <div><b>Nombre:</b> {projectName}</div>
              <div><b>Descripción:</b> {projectDescription}</div>
              <div><b>Features:</b> {selectedFeatures.map(fk => FEATURES.find(f => f.key === fk)?.label).join(', ') || 'Ninguno'}</div>
              <div><b>Supabase URL:</b> {customCredentials.supabaseUrl}</div>
              <div><b>Supabase Key:</b> {customCredentials.supabaseKey}</div>
              <div><b>Vercel Token:</b> {customCredentials.vercelToken}</div>
              <div><b>Pexels Key:</b> {customCredentials.pexelsKey}</div>
              <button type="button" onClick={prevStep} style={{ marginRight: 8 }}>Atrás</button>
              <button type="button" onClick={nextStep} style={{ marginLeft: 8 }}>Continuar</button>
            </div>
          )}
        </div>
        {/* Paso 6: Submit final */}
        <div style={{ marginBottom: 20, border: step >= 5 ? '2px solid #1976d2' : '1px solid #ddd', borderRadius: 8, padding: 16, background: step >= 5 ? '#f0f6ff' : '#fafbfc' }}>
          <div onClick={() => setStep(5)} style={{ cursor: 'pointer' }}><b>6. Guardar proyecto</b></div>
          {step >= 5 && (
            <div style={{ marginTop: 8 }}>
              <button type="button" onClick={prevStep} disabled={submitting}>Atrás</button>
              <button type="submit" style={{ marginLeft: 8 }} disabled={submitting || success}>Guardar proyecto</button>
              {submitting && <span style={{ marginLeft: 16, color: '#888' }}>Enviando...</span>}
              {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
              {success && <div style={{ color: 'green', marginTop: 12 }}><b>¡Proyecto creado exitosamente!</b></div>}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
