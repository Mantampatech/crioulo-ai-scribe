import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, FileText, ArrowRight, LogIn } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';

export default function CurriculoBlockedPage() {
  const handleRedirect = (path: string) => {
    sessionStorage.setItem('redirectAfterAuth', '/curriculo');
  };

  return (
    <div className="min-h-screen bg-background pattern-bg flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center pt-24 md:pt-32 pb-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="gradient-card rounded-2xl border border-border/50 p-8 md:p-12 shadow-soft text-center">
            {/* Lock Icon */}
            <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Lock className="w-10 h-10 text-primary" />
            </div>

            <h1 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-3">
              Esta funcionalidade é exclusiva para membros
            </h1>

            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Cria uma conta gratuita para poderes usar o gerador de currículos com IA,
              guardar os teus dados e descarregar o teu CV em PDF.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              <Link
                to="/cadastro"
                onClick={() => handleRedirect('/cadastro')}
                className="w-full"
              >
                <Button variant="hero" size="lg" className="w-full gap-2">
                  <FileText className="w-5 h-5" />
                  Criar conta gratuita
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>

              <Link
                to="/login"
                onClick={() => handleRedirect('/login')}
                className="w-full"
              >
                <Button variant="outline" size="lg" className="w-full gap-2">
                  <LogIn className="w-5 h-5" />
                  Já tenho conta — Entrar
                </Button>
              </Link>
            </div>

            <p className="text-xs text-muted-foreground">
              O registo é gratuito e leva menos de 1 minuto.
            </p>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
