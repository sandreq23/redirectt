import React, { useEffect, useState } from 'react';
import CaptchaContainer from '../components/CaptchaContainer';
import RedirectHeader from '../components/RedirectHeader';
import RedirectFooter from '../components/RedirectFooter';
import { useRedirectParams } from '../hooks/useRedirectParams';
import { useConfig } from '../hooks/useConfig';
import { useBotDetection } from '../hooks/useBotDetection';
import { MonitorSpeaker, AlertCircle, Bot } from 'lucide-react';

const RedirectPage: React.FC = () => {
  const { targetUrl, isValid, errorMessage } = useRedirectParams();
  const { config } = useConfig();
  const { isBot, reason } = useBotDetection();
  const [verified, setVerified] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [lastVerificationTime, setLastVerificationTime] = useState(0);
  const [verificationAttempts, setVerificationAttempts] = useState(0);

  useEffect(() => {
    if (verified && targetUrl) {
      setRedirecting(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            window.location.href = targetUrl;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [verified, targetUrl]);

  const handleVerificationSuccess = () => {
    const now = Date.now();
    
    // Rate limiting checks
    if (verificationAttempts >= 5 && now - lastVerificationTime < 3600000) {
      return; // Too many attempts within an hour
    }
    
    // Update verification metrics
    setVerificationAttempts(prev => prev + 1);
    setLastVerificationTime(now);
    
    setVerified(true);
  };

  if (isBot) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-500 p-4 flex items-center justify-center">
            <Bot className="text-white h-8 w-8" />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-4">Automated access to this page is not allowed.</p>
            {reason && (
              <p className="text-sm text-gray-500 mt-2">Reason: {reason}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-red-500 p-4 flex items-center justify-center">
            <AlertCircle className="text-white h-8 w-8" />
          </div>
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Invalid Configuration</h1>
            <p className="text-gray-600 mb-4">{errorMessage || "The redirect configuration is invalid or missing."}</p>
            <p className="text-gray-500 text-sm">
              If you believe this is an error, please contact the sender of the email.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-green-500 p-4 flex items-center justify-center">
            <MonitorSpeaker className="text-white h-8 w-8" />
          </div>
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Verification Complete</h1>
            <p className="text-gray-600 mb-6">
              You will be redirected in <span className="font-bold">{countdown}</span> seconds...
            </p>
            <div className="flex justify-center mb-4">
              <div className="rounded-full h-2 bg-gray-200 w-48">
                <div 
                  className="h-2 bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
                  style={{width: `${((5 - countdown) / 5) * 100}%`}}
                ></div>
              </div>
            </div>
            <button 
              onClick={() => window.location.href = targetUrl}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Redirect Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ 
        backgroundColor: config.theme.backgroundColor,
        color: config.theme.textColor
      }}
    >
      <RedirectHeader />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 animate-fadeIn">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Verify to Continue</h1>
          <p className="text-gray-600 mb-6">
            Please complete the verification below to proceed to your destination.
          </p>
          
          <CaptchaContainer onVerificationSuccess={handleVerificationSuccess} />
          
          {config.showDestinationUrl && (
            <div className="mt-6 text-gray-500 text-sm">
              <p>
                You are being redirected to: 
                <span className="block mt-1 font-medium text-gray-700 truncate">
                  {targetUrl}
                </span>
              </p>
            </div>
          )}
        </div>
      </main>
      
      <RedirectFooter />
    </div>
  );
};

export default RedirectPage;