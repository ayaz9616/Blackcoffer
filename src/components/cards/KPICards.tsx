import React from 'react';

interface KPICardsProps {
  total: number;
  avgIntensity: number;
  avgRelevance: number;
  avgLikelihood: number;
  activeTopics: number;
}

const cardData = [
  { key: 'total', label: 'Total Entries' },
  { key: 'avgIntensity', label: 'Avg Intensity' },
  { key: 'avgRelevance', label: 'Avg Relevance' },
  { key: 'avgLikelihood', label: 'Avg Likelihood' },
  { key: 'activeTopics', label: 'Active Topics' },
];

export default function KPICards(props: KPICardsProps) {
  return (
    <>
      {cardData.map(card => (
        <div key={card.key} className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold mb-2">
            {card.key === 'total' && props.total}
            {card.key === 'avgIntensity' && props.avgIntensity.toFixed(2)}
            {card.key === 'avgRelevance' && props.avgRelevance.toFixed(2)}
            {card.key === 'avgLikelihood' && props.avgLikelihood.toFixed(2)}
            {card.key === 'activeTopics' && props.activeTopics}
          </div>
          <div className="text-sm text-gray-500">{card.label}</div>
        </div>
      ))}
    </>
  );
} 