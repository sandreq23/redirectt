import React from 'react';
import CloudflareTurnstile from './CloudflareTurnstile';

interface CaptchaContainerProps {
  onVerificationSuccess: () => void;
}

const CaptchaContainer: React.FC<CaptchaContainerProps> = ({ onVerificationSuccess }) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
        <CloudflareTurnstile onVerificationSuccess={onVerificationSuccess} />
      </div>
    </div>
  );
};

export default CaptchaContainer;