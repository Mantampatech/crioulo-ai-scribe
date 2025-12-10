import { useState, useEffect } from 'react';
import { checkSpelling, SpellingSuggestion } from '../services/translationService';

export function useSpellCheck(text: string, lang: string, debounceMs: number = 500) {
  const [suggestions, setSuggestions] = useState<SpellingSuggestion[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (!text || text.trim().length < 2 || (lang !== 'kriol' && lang !== 'pt')) {
      setSuggestions([]);
      return;
    }

    setIsChecking(true);

    const timeoutId = setTimeout(() => {
      const spellingSuggestions = checkSpelling(text, lang);
      setSuggestions(spellingSuggestions);
      setIsChecking(false);
    }, debounceMs);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [text, lang, debounceMs]);

  const acceptSuggestion = (original: string, suggestion: string): string => {
    return text.replace(new RegExp(`\\b${original}\\b`, 'gi'), suggestion);
  };

  const ignoreSuggestion = (original: string) => {
    setSuggestions(prev => prev.filter(s => s.original !== original));
  };

  return { 
    suggestions, 
    isChecking, 
    acceptSuggestion, 
    ignoreSuggestion 
  };
}
