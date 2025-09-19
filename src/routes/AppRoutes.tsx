import React from 'react';
import RedirectPage from '../pages/RedirectPage';
import ConfigPage from '../pages/ConfigPage';
import { useRoute } from '../context/RouteContext';

const AppRoutes: React.FC = () => {
  const { currentRoute } = useRoute();

  switch (currentRoute) {
    case 'config':
      return <ConfigPage />;
    case 'redirect':
    default:
      return <RedirectPage />;
  }
};

export default AppRoutes;