import { motion } from 'framer-motion';
import { Header } from './Header';
import { Footer } from './Footer';

interface StaticPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function StaticPageLayout({ title, children }: StaticPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background pattern-bg flex flex-col">
      <Header />
      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-foreground mb-8">
              {title}
            </h1>
            <div className="gradient-card rounded-2xl border border-border/50 p-6 md:p-10 shadow-soft space-y-6 text-foreground/90 leading-relaxed">
              {children}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
