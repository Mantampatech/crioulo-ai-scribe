import { useState, useEffect } from 'react';
import { detectLanguage } from '../services/translationService';

export function useLanguageDetection(text: string, debounceMs: number = 300) {
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);

  useEffect(() => {
    if (!text || text.trim().length < 2) {
      setDetectedLanguage(null);
      return;
    }

    setIsDetecting(true);
    
    const timeoutId = setTimeout(() => {
      const detected = detectLanguage(text);
      setDetectedLanguage(detected !== 'unknown' ? detected : null);
      setIsDetecting(false);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, debounceMs]);

  return { detectedLanguage, isDetecting };
}
