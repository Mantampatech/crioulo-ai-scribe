import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightLeft, 
  Copy, 
  ThumbsUp, 
  ThumbsDown, 
  Lightbulb,
  Check,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Button } from './ui/button';
import { useLanguageDetection } from '../hooks/useLanguageDetection';
import { useSpellCheck } from '../hooks/useSpellCheck';
import { translate, SUPPORTED_LANGUAGES, getLanguageInfo, TranslationResult } from '../services/translationService';
import { useToast } from '../hooks/use-toast';
import { useAuth } from '../contexts/AuthContext';
import { PaywallModal } from './PaywallModal';

const FREE_TRANSLATIONS_LIMIT = 10;
const TRANSLATIONS_KEY = 'nocrioulo_translations_count';

function getStoredTranslations(): number {
  const stored = localStorage.getItem(TRANSLATIONS_KEY);
  return stored ? parseInt(stored, 10) : 0;
}

function incrementStoredTranslations(): number {
  const current = getStoredTranslations();
  const newCount = current + 1;
  localStorage.setItem(TRANSLATIONS_KEY, newCount.toString());
  return newCount;
}

export function TranslatorCard() {
  const [inputText, setInputText] = useState('');
  const [fromLang, setFromLang] = useState('pt');
  const [toLang, setToLang] = useState('kriol');
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);
  const [translationsUsed, setTranslationsUsed] = useState(0);
  
  const { detectedLanguage } = useLanguageDetection(inputText);
  const { suggestions, acceptSuggestion, ignoreSuggestion } = useSpellCheck(inputText, fromLang);
  const { toast } = useToast();
  const { user, profile, incrementTranslation } = useAuth();

  // Initialize translations count
  useEffect(() => {
    if (profile) {
      setTranslationsUsed(profile.translationsUsed);
    } else {
      setTranslationsUsed(getStoredTranslations());
    }
  }, [profile]);

  // Check if user can translate (is premium or under limit)
  const canTranslate = (): boolean => {
    // If user has premium plan, always allow
    if (profile?.plan === 'premium') return true;
    
    // Check translations count
    const count = profile ? profile.translationsUsed : getStoredTranslations();
    return count < FREE_TRANSLATIONS_LIMIT;
  };

  const handleSwapLanguages = () => {
    setFromLang(toLang);
    setToLang(fromLang);
    if (result) {
      setInputText(result.translation);
      setResult(null);
    }
  };

  const handleTranslate = useCallback(async () => {
    if (!inputText.trim()) {
      toast({
        title: "Digite algo para traduzir",
        description: "O campo de texto está vazio",
        variant: "destructive"
      });
      return;
    }

    // Check paywall
    if (!canTranslate()) {
      setShowPaywall(true);
      return;
    }

    setIsTranslating(true);
    setFeedback(null);
    
    try {
      const translationResult = await translate(inputText, fromLang, toLang);
      setResult(translationResult);
      
      // Save to translation history
      const historyItem = {
        id: Date.now().toString(),
        sourceText: inputText,
        translatedText: translationResult.translation,
        sourceLang: fromLang,
        targetLang: toLang,
        timestamp: new Date().toISOString()
      };
      const existingHistory = JSON.parse(localStorage.getItem('translation_history') || '[]');
      const updatedHistory = [...existingHistory, historyItem].slice(-50); // Keep last 50
      localStorage.setItem('translation_history', JSON.stringify(updatedHistory));
      
      // Increment translation count
      if (profile) {
        // Will be incremented via AuthContext
        incrementTranslation();
        setTranslationsUsed(profile.translationsUsed + 1);
      } else {
        const newCount = incrementStoredTranslations();
        setTranslationsUsed(newCount);
      }
    } catch (error) {
      toast({
        title: "Erro na tradução",
        description: "Ocorreu um erro ao traduzir. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsTranslating(false);
    }
  }, [inputText, fromLang, toLang, toast, profile]);

  const handleCopy = async () => {
    if (result) {
      await navigator.clipboard.writeText(result.translation);
      toast({
        title: "Copiado!",
        description: "Tradução copiada para a área de transferência",
      });
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    toast({
      title: type === 'up' ? "Obrigado! 🎉" : "Vamos melhorar!",
      description: type === 'up' 
        ? "Seu feedback ajuda a melhorar as traduções" 
        : "Agradecemos o feedback, vamos aprimorar",
    });
  };

  const handleAcceptSuggestion = (original: string, suggestion: string) => {
    const newText = acceptSuggestion(original, suggestion);
    setInputText(newText);
  };

  const fromLangInfo = getLanguageInfo(fromLang);
  const toLangInfo = getLanguageInfo(toLang);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="gradient-card rounded-2xl shadow-strong border border-border/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-lg md:text-xl text-foreground">
              Tradutor Inteligente de Crioulo
            </h2>
          </div>
          
          {/* Language detected badge */}
          <AnimatePresence>
            {detectedLanguage === 'kriol' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-medium"
              >
                🇬🇼 Crioulo detectado
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          {/* Language Selectors */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">De</label>
              <select
                value={fromLang}
                onChange={(e) => setFromLang(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-background border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapLanguages}
              className="mt-5"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </Button>

            <div className="flex-1">
              <label className="text-xs font-medium text-muted-foreground mb-1 block">Para</label>
              <select
                value={toLang}
                onChange={(e) => setToLang(e.target.value)}
                className="w-full h-11 px-3 rounded-lg bg-background border border-border text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Input Textarea */}
          <div className="relative">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Digite em ${fromLangInfo?.native || 'seu idioma'}...`}
              className="w-full min-h-[120px] p-4 rounded-xl bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  handleTranslate();
                }
              }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
              {inputText.length} caracteres
            </div>
          </div>

          {/* Spelling Suggestions */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2 text-amber-700 dark:text-amber-300">
                  <Lightbulb className="w-4 h-4" />
                  <span className="font-medium text-sm">Sugestões de correção:</span>
                </div>
                {suggestions.map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between gap-2 bg-white dark:bg-background/50 rounded-lg p-3">
                    <div className="text-sm">
                      <span className="text-muted-foreground">"{suggestion.original}"</span>
                      <span className="mx-2">→</span>
                      <span className="font-semibold text-foreground">"{suggestion.suggestion}"</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleAcceptSuggestion(suggestion.original, suggestion.suggestion)}
                      >
                        <Check className="w-3 h-3 mr-1" />
                        Aceitar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => ignoreSuggestion(suggestion.original)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Translate Button */}
          <Button
            variant="hero"
            size="xl"
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
            className="w-full"
          >
            {isTranslating ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                />
                Traduzindo...
              </>
            ) : (
              <>
                🚀 Traduzir Agora
              </>
            )}
          </Button>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="bg-accent/5 border border-accent/20 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-accent">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-semibold text-sm">Tradução:</span>
                  </div>
                  <p className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
                    {result.translation}
                  </p>
                  
                  {/* Examples */}
                  {result.examples && result.examples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <div className="flex items-center gap-2 text-muted-foreground mb-2">
                        <BookOpen className="w-4 h-4" />
                        <span className="text-xs font-medium">Exemplo de uso:</span>
                      </div>
                      {result.examples.slice(0, 1).map((ex, idx) => (
                        <div key={idx} className="text-sm space-y-1">
                          <p className="text-muted-foreground italic">"{ex.original}"</p>
                          <p className="text-foreground">"{ex.translated}"</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border/50">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      <Copy className="w-4 h-4 mr-1" />
                      Copiar
                    </Button>
                    
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm text-muted-foreground">Foi útil?</span>
                      <Button
                        variant={feedback === 'up' ? 'success' : 'ghost'}
                        size="sm"
                        onClick={() => handleFeedback('up')}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </Button>
                      <Button
                        variant={feedback === 'down' ? 'destructive' : 'ghost'}
                        size="sm"
                        onClick={() => handleFeedback('down')}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Source indicator */}
                  <div className="mt-3 text-xs text-muted-foreground">
                    📚 Fonte: {result.source === 'vocabulary' ? 'Dicionário local' : result.source === 'phrase' ? 'Frases comuns' : 'IA'}
                    {result.confidence > 0 && (
                      <span className="ml-2">
                        • Confiança: {Math.round(result.confidence * 100)}%
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Paywall Modal */}
      <PaywallModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        translationsUsed={translationsUsed}
      />
    </motion.div>
  );
}
