import { useState, useEffect } from 'react';
import { useConfig } from './useConfig';

interface RedirectParams {
  targetUrl: string;
  isValid: boolean;
  errorMessage: string | null;
}

export const useRedirectParams = (): RedirectParams => {
  const { config } = useConfig();
  const [params, setParams] = useState<RedirectParams>({
    targetUrl: '',
    isValid: false,
    errorMessage: null
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const redirectTo = searchParams.get('to') || searchParams.get('redirect') || searchParams.get('url');
    
    if (redirectTo) {
      try {
        // Basic URL validation
        new URL(redirectTo);
        setParams({
          targetUrl: redirectTo,
          isValid: true,
          errorMessage: null
        });
      } catch (e) {
        setParams({
          targetUrl: '',
          isValid: false,
          errorMessage: 'The provided redirect URL is invalid.'
        });
      }
    } else if (config.defaultTargetUrl) {
      try {
        // Validate default URL
        new URL(config.defaultTargetUrl);
        setParams({
          targetUrl: config.defaultTargetUrl,
          isValid: true,
          errorMessage: null
        });
      } catch (e) {
        setParams({
          targetUrl: '',
          isValid: false,
          errorMessage: 'The default redirect URL is invalid.'
        });
      }
    } else {
      setParams({
        targetUrl: '',
        isValid: false,
        errorMessage: 'No redirect URL was provided.'
      });
    }
  }, [config.defaultTargetUrl]);

  return params;
};