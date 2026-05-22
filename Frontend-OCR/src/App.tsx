import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('Encuestas');

  return (
    <Layout onSelectTab={setCurrentTab}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-text-dark)', fontFamily: 'var(--font-family)', fontWeight: 700 }}>
          {currentTab === 'Encuestas' ? 'Encuestas pendientes de revision' : currentTab}
        </h1>
        <p style={{ margin: 0, color: 'var(--color-text-muted)', fontFamily: 'var(--font-family)' }}>
          Contenido de la seccion {currentTab}.
        </p>
      </div>
    </Layout>
  );
}

export default App;

