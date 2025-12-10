import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { getTopWords } from '../services/vocabularyData';

interface TopWordsProps {
  onWordClick: (word: string) => void;
}

export function TopWords({ onWordClick }: TopWordsProps) {
  const topKriolWords = getTopWords('kriol', 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <div className="gradient-card rounded-2xl shadow-medium border border-border/50 p-4 md:p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-lg text-foreground">
            📊 Palavras mais traduzidas
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {topKriolWords.map((entry, index) => (
            <motion.button
              key={entry.word}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onWordClick(entry.word)}
              className="px-4 py-2 bg-secondary hover:bg-secondary/80 rounded-full text-sm font-medium text-secondary-foreground transition-all flex items-center gap-2"
            >
              <span className="text-base">🇬🇼</span>
              <span>{entry.word}</span>
              <span className="text-xs text-muted-foreground">→ {entry.translation}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
