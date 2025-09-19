import React from 'react';
import { Shield } from 'lucide-react';
import { useConfig } from '../hooks/useConfig';

const RedirectHeader: React.FC = () => {
  const { config } = useConfig();
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-blue-500 mr-3" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {config.headerTitle || 'Secure Redirect'}
            </h1>
            {config.headerSubtitle && (
              <p className="text-sm text-gray-500">{config.headerSubtitle}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center">
          {config.rightLogoUrl ? (
            <img 
              src={config.rightLogoUrl} 
              alt="Right Logo" 
              className="h-8 object-contain" 
            />
          ) : (
            <div className="h-8 w-28 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-400 text-xs">Right Logo</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default RedirectHeader;