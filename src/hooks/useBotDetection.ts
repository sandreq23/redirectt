import { useState, useEffect } from 'react';

interface BotDetectionResult {
  isBot: boolean;
  reason?: string;
}

export const useBotDetection = (): BotDetectionResult => {
  const [result, setResult] = useState<BotDetectionResult>({ isBot: false });

  useEffect(() => {
    const detectBot = () => {
      // Check for common bot indicators
      const indicators = {
        // Check if navigator.webdriver is present (used by Selenium)
        webdriver: Boolean(navigator?.webdriver),
        
        // Check for headless browser indicators
        headless: !navigator?.languages?.length || navigator?.languages[0] !== navigator?.language,
        
        // Check for automation frameworks
        automation: Boolean((window as any).callPhantom) || 
                   Boolean((window as any)._phantom) || 
                   Boolean((window as any).__nightmare) ||
                   Boolean((document as any).__selenium_unwrapped),
        
        // Check for suspicious screen properties
        screen: window.screen.width < 100 || window.screen.height < 100,
        
        // Check for suspicious performance timing
        timing: performance.timing.navigationStart === 0,
        
        // Check for common bot user agents
        userAgent: /bot|crawler|spider|crawling/i.test(navigator.userAgent),
      };

      // Check for suspicious behavior
      const suspicious = Object.entries(indicators).find(([key, value]) => value);
      
      if (suspicious) {
        setResult({ 
          isBot: true, 
          reason: `Suspicious activity detected: ${suspicious[0]}` 
        });
        return;
      }

      // Monitor user behavior
      let mouseMovements = 0;
      let keyPresses = 0;
      const startTime = Date.now();

      const handleMouseMove = () => {
        mouseMovements++;
        checkBehavior();
      };

      const handleKeyPress = () => {
        keyPresses++;
        checkBehavior();
      };

      const checkBehavior = () => {
        const timeElapsed = Date.now() - startTime;
        
        // Check for unnaturally precise or regular movements
        if (mouseMovements > 0 && timeElapsed > 0) {
          const movementsPerSecond = (mouseMovements / timeElapsed) * 1000;
          if (movementsPerSecond > 50) { // Too many movements per second
            setResult({ 
              isBot: true, 
              reason: 'Suspicious mouse movement pattern' 
            });
            cleanup();
          }
        }

        // Check for unnaturally fast key presses
        if (keyPresses > 0 && timeElapsed > 0) {
          const pressesPerSecond = (keyPresses / timeElapsed) * 1000;
          if (pressesPerSecond > 20) { // Too many key presses per second
            setResult({ 
              isBot: true, 
              reason: 'Suspicious keyboard activity' 
            });
            cleanup();
          }
        }
      };

      const cleanup = () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('keypress', handleKeyPress);
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('keypress', handleKeyPress);

      return cleanup;
    };

    return detectBot();
  }, []);

  return result;
};