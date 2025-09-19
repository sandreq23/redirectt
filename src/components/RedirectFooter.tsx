import React, { useState } from 'react';
import { useRoute } from '../context/RouteContext';
import { Settings } from 'lucide-react';

const RedirectFooter: React.FC = () => {
  const { navigateTo, currentRoute } = useRoute();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  
  const handleConfigAccess = () => {
    if (currentRoute === 'config') {
      navigateTo('redirect');
    } else {
      setShowPinInput(true);
    }
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo('config', pin);
    setPin('');
    setShowPinInput(false);
  };
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Secure Redirect. All rights reserved.
          </p>
          
          <div className="mt-3 sm:mt-0 flex items-center">
            {showPinInput ? (
              <form onSubmit={handlePinSubmit} className="flex items-center">
                <input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="text-sm border border-gray-300 rounded-l-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={4}
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoFocus
                />
                <button
                  type="submit"
                  className="text-sm text-white bg-blue-500 hover:bg-blue-600 px-3 py-1 rounded-r-md transition-colors"
                >
                  Go
                </button>
                <button
                  type="button"
                  onClick={() => setShowPinInput(false)}
                  className="text-sm text-gray-500 hover:text-gray-700 ml-2"
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button 
                onClick={handleConfigAccess}
                className="text-sm text-gray-500 hover:text-gray-700 flex items-center px-3 py-1 rounded-md hover:bg-gray-100 transition-colors"
              >
                <Settings className="h-4 w-4 mr-1" />
                {currentRoute === 'config' ? 'Back to Redirect' : 'Configure'}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default RedirectFooter;