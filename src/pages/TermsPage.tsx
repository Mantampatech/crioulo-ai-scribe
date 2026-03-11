import { StaticPageLayout } from '../components/StaticPageLayout';

const TermsPage = () => (
  <StaticPageLayout title="Termos e Condições">
    <p>
      Ao acessar o nocrioulo.com, você concorda em ficar vinculado a estes Termos e Condições. Caso não concorde com qualquer parte destes termos, por favor, não utilize nosso site.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Aviso de Conteúdo</h2>
    <p>
      Todo o conteúdo publicado neste site tem fins meramente informativos, educacionais e culturais. As traduções e exemplos linguísticos representam usos comuns do Crioulo da Guiné-Bissau, mas podem variar conforme o contexto, região ou geração dos falantes.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Propriedade Intelectual</h2>
    <p>
      Salvo indicação em contrário, todo o conteúdo deste site é de nossa propriedade ou utilizado com permissão. É proibida a republicação, venda ou redistribuição do conteúdo sem autorização prévia por escrito.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Limitação de Responsabilidade</h2>
    <p>
      Não nos responsabilizamos por quaisquer perdas, mal-entendidos ou danos decorrentes do uso das traduções ou informações fornecidas neste site. Quaisquer ações que você tome com base no conteúdo são de sua inteira responsabilidade.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Modificações</h2>
    <p>
      Reservamo-nos o direito de atualizar ou alterar estes Termos e Condições a qualquer momento, sem aviso prévio.
    </p>
  </StaticPageLayout>
);

export default TermsPage;
