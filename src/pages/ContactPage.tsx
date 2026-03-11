import { StaticPageLayout } from '../components/StaticPageLayout';

const ContactPage = () => (
  <StaticPageLayout title="Contate-nos">
    <p>
      Se você tiver alguma dúvida, sugestão, colaboração linguística ou proposta comercial, não hesite em nos contatar.
    </p>
    <p>
      <strong className="text-foreground">E-mail:</strong>{' '}
      <a href="mailto:bissaupodcast@gmail.com" className="text-primary hover:underline font-medium">
        bissaupodcast@gmail.com
      </a>
    </p>
    <p>
      Nosso objetivo é responder a todas as solicitações o mais rápido possível. Sugestões de novas palavras, correções ou contribuições culturais são sempre bem-vindas!
    </p>
  </StaticPageLayout>
);

export default ContactPage;
