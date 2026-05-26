import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './styles/theme';
import { Layout } from './components/Layout/Layout';
import { SurveysPage } from './pages/SurveysPage';
import { FamiliesPage } from './pages/FamiliesPage';
import { ReportsPage } from './pages/ReportsPage';
import { SettingsPage } from './pages/SettingsPage';
import { ReviewSurveyPage } from './pages/ReviewSurveyPage';
import './App.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/encuestas" replace />} />
            <Route path="/encuestas" element={<SurveysPage />} />
            <Route path="/encuestas/revisar/:id" element={<ReviewSurveyPage />} />
            <Route path="/familias" element={<FamiliesPage />} />
            <Route path="/reportes" element={<ReportsPage />} />
            <Route path="/configuracion" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
