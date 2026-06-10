import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Store, BookOpen, Mic, GraduationCap, ArrowLeft, ExternalLink } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';
import bookCover from '../assets/no-lingua-ten-balur.png.asset.json';

const featuredBook = {
  title: 'Nô Lingua Ten Balur',
  subtitle: 'Guia Prático de Crioulo da Guiné-Bissau',
  price: '€3,99',
  description:
    'Aprende Crioulo da Guiné-Bissau de forma prática, fácil e completa. Mais de 400 palavras, 12 capítulos temáticos, diálogos, provérbios e exercícios — em PDF de alta qualidade.',
  url: 'https://aprendemais.gumroad.com/l/nolingua',
  image: bookCover.url,
};

const upcoming = [
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
          content="Livros, guias e recursos para aprender Crioulo da Guiné-Bissau. Descobre o guia prático Nô Lingua Ten Balur na loja do No Crioulo."
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

          {/* Featured book */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <a
              href={featuredBook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group block gradient-card rounded-2xl border border-border/50 overflow-hidden shadow-soft hover:shadow-medium transition-all"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="relative bg-gradient-to-br from-amber-50 to-orange-100 dark:from-amber-950/20 dark:to-orange-950/20 p-4 md:p-6 flex items-center justify-center">
                  <img
                    src={featuredBook.image}
                    alt={`Capa do livro ${featuredBook.title}`}
                    className="w-full h-auto rounded-lg shadow-lg group-hover:scale-[1.02] transition-transform"
                    loading="lazy"
                  />
                  <span className="absolute top-4 left-4 inline-block px-3 py-1 rounded-full text-[10px] font-bold tracking-wider bg-primary text-primary-foreground shadow-md">
                    NOVO
                  </span>
                </div>
                <div className="p-6 md:p-10 flex flex-col justify-center">
                  <p className="text-xs uppercase tracking-wider text-primary font-bold mb-2">
                    Livro em destaque
                  </p>
                  <h2 className="font-display font-extrabold text-2xl md:text-3xl text-foreground mb-2">
                    {featuredBook.title}
                  </h2>
                  <p className="text-muted-foreground font-medium mb-4">{featuredBook.subtitle}</p>
                  <p className="text-foreground/90 mb-6">{featuredBook.description}</p>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="font-display font-extrabold text-3xl text-foreground">
                      {featuredBook.price}
                    </span>
                    <span className="text-sm text-muted-foreground">PDF · Acesso imediato</span>
                  </div>
                  <Button variant="hero" size="lg" className="gap-2 w-full sm:w-auto">
                    Comprar agora
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </a>
          </motion.section>

          {/* Coming soon */}
          <section className="mb-10">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-hero shadow-lg mb-4">
                <Store className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-2">
                Mais recursos a caminho
              </h2>
              <p className="text-muted-foreground">Em breve disponíveis na loja</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcoming.map(({ Icon, title }, i) => (
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
            </div>
          </section>

          <div className="text-center">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar ao tradutor
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
