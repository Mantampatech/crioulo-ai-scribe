import { StaticPageLayout } from '../components/StaticPageLayout';

const PrivacyPage = () => (
  <StaticPageLayout title="Política de Privacidade">
    <p>
      Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações quando você visita o nocrioulo.com.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Informações que Coletamos</h2>
    <p>
      Podemos coletar informações não pessoais, como tipo de navegador, informações do dispositivo, páginas visitadas e tempo gasto no site. Não coletamos dados pessoais a menos que você os forneça voluntariamente (por exemplo, por meio de um formulário de contato ou sugestão de tradução).
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Cookies e Web Beacons</h2>
    <p>
      Nosso site utiliza cookies para armazenar informações sobre as preferências dos visitantes e para otimizar a experiência, personalizando nosso conteúdo de acordo com o tipo de navegador ou outras informações do visitante.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Google AdSense</h2>
    <p>
      Usamos o Google AdSense para exibir anúncios. O Google usa cookies (incluindo o cookie DoubleClick) para veicular anúncios aos usuários com base em suas visitas a este e outros sites. Os usuários podem desativar a publicidade personalizada acessando:{' '}
      <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
        https://adssettings.google.com
      </a>
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Políticas de Privacidade de Terceiros</h2>
    <p>
      Nossa Política de Privacidade não se aplica a outros anunciantes ou sites externos. Recomendamos que você consulte as respectivas Políticas de Privacidade de servidores de anúncios ou sites de terceiros.
    </p>

    <h2 className="font-display font-bold text-xl text-foreground pt-2">Consentimento</h2>
    <p>
      Ao utilizar o nocrioulo.com, você concorda com nossa Política de Privacidade e aceita seus termos.
    </p>
  </StaticPageLayout>
);

export default PrivacyPage;
