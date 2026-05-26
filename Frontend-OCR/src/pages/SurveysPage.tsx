import React from 'react';
import SurveyList from '../components/Survey/SurveyList';

export const SurveysPage: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h1 style={{ margin: 0, fontSize: '28px', color: 'var(--color-text-dark)', fontFamily: 'var(--font-family)', fontWeight: 700 }}>
        Encuestas pendientes de revisión
      </h1>
      <SurveyList />
    </div>
  );
};

export default SurveysPage;
