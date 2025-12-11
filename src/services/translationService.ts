import { searchVocabulary, findSimilarWords, wordExists, commonPhrases, VocabularyEntry } from './vocabularyData';

export interface TranslationResult {
  translation: string;
  source: 'vocabulary' | 'ai' | 'phrase';
  confidence: number;
  examples?: { original: string; translated: string }[];
  suggestions?: SpellingSuggestion[];
}

export interface SpellingSuggestion {
  original: string;
  suggestion: string;
  confidence: number;
}

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
  native: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  { code: 'pt', name: 'Português', flag: '🇧🇷', native: 'Português' },
  { code: 'en', name: 'English', flag: '🇺🇸', native: 'English' },
  { code: 'fr', name: 'French', flag: '🇫🇷', native: 'Français' },
  { code: 'de', name: 'German', flag: '🇩🇪', native: 'Deutsch' },
  { code: 'kriol', name: 'Crioulo da Guiné-Bissau', flag: '🇬🇼', native: 'Kriol' },
  { code: 'wo', name: 'Wolof', flag: '🇸🇳', native: 'Wolof' },
];

// Detect if text is Crioulo
export function detectLanguage(text: string): string {
  const normalizedText = text.toLowerCase().trim();
  
  // Common Crioulo indicators
  const kriolIndicators = [
    'n\'', 'bu', 'no', 'elis', 'ka', 'ta', 'na', 'ku', 'di', 'pa',
    'kasa', 'omi', 'mindjer', 'mininu', 'bianda', 'tarbadju', 'papia',
    'kume', 'durmi', 'bai', 'bin', 'odja', 'sibi', 'pudi', 'tene',
    'tcheu', 'kuma', 'undi', 'kantu', 'pabia', 'tabanka', 'tchon',
    'tchuba', 'fidju', 'mame', 'pape', 'amigu', 'djungutu', 'barsa',
    'yabri', 'grandi', 'pekenu', 'bonitu', 'djintis', 'tchiga',
  ];
  
  // Portuguese indicators (that differ from Crioulo)
  const ptIndicators = [
    'você', 'está', 'são', 'não', 'sim', 'fazer', 'dizer', 'comer',
    'beber', 'dormir', 'trabalho', 'casa', 'homem', 'mulher', 'filho',
    'mãe', 'pai', 'amigo', 'bonito', 'grande', 'pequeno', 'água',
    'comida', 'escola', 'livro', 'carro', 'terra', 'chuva', 'peixe',
  ];
  
  const words = normalizedText.split(/\s+/);
  let kriolScore = 0;
  let ptScore = 0;
  
  for (const word of words) {
    if (kriolIndicators.includes(word)) kriolScore++;
    if (ptIndicators.includes(word)) ptScore++;
  }
  
  // Check for Crioulo-specific patterns
  if (normalizedText.includes('n\'') || normalizedText.includes('n\'')) kriolScore += 2;
  if (/\b(ku|di|pa|na|ta)\b/.test(normalizedText)) kriolScore += 1;
  if (/tch[a-z]+/i.test(normalizedText)) kriolScore += 1; // tchuba, tcheu, etc.
  if (/dj[a-z]+/i.test(normalizedText)) kriolScore += 1; // djungutu, djintis, etc.
  
  if (kriolScore > ptScore && kriolScore >= 1) {
    return 'kriol';
  } else if (ptScore > 0) {
    return 'pt';
  }
  
  // Default to Portuguese if unsure
  return 'unknown';
}

// Check spelling and get suggestions
export function checkSpelling(text: string, lang: string): SpellingSuggestion[] {
  if (lang !== 'kriol' && lang !== 'pt') return [];
  
  const words = text.split(/\s+/);
  const suggestions: SpellingSuggestion[] = [];
  
  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:'"]/g, '');
    if (cleanWord.length < 2) continue;
    
    // Skip if word exists
    if (wordExists(cleanWord, lang as 'kriol' | 'pt')) continue;
    
    // Find similar words
    const similar = findSimilarWords(cleanWord, lang as 'kriol' | 'pt');
    if (similar.length > 0) {
      suggestions.push({
        original: cleanWord,
        suggestion: similar[0].word,
        confidence: similar[0].similarity,
      });
    }
  }
  
  return suggestions;
}

// Translate text
export async function translate(
  text: string,
  fromLang: string,
  toLang: string
): Promise<TranslationResult> {
  const normalizedText = text.toLowerCase().trim();
  
  // 1. Check for common phrases first
  const phrase = commonPhrases.find(p => {
    if (fromLang === 'kriol') return p.kriol.toLowerCase() === normalizedText;
    if (fromLang === 'pt') return p.pt.toLowerCase() === normalizedText;
    if (fromLang === 'en') return p.en.toLowerCase() === normalizedText;
    return false;
  });
  
  if (phrase) {
    let translation = '';
    if (toLang === 'kriol') translation = phrase.kriol;
    else if (toLang === 'pt') translation = phrase.pt;
    else if (toLang === 'en') translation = phrase.en;
    
    if (translation) {
      return {
        translation,
        source: 'phrase',
        confidence: 1,
      };
    }
  }
  
  // 2. Check vocabulary for word-by-word translation
  const words = text.split(/\s+/);
  const translatedWords: string[] = [];
  let vocabularyHits = 0;
  let examples: { original: string; translated: string }[] = [];
  
  for (const word of words) {
    const cleanWord = word.replace(/[.,!?;:'"]/g, '');
    const punctuation = word.match(/[.,!?;:'"]+$/)?.[0] || '';
    
    const entry = searchVocabulary(cleanWord, fromLang, toLang);
    if (entry) {
      translatedWords.push(entry.translation + punctuation);
      vocabularyHits++;
      if (entry.examples.length > 0 && examples.length < 2) {
        examples.push(...entry.examples);
      }
    } else {
      // Keep original word if no translation found
      translatedWords.push(word);
    }
  }
  
  // Check spelling for source language
  const suggestions = fromLang === 'kriol' || fromLang === 'pt' 
    ? checkSpelling(text, fromLang) 
    : [];
  
  const confidence = words.length > 0 ? vocabularyHits / words.length : 0;
  
  // If we have good vocabulary coverage
  if (confidence > 0.3) {
    return {
      translation: translatedWords.join(' '),
      source: 'vocabulary',
      confidence,
      examples: examples.length > 0 ? examples : undefined,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }
  
// 3. Use AI for intelligent translation
  try {
    const aiResult = await translateWithAI(text, fromLang, toLang);
    return {
      ...aiResult,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  } catch (error) {
    console.error('AI translation failed, using vocabulary fallback:', error);
    // Fallback to vocabulary if AI fails
    return {
      translation: translatedWords.join(' '),
      source: 'vocabulary',
      confidence,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
    };
  }
}

// AI-powered translation
async function translateWithAI(
  text: string,
  fromLang: string,
  toLang: string
): Promise<TranslationResult> {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/translate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ text, fromLang, toLang }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Translation failed' }));
    throw new Error(error.error || 'Translation failed');
  }

  const data = await response.json();
  return {
    translation: data.translation,
    source: 'ai',
    confidence: data.confidence || 0.95,
  };
}

// Get language info by code
export function getLanguageInfo(code: string): LanguageInfo | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}
