import React, { useRef, useState, useEffect } from 'react';
import { useConfig } from '../hooks/useConfig';

interface CloudflareTurnstileProps {
  onVerificationSuccess: () => void;
}

const CloudflareTurnstile: React.FC<CloudflareTurnstileProps> = ({ onVerificationSuccess }) => {
  const { config } = useConfig();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resetTimer = setInterval(() => {
      if (Date.now() - lastAttemptTime > config.turnstile.cooldownPeriod) {
        setAttempts(0);
      }
    }, 60000);

    return () => clearInterval(resetTimer);
  }, [lastAttemptTime, config.turnstile.cooldownPeriod]);

  useEffect(() => {
    let mounted = true;
    let retryCount = 0;
    const maxRetries = 3;

    const initializeTurnstile = () => {
      if (!containerRef.current || !window.turnstile) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(initializeTurnstile, 1000);
        } else {
          setError('Failed to load verification widget.');
          setIsLoading(false);
        }
        return;
      }

      try {
        if (mounted) {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: config.turnstile.siteKey,
            callback: handleVerify,
            'expired-callback': () => {
              setError('Verification expired. Please try again.');
              if (widgetId) window.turnstile.reset(widgetId);
            },
            'error-callback': () => {
              setError('An error occurred. Please try again.');
            },
            'timeout-callback': () => {
              setError('Verification timed out. Please try again.');
            },
            action: 'redirect_verification',
            theme: 'light',
            size: 'normal',
            appearance: 'always',
            language: 'auto',
            retry: 'never'
          });
          setWidgetId(id);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Turnstile initialization error:', err);
        setError('Failed to load verification widget.');
        setIsLoading(false);
      }
    };

    const initTimer = setTimeout(initializeTurnstile, 500);

    return () => {
      mounted = false;
      clearTimeout(initTimer);
      if (widgetId && window.turnstile) {
        try {
          window.turnstile.remove(widgetId);
        } catch (err) {
          console.error('Error removing Turnstile widget:', err);
        }
      }
    };
  }, [config.turnstile.siteKey]);

  const handleVerify = async (token: string) => {
    if (!token) {
      setError('Verification failed. Please try again.');
      return;
    }

    if (attempts >= config.turnstile.maxAttempts) {
      setError('Too many attempts. Please try again later.');
      return;
    }

    if (Date.now() - lastAttemptTime < 2000) {
      setError('Please wait before trying again.');
      return;
    }

    setVerifying(true);
    setError(null);
    setAttempts(prev => prev + 1);
    setLastAttemptTime(Date.now());

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      onVerificationSuccess();
    } catch (err) {
      console.error('Verification error:', err);
      setError('Failed to verify. Please try again.');
      if (widgetId && window.turnstile) window.turnstile.reset(widgetId);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-sm text-gray-600">Loading verification...</span>
        </div>
      )}
      
      <div 
        ref={containerRef}
        className={`transition-opacity duration-300 ${verifying || isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      ></div>
      
      {error && (
        <p className="mt-2 text-red-500 text-sm">{error}</p>
      )}
      
      {verifying && (
        <div className="mt-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
          <span className="text-sm text-gray-600">Verifying...</span>
        </div>
      )}
    </div>
  );
};

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: any) => string;
      reset: (widgetId: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

export default CloudflareTurnstile;