import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Menu, X, User, LogIn, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useAuth } from '../contexts/AuthContext';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logOut } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              className="flex items-center justify-center w-10 h-10 rounded-xl gradient-hero shadow-md"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-5 h-5 text-white" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-foreground leading-tight">
                No Crioulo
              </span>
              <span className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                Tradutor Inteligente
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            <Link to="/learn">
              <Button variant="ghost" className="gap-2 text-primary font-medium">
                <BookOpen className="w-4 h-4" />
                Aprender Crioulo
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/perfil">
                  <Button variant="ghost" className="gap-2">
                    <User className="w-4 h-4" />
                    <span>{profile?.displayName || 'Perfil'}</span>
                    {profile && (
                      <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                        {profile.translationsUsed}/{profile.translationsLimit}
                      </span>
                    )}
                  </Button>
                </Link>
                <Button variant="outline" onClick={logOut}>
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro">
                  <Button variant="hero">
                    Cadastrar Grátis
                  </Button>
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="md:hidden bg-card border-t border-border"
        >
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link to="/learn" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start gap-2 text-primary font-medium">
                <BookOpen className="w-4 h-4" />
                Aprender Crioulo
              </Button>
            </Link>
            {user ? (
              <>
                <Link to="/perfil" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <User className="w-4 h-4" />
                    {profile?.displayName || 'Perfil'}
                  </Button>
                </Link>
                <Button variant="outline" onClick={() => { logOut(); setIsMenuOpen(false); }} className="w-full">
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start gap-2">
                    <LogIn className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/cadastro" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="hero" className="w-full">
                    Cadastrar Grátis
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </motion.div>
      )}
    </header>
  );
}
