import React from "react";

export default function NotFound({ currentScreen, onBack }) {
  return (
    <div className="page-container" style={{
      background: '#fff3cd',
      border: '1px solid #ffeaa7',
      borderRadius: '8px',
      padding: 20
    }}>
      <h2>🔍 Pantalla no encontrada</h2>
      <p>No se encontró configuración para: <strong>{currentScreen}</strong></p>
      <div style={{ marginTop: 12 }}>
        <button className="btn btn-primary" onClick={onBack}>Volver al Dashboard</button>
      </div>
    </div>
  );
}
