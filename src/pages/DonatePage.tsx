import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Heart, User, BookOpen, Check, Lock } from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { Button } from '../components/ui/button';

const STRIPE_URL = 'https://buy.stripe.com/9B614pcyzfXa6fe5Y4f3a01';

const reasons = [
  {
    Icon: Heart,
    title: 'Acesso gratuito para todos',
    text: 'O No Crioulo será sempre gratuito para quem precisar. As doações garantem que isso continue possível.',
  },
  {
    Icon: User,
    title: 'Feito por uma pessoa, para uma comunidade',
    text: 'Este projeto é desenvolvido de forma independente, sem grandes financiadores. Cada contribuição faz diferença real.',
  },
  {
    Icon: BookOpen,
    title: 'Preservar a língua Crioulo',
    text: 'O Crioulo da Guiné-Bissau merece ter espaço no mundo digital. A tua ajuda garante que esta língua não seja esquecida.',
  },
];

const benefits = [
  'Manter os servidores e o site online',
  'Melhorar o motor de tradução com novas palavras e expressões',
  'Criar mais conteúdos gratuitos em Crioulo',
  'Desenvolver novas funcionalidades para a comunidade',
  'Manter a ferramenta gratuita para estudantes, famílias e viajantes',
];

export default function DonatePage() {
  return (
    <div className="min-h-screen bg-background pattern-bg flex flex-col">
      <Helmet>
        <title>Apoiar o No Crioulo | Tradutor de Crioulo da Guiné-Bissau</title>
        <meta
          name="description"
          content="Apoia o No Crioulo, o tradutor independente de Crioulo da Guiné-Bissau. A tua doação mantém o projeto gratuito e ajuda a preservar a língua Kriol."
        />
        <link rel="canonical" href="https://crioulo-ai-scribe.lovable.app/apoiar" />
      </Helmet>

      <Header />

      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-5xl">
          {/* Hero */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.8 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl gradient-hero shadow-lg mb-6"
            >
              <Heart className="w-10 h-10 text-white" fill="white" />
            </motion.div>

            <h1 className="font-display font-extrabold text-3xl md:text-5xl lg:text-6xl text-foreground leading-tight mb-4">
              Ajuda a manter o <span className="text-gradient">Crioulo vivo</span> no mundo digital
            </h1>

            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8">
              O No Crioulo é um projeto independente, criado por amor à língua e à cultura da Guiné-Bissau.
              A tua contribuição mantém esta ferramenta gratuita para todos.
            </p>

            <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer">
              <Button variant="hero" size="xl" className="gap-2">
                <Heart className="w-5 h-5" fill="currentColor" />
                Fazer uma doação agora
              </Button>
            </a>
          </motion.section>

          {/* Reasons */}
          <section className="mb-16">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-center text-foreground mb-8">
              Por que apoiar?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reasons.map(({ Icon, title, text }, i) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="gradient-card rounded-2xl border border-border/50 p-6 text-center hover:shadow-medium transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm">{text}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-16">
            <div className="gradient-card rounded-2xl border border-border/50 p-6 md:p-10 shadow-soft">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground mb-6 text-center">
                O que o teu apoio torna possível
              </h2>
              <ul className="space-y-3 max-w-2xl mx-auto">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-500/15 text-green-600 mt-0.5">
                      <Check className="w-4 h-4" />
                    </span>
                    <span className="text-foreground/90">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Final CTA */}
          <section className="mb-16">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-orange-500/10 to-red-500/10 border border-primary/20 p-8 md:p-12 text-center">
              <h2 className="font-display font-extrabold text-2xl md:text-4xl text-foreground mb-3">
                Qualquer valor ajuda. Um café por mês faz a diferença.
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                A doação é processada de forma segura através do Stripe. Não é necessário criar conta.
              </p>
              <a href={STRIPE_URL} target="_blank" rel="noopener noreferrer">
                <Button variant="hero" size="xl" className="gap-2">
                  <Heart className="w-5 h-5" fill="currentColor" />
                  Apoiar o No Crioulo
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-4 inline-flex items-center gap-1.5">
                <Lock className="w-3 h-3" /> Pagamento seguro via Stripe
              </p>
            </div>
          </section>

          {/* Thank you */}
          <section className="text-center max-w-2xl mx-auto">
            <p className="text-foreground/90 italic">
              Obrigado por fazeres parte desta missão. Cada palavra traduzida, cada ligação criada entre culturas
              — é também tua.
            </p>
            <p className="text-muted-foreground text-sm mt-2">— A equipa No Crioulo</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
