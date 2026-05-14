import DocumentScreen, {
  DocSection,
  DocParagraph,
  DocBullet,
  DocNote,
} from '../components/DocumentScreen';

export default function TermosUso() {
  return (
    <DocumentScreen
      headerTitle="Termos de uso"
      documentTitle="Termos de uso"
      lastUpdate="14 de maio de 2026"
      icon="reader"
      iconColor="#E7A48C"
      iconBg="rgba(231, 164, 140, 0.25)"
    >
      <DocNote>
        Ao usar o Minha Saúde Feminina, você concorda com estes termos. Leia
        com atenção antes de continuar.
      </DocNote>

      <DocSection number="1" title="Aceitação dos termos">
        <DocParagraph>
          Ao criar uma conta ou utilizar o aplicativo, você declara ter lido,
          entendido e concordado com estes termos de uso e com a Política de
          Privacidade.
        </DocParagraph>
        <DocParagraph>
          Se você não concorda com algum item, recomendamos não utilizar o
          serviço.
        </DocParagraph>
      </DocSection>

      <DocSection number="2" title="Quem pode usar">
        <DocParagraph>
          O app é destinado a pessoas maiores de 13 anos. Usuárias entre 13 e
          18 anos precisam de consentimento dos responsáveis legais.
        </DocParagraph>
        <DocParagraph>
          O serviço é gratuito e oferecido em caráter institucional, sem fins
          lucrativos.
        </DocParagraph>
      </DocSection>

      <DocSection number="3" title="Cadastro e segurança da conta">
        <DocParagraph>
          As informações que você fornece no cadastro devem ser verdadeiras e
          atualizadas. Você é responsável por manter a confidencialidade da sua
          senha.
        </DocParagraph>
        <DocParagraph>
          Em caso de uso indevido da sua conta, comunique-nos imediatamente
          pelo email saude.feminina@unifebe.edu.br.
        </DocParagraph>
      </DocSection>

      <DocSection number="4" title="Uso adequado">
        <DocParagraph>Você se compromete a:</DocParagraph>
        <DocBullet>Utilizar o app apenas para fins pessoais e não comerciais</DocBullet>
        <DocBullet>Não compartilhar acesso à sua conta com terceiros</DocBullet>
        <DocBullet>Não tentar violar a segurança do app ou de outros usuários</DocBullet>
        <DocBullet>Não usar o serviço para difundir conteúdo ilegal, ofensivo ou enganoso</DocBullet>
      </DocSection>

      <DocSection number="5" title="Limitações do serviço">
        <DocParagraph highlight>
          O Minha Saúde Feminina é uma ferramenta de apoio e educação. Não
          substitui consulta médica, diagnóstico ou tratamento.
        </DocParagraph>
        <DocParagraph>
          As previsões de ciclo são estimativas baseadas nos dados informados
          por você. Variações são normais e não devem ser interpretadas como
          alterações de saúde sem avaliação profissional.
        </DocParagraph>
        <DocParagraph>
          Em caso de sintomas persistentes, fortes ou de emergência, procure a
          UBS mais próxima ou ligue 192 (SAMU).
        </DocParagraph>
      </DocSection>

      <DocSection number="6" title="Conteúdo do app">
        <DocParagraph>
          Os conteúdos educativos são validados pela equipe de Medicina da
          UNIFEBE. Apesar do cuidado, podem existir atualizações de boas
          práticas que ainda não foram refletidas no app.
        </DocParagraph>
        <DocParagraph>
          Em dúvida, sempre confie na orientação do profissional da saúde da
          sua UBS.
        </DocParagraph>
      </DocSection>

      <DocSection number="7" title="Disponibilidade">
        <DocParagraph>
          Buscamos manter o app disponível 24 horas, mas podem ocorrer
          interrupções por manutenção, atualização ou falhas técnicas. Não nos
          responsabilizamos por indisponibilidades temporárias.
        </DocParagraph>
      </DocSection>

      <DocSection number="8" title="Propriedade intelectual">
        <DocParagraph>
          Marca, identidade visual, conteúdos e código do app pertencem à
          UNIFEBE. É proibida a reprodução total ou parcial sem autorização
          expressa.
        </DocParagraph>
      </DocSection>

      <DocSection number="9" title="Encerramento da conta">
        <DocParagraph>
          Você pode encerrar sua conta a qualquer momento. Nos reservamos o
          direito de suspender contas que descumprirem estes termos, mediante
          aviso prévio quando possível.
        </DocParagraph>
      </DocSection>

      <DocSection number="10" title="Modificações nos termos">
        <DocParagraph>
          Estes termos podem ser atualizados. Mudanças relevantes serão
          comunicadas pelo aplicativo. O uso contínuo após a notificação
          configura aceitação da nova versão.
        </DocParagraph>
      </DocSection>

      <DocSection number="11" title="Foro e lei aplicável">
        <DocParagraph>
          Estes termos são regidos pelas leis brasileiras. Fica eleito o foro
          da Comarca de Brusque (SC) para dirimir eventuais controvérsias.
        </DocParagraph>
      </DocSection>

      <DocNote type="warn">
        Este texto é institucional e educativo. A versão definitiva será
        revisada por assessoria jurídica antes da publicação em produção.
      </DocNote>
    </DocumentScreen>
  );
}
