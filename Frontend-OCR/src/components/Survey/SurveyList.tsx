import { SurveyCard } from './SurveyCard';
import './SurveyList.css';

const SurveyList = () => {
  // Datos de ejemplo para 16 tarjetas (4x4)
  const surveys = Array.from({ length: 24 }, (_, i) => ({
    id: i + 1,
    title: `Encuesta N° ${i + 1}`,
    description: 'Breve descripción de la encuesta pendiente de revisión.',
  }));

  return (
    <div className="survey-grid">
      {surveys.map((survey) => (
        <SurveyCard
          key={survey.id}
          title={survey.title}
          description={survey.description}
        />
      ))}
    </div>
  );
};

export default SurveyList;
