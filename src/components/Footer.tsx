import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="py-10 border-t border-border bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div>
            <h4 className="font-display font-bold text-sm text-foreground mb-3">NoCrioulo</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/sobre" className="text-muted-foreground hover:text-primary transition-colors">Sobre Nós</Link></li>
              <li><Link to="/contato" className="text-muted-foreground hover:text-primary transition-colors">Contate-nos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-foreground mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/termos" className="text-muted-foreground hover:text-primary transition-colors">Termos e Condições</Link></li>
              <li><Link to="/privacidade" className="text-muted-foreground hover:text-primary transition-colors">Política de Privacidade</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm text-foreground mb-3">Mais</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/cookies" className="text-muted-foreground hover:text-primary transition-colors">Política de Cookies</Link></li>
              <li><Link to="/isencao" className="text-muted-foreground hover:text-primary transition-colors">Isenção de Responsabilidade</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            🌍 No Crioulo © {new Date().getFullYear()} — Tradutor Inteligente de Crioulo da Guiné-Bissau
          </p>
        </div>
      </div>
    </footer>
  );
}
