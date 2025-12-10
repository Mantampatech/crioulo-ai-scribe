import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Header } from '../components/Header';
import { TranslatorCard } from '../components/TranslatorCard';
import { TopWords } from '../components/TopWords';
import { CTABanner } from '../components/CTABanner';

const HomePage = () => {
  const translatorRef = useRef<HTMLDivElement>(null);
  const [initialWord, setInitialWord] = useState('');

  const handleWordClick = (word: string) => {
    setInitialWord(word);
    translatorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background pattern-bg">
      <Header />

      {/* Hero Section */}
      <main className="pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Hero Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8 md:mb-12"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4"
            >
              🇬🇼 Especializado em Crioulo da Guiné-Bissau
            </motion.div>
            
            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              Traduza com{' '}
              <span className="text-gradient">Inteligência</span>
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              O tradutor mais avançado para Crioulo da Guiné-Bissau. 
              Com correção automática, aprendizado contínuo e dicionário expandido.
            </p>

            {/* Language Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              {[
                { flag: '🇧🇷', name: 'Português' },
                { flag: '🇬🇼', name: 'Kriol' },
                { flag: '🇺🇸', name: 'English' },
                { flag: '🇫🇷', name: 'Français' },
                { flag: '🇩🇪', name: 'Deutsch' },
                { flag: '🇸🇳', name: 'Wolof' },
              ].map((lang, i) => (
                <motion.span
                  key={lang.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * i, duration: 0.3 }}
                  className="px-3 py-1.5 bg-secondary rounded-full text-sm font-medium text-secondary-foreground"
                >
                  {lang.flag} {lang.name}
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* Translator Card */}
          <div ref={translatorRef}>
            <TranslatorCard />
          </div>

          {/* Top Words */}
          <TopWords onWordClick={handleWordClick} />

          {/* CTA Banner */}
          <CTABanner />

          {/* Features Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                icon: '🧠',
                title: 'Correção Inteligente',
                description: 'Detecta e sugere correções para erros ortográficos em Crioulo',
              },
              {
                icon: '📚',
                title: 'Dicionário Expandido',
                description: 'Baseado em dicionários académicos de Crioulo da Guiné-Bissau',
              },
              {
                icon: '🎯',
                title: 'Aprende com Você',
                description: 'O sistema melhora com o seu feedback e contribuições',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="gradient-card rounded-2xl border border-border/50 p-6 text-center hover:shadow-medium transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-display font-bold text-lg text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            🌍 No Crioulo © {new Date().getFullYear()} — Tradutor Inteligente de Crioulo da Guiné-Bissau
          </p>
          <p className="text-muted-foreground text-xs mt-2">
            Baseado nos dicionários de Luigi Scantamburlo e Cirineu Cecote Stein
          </p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
