import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Crown, 
  ArrowLeft,
  History,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';

interface TranslationHistoryItem {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: Date;
}

const ProfilePage = () => {
  const { user, profile, loading } = useAuth();
  const [translationHistory, setTranslationHistory] = useState<TranslationHistoryItem[]>([]);

  useEffect(() => {
    // Load translation history from localStorage
    const stored = localStorage.getItem('translation_history');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTranslationHistory(parsed.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        })));
      } catch (e) {
        console.error('Error parsing translation history:', e);
      }
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleUpgradePremium = () => {
    window.open('https://buy.stripe.com/bJe9AVfKLbGU476fyEf3a00', '_blank');
  };

  const languageNames: Record<string, string> = {
    'pt': 'Português',
    'en': 'Inglês',
    'fr': 'Francês',
    'de': 'Alemão',
    'kriol': 'Crioulo',
    'wo': 'Wolof'
  };

  return (
    <div className="min-h-screen bg-background pattern-bg">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-2xl shadow-medium border border-border/50 p-6"
          >
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex items-start gap-4 flex-1">
                <div className="w-16 h-16 rounded-full gradient-hero flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {profile?.displayName?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="font-display font-bold text-xl text-foreground">
                    {profile?.displayName || 'Usuário'}
                  </h2>
                  <p className="text-muted-foreground text-sm flex items-center gap-1 mt-1">
                    <Mail className="w-4 h-4" />
                    {profile?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      profile?.plan === 'premium' 
                        ? 'bg-primary/10 text-primary' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <Crown className="w-3 h-3" />
                      {profile?.plan === 'premium' ? 'Premium' : 'Gratuito'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Premium Upgrade Section */}
              {profile?.plan !== 'premium' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-full md:w-auto"
                >
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">Upgrade Premium</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Traduções ilimitadas e recursos exclusivos!
                    </p>
                    <Button 
                      onClick={handleUpgradePremium}
                      className="w-full gradient-hero text-white hover:opacity-90"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      Assinar Premium
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Traduções hoje</span>
                <span className="font-semibold text-foreground">
                  {profile?.translationsUsed || 0}/{profile?.translationsLimit || 10}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div 
                  className="gradient-hero h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(((profile?.translationsUsed || 0) / (profile?.translationsLimit || 10)) * 100, 100)}%` 
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Limite reseta à meia-noite
              </p>
            </div>
          </motion.div>

          {/* Translation History Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gradient-card rounded-2xl shadow-medium border border-border/50 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <History className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg text-foreground">
                📜 Histórico de Traduções
              </h3>
            </div>

            {translationHistory.length === 0 ? (
              <div className="text-center py-8">
                <History className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-muted-foreground">
                  Nenhuma tradução ainda. Comece a traduzir para ver seu histórico aqui!
                </p>
                <Link to="/">
                  <Button className="mt-4 gradient-hero text-white">
                    Fazer uma tradução
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {translationHistory.slice().reverse().map((item) => (
                  <div 
                    key={item.id}
                    className="bg-secondary/50 rounded-lg p-4 hover:bg-secondary/70 transition-colors"
                  >
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                        {languageNames[item.sourceLang] || item.sourceLang}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="px-2 py-0.5 bg-accent/10 text-accent-foreground rounded-full">
                        {languageNames[item.targetLang] || item.targetLang}
                      </span>
                      <span className="ml-auto">
                        {item.timestamp.toLocaleDateString('pt-BR', { 
                          day: '2-digit', 
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-foreground font-medium truncate">
                      {item.sourceText}
                    </p>
                    <p className="text-sm text-muted-foreground truncate mt-1">
                      → {item.translatedText}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
