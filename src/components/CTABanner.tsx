import { motion } from 'framer-motion';
import { Gift, BookOpen, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export function CTABanner() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="w-full max-w-3xl mx-auto mt-8"
    >
      <div className="gradient-hero rounded-2xl shadow-strong p-6 md:p-8 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Gift className="w-6 h-6" />
                <h3 className="font-display font-bold text-xl md:text-2xl">
                  🎁 10 traduções grátis!
                </h3>
              </div>
              <p className="text-white/90 text-sm md:text-base max-w-md">
                Crie uma conta gratuita e receba 10 traduções por dia. 
                Ajude a melhorar nosso dicionário enviando PDFs!
              </p>
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <BookOpen className="w-4 h-4" />
                <span>📚 Ajude a melhorar: Envie dicionários PDF!</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Link to="/signup">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="w-full md:w-auto bg-white text-foreground hover:bg-white/90 font-bold"
                >
                  Criar Conta Grátis
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
              <Link to="/login" className="text-center text-sm text-white/80 hover:text-white transition-colors">
                Já tenho conta
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
