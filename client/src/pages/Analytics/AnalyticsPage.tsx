import React from 'react';
import MainLayout from '../../components/Layout/MainLayout';
import AnalyticsDashboard from '../../components/Analytics/AnalyticsDashboard';

const AnalyticsPage: React.FC = () => {
  return (
    <MainLayout>
      <AnalyticsDashboard />
    </MainLayout>
  );
};

export default AnalyticsPage; 