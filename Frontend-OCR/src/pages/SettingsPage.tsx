import React from 'react';

export const SettingsPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-text-dark)', fontFamily: 'var(--font-family)', fontWeight: 700 }}>
        Configuracion
      </h1>
      <p style={{ margin: 0, color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)' }}>
        Contenido de la sección Configuracion.
      </p>
    </div>
  );
};

export default SettingsPage;
