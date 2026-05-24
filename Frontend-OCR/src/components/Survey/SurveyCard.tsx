import React from 'react';
import './SurveyCard.css';

interface SurveyCardProps {
  title: string;
  description: string;
  status: 'Pendiente' | 'Revisado';
}

export const SurveyCard: React.FC<SurveyCardProps> = ({ title, description }) => {
  return (
    <div className="survey-card">
      <h3 className="survey-card-title">{title}</h3>
      <p className="survey-card-description">{description}</p>
      <button className="survey-card-button">Revisar</button>
    </div>
  );
};
