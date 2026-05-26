import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { SurveysPage } from './pages/SurveysPage';
import { FamiliesPage } from './pages/FamiliesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/encuestas" replace />} />
          <Route path="/encuestas" element={<SurveysPage />} />
          <Route path="/familias" element={<FamiliesPage />} />
          <Route path="/reportes" element={<ReportsPage />} />
          <Route path="/configuracion" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
