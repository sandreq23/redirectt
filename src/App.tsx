import React from 'react';
import { RouteProvider } from './context/RouteContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <RouteProvider>
      <AppRoutes />
    </RouteProvider>
  );
}

export default App;