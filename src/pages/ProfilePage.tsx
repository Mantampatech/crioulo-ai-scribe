import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Crown, 
  FileText, 
  Award, 
  ArrowLeft,
  Upload,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../hooks/use-toast';

const ProfilePage = () => {
  const { user, profile, loading } = useAuth();
  const { toast } = useToast();
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; status: 'processing' | 'done'; words: number }[]>([
    { name: 'exemplo-dicionario.pdf', status: 'done', words: 150 },
  ]);

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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.pdf')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, envie apenas arquivos PDF",
        variant: "destructive"
      });
      return;
    }

    // Simulate upload
    const newFile = { name: file.name, status: 'processing' as const, words: 0 };
    setUploadedFiles(prev => [...prev, newFile]);

    toast({
      title: "Upload iniciado",
      description: `Processando ${file.name}...`,
    });

    // Simulate processing
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.name === file.name 
            ? { ...f, status: 'done' as const, words: Math.floor(Math.random() * 200) + 50 }
            : f
        )
      );
      toast({
        title: "Processamento concluído! 🎉",
        description: `${file.name} foi processado com sucesso`,
      });
    }, 3000);
  };

  const totalWords = uploadedFiles.reduce((sum, f) => sum + f.words, 0);
  const contributorLevel = totalWords >= 100 ? 'gold' : totalWords >= 50 ? 'silver' : 'bronze';

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
        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-card rounded-2xl shadow-medium border border-border/50 p-6"
          >
            <div className="flex items-start gap-4">
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

          {/* Contributions Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="gradient-card rounded-2xl shadow-medium border border-border/50 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg text-foreground">
                🏆 Suas Contribuições
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{totalWords}</div>
                <div className="text-xs text-muted-foreground">Palavras adicionadas</div>
              </div>
              <div className="bg-secondary/50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-foreground">{uploadedFiles.filter(f => f.status === 'done').length}</div>
                <div className="text-xs text-muted-foreground">PDFs processados</div>
              </div>
            </div>

            {/* Badge */}
            {profile?.isContributor && (
              <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
                contributorLevel === 'gold' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200'
                  : contributorLevel === 'silver'
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-200'
                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
              }`}>
                <Sparkles className="w-4 h-4" />
                Contribuidor {contributorLevel === 'gold' ? 'Ouro' : contributorLevel === 'silver' ? 'Prata' : 'Bronze'}
              </div>
            )}
          </motion.div>

          {/* Upload PDF Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="gradient-card rounded-2xl shadow-medium border border-border/50 p-6 md:col-span-2"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h3 className="font-display font-bold text-lg text-foreground">
                📚 Contribuir com Dicionários PDF
              </h3>
            </div>

            <p className="text-muted-foreground text-sm mb-4">
              Ajude a melhorar as traduções de Crioulo enviando dicionários em PDF! 
              Nosso sistema processa automaticamente o vocabulário.
            </p>

            {/* Upload area */}
            <label className="block">
              <div className="border-2 border-dashed border-border hover:border-primary/50 rounded-xl p-8 text-center cursor-pointer transition-colors">
                <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="font-medium text-foreground mb-1">Arraste um PDF ou clique para selecionar</p>
                <p className="text-sm text-muted-foreground">Apenas arquivos .pdf são aceitos</p>
              </div>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <div className="mt-6 space-y-3">
                <h4 className="font-medium text-foreground text-sm">Arquivos enviados:</h4>
                {uploadedFiles.map((file, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between bg-secondary/50 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      {file.status === 'done' ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Clock className="w-5 h-5 text-primary" />
                        </motion.div>
                      )}
                      <span className="text-sm text-foreground">{file.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {file.status === 'done' 
                        ? `${file.words} palavras` 
                        : 'Processando...'}
                    </span>
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
