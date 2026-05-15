import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, BookOpen, Mic, GraduationCap, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

const products = [
  { Icon: BookOpen, title: 'Dicionário Crioulo–Português' },
  { Icon: Mic, title: 'Guia de Conversação para Viagens' },
  { Icon: GraduationCap, title: 'Curso Básico de Crioulo' },
];

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-background pattern-bg flex flex-col">
      <Helmet>
        <title>Loja No Crioulo | Recursos para aprender Crioulo da Guiné-Bissau</title>
        <meta
          name="description"
          content="Em breve: dicionários, guias de conversação e cursos para aprender Crioulo da Guiné-Bissau na loja do No Crioulo."
        />
        <link rel="canonical" href="https://crioulo-ai-scribe.lovable.app/loja" />
      </Helmet>

      <Header />

      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Header */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="font-display font-extrabold text-3xl md:text-5xl text-foreground mb-4">
              Loja <span className="text-gradient">No Crioulo</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
              Guias, ebooks e recursos para aprender e usar o Crioulo da Guiné-Bissau
            </p>
          </motion.section>

          {/* Coming soon */}
          <section className="mb-12">
            <div className="gradient-card rounded-2xl border border-border/50 p-8 md:p-12 text-center shadow-soft">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero shadow-lg mb-6">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-3">
                Estamos a preparar os primeiros conteúdos
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto mb-6">
                Em breve vão estar disponíveis dicionários, guias de conversação e recursos para aprender Crioulo.
                Fica atento!
              </p>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao tradutor
                </Button>
              </Link>
            </div>
          </section>

          {/* Placeholder grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map(({ Icon, title }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative gradient-card rounded-2xl border border-border/50 p-6 text-center overflow-hidden"
              >
                <div className="absolute top-3 right-3 z-10">
                  <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-accent text-accent-foreground shadow-md">
                    EM BREVE
                  </span>
                </div>
                <div className="opacity-50 blur-[1px] pointer-events-none select-none">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">Disponível em breve</p>
                </div>
              </motion.div>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
