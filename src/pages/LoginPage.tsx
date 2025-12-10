import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Globe, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { logIn } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      await logIn(email, password);
      toast({
        title: "Bem-vindo de volta! 🎉",
        description: "Login realizado com sucesso",
      });
      navigate('/');
    } catch (error: any) {
      let message = "Ocorreu um erro ao fazer login";
      if (error.code === 'auth/invalid-credential') {
        message = "Email ou senha incorretos";
      } else if (error.code === 'auth/user-not-found') {
        message = "Usuário não encontrado";
      }
      toast({
        title: "Erro no login",
        description: message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pattern-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>

        {/* Card */}
        <div className="gradient-card rounded-2xl shadow-strong border border-border/50 p-6 md:p-8">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl gradient-hero shadow-md">
              <Globe className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">No Crioulo</h1>
              <p className="text-xs text-muted-foreground">Tradutor Inteligente</p>
            </div>
          </div>

          <h2 className="text-center font-display font-bold text-2xl text-foreground mb-2">
            Entrar na conta
          </h2>
          <p className="text-center text-muted-foreground text-sm mb-6">
            Bem-vindo de volta! Continue traduzindo.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full h-11 pl-10 pr-4 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-12 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              disabled={isLoading}
              className="w-full mt-6"
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          {/* Signup link */}
          <p className="text-center text-muted-foreground text-sm mt-6">
            Não tem uma conta?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Cadastre-se grátis
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
