import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import ContentRecommendations from '../../components/AI/ContentRecommendations';

const AIRecommendationsPage: React.FC = () => {
  return (
    <MainLayout>
      <ContentRecommendations />
    </MainLayout>
  );
};

export default AIRecommendationsPage; 