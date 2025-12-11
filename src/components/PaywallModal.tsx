import { motion, AnimatePresence } from 'framer-motion';
import { Lock, CreditCard, Star, Zap, X } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const STRIPE_PAYMENT_LINK = 'https://buy.stripe.com/bJe9AVfKLbGU476fyEf3a00';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  translationsUsed: number;
}

export function PaywallModal({ isOpen, onClose, translationsUsed }: PaywallModalProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePayment = () => {
    if (!user) {
      // Redirect to signup first
      navigate('/signup', { state: { redirectToPayment: true } });
    } else {
      // Open Stripe payment link
      window.open(STRIPE_PAYMENT_LINK, '_blank');
    }
  };

  const handleLogin = () => {
    navigate('/login', { state: { redirectToPayment: true } });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-card rounded-2xl shadow-strong border border-border z-50 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary/50 transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="p-6 pb-4 text-center bg-gradient-to-b from-primary/10 to-transparent">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/20 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Limite Atingido! 🔒
              </h2>
              <p className="text-muted-foreground">
                Você já usou <strong className="text-foreground">{translationsUsed}</strong> traduções gratuitas
              </p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-accent" />
                  Plano Premium
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2 text-foreground">
                    <Zap className="w-4 h-4 text-accent" />
                    Traduções ilimitadas
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Zap className="w-4 h-4 text-accent" />
                    Acesso a todos os idiomas
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Zap className="w-4 h-4 text-accent" />
                    Sugestões inteligentes avançadas
                  </li>
                  <li className="flex items-center gap-2 text-foreground">
                    <Zap className="w-4 h-4 text-accent" />
                    Histórico de traduções
                  </li>
                </ul>
              </div>

              {!user ? (
                <div className="space-y-3">
                  <p className="text-sm text-center text-muted-foreground">
                    Crie uma conta para continuar traduzindo
                  </p>
                  <Button
                    variant="hero"
                    size="xl"
                    className="w-full"
                    onClick={handlePayment}
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Criar Conta e Assinar
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogin}
                  >
                    Já tenho conta - Fazer Login
                  </Button>
                </div>
              ) : (
                <Button
                  variant="hero"
                  size="xl"
                  className="w-full"
                  onClick={handlePayment}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Assinar Agora
                </Button>
              )}

              <p className="text-xs text-center text-muted-foreground">
                Pagamento seguro via Stripe 🔐
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
