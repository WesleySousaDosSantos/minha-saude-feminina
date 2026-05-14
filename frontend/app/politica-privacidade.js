import DocumentScreen, {
  DocSection,
  DocParagraph,
  DocBullet,
  DocNote,
} from '../components/DocumentScreen';

export default function PoliticaPrivacidade() {
  return (
    <DocumentScreen
      headerTitle="Privacidade"
      documentTitle="Política de privacidade"
      lastUpdate="14 de maio de 2026"
      icon="shield-checkmark"
      iconColor="#C56682"
      iconBg="rgba(197, 102, 130, 0.18)"
    >
      <DocNote>
        Esta política descreve como o Minha Saúde Feminina trata seus dados
        pessoais, em conformidade com a Lei Geral de Proteção de Dados (LGPD —
        Lei nº 13.709/2018).
      </DocNote>

      <DocSection number="1" title="Quem somos">
        <DocParagraph>
          O Minha Saúde Feminina é um aplicativo institucional desenvolvido em
          parceria entre os cursos de Medicina e Sistemas de Informação do
          Centro Universitário de Brusque (UNIFEBE) e a rede de Unidades
          Básicas de Saúde, sem fins lucrativos.
        </DocParagraph>
        <DocParagraph>
          O controlador dos seus dados é a UNIFEBE, com sede em Brusque (SC).
          Em caso de dúvidas sobre o tratamento de dados, entre em contato pelo
          email dpo@unifebe.edu.br.
        </DocParagraph>
      </DocSection>

      <DocSection number="2" title="Quais dados coletamos">
        <DocParagraph>Coletamos apenas o necessário para o funcionamento do app:</DocParagraph>
        <DocBullet>
          Dados de cadastro: nome, email, telefone (opcional) e data de
          nascimento
        </DocBullet>
        <DocBullet>
          Dados de saúde: ciclo menstrual, sintomas, humor, fluxo, anotações
          que você registra voluntariamente
        </DocBullet>
        <DocBullet>
          Dados técnicos: versão do app, modelo do dispositivo e logs de erro
          (anônimos)
        </DocBullet>
        <DocParagraph highlight>
          Não coletamos sua localização, contatos, fotos ou microfone.
        </DocParagraph>
      </DocSection>

      <DocSection number="3" title="Como usamos seus dados">
        <DocParagraph>Seus dados são utilizados para:</DocParagraph>
        <DocBullet>
          Calcular previsões de ciclo e ovulação personalizadas
        </DocBullet>
        <DocBullet>
          Mostrar conteúdos educativos relevantes ao seu momento
        </DocBullet>
        <DocBullet>
          Enviar lembretes que você configurou voluntariamente
        </DocBullet>
        <DocBullet>
          Melhorar a qualidade e a segurança do app (de forma anônima e
          agregada)
        </DocBullet>
        <DocParagraph highlight>
          Não vendemos, alugamos ou compartilhamos seus dados com terceiros
          para fins comerciais.
        </DocParagraph>
      </DocSection>

      <DocSection number="4" title="Compartilhamento de dados">
        <DocParagraph>
          Seus dados de saúde são acessíveis apenas a você. A equipe da UNIFEBE
          só visualiza estatísticas agregadas e anônimas sobre o uso do app.
        </DocParagraph>
        <DocParagraph>
          Em casos excepcionais, podemos compartilhar dados quando exigido por
          obrigação legal ou ordem judicial, sempre informando você quando
          possível.
        </DocParagraph>
      </DocSection>

      <DocSection number="5" title="Armazenamento e segurança">
        <DocParagraph>
          Seus dados ficam armazenados em servidores no Brasil, com criptografia
          em trânsito (HTTPS) e em repouso. O acesso é restrito por autenticação
          forte.
        </DocParagraph>
        <DocParagraph>
          Mantemos seus dados enquanto sua conta estiver ativa. Após a exclusão,
          seguimos os prazos legais antes de eliminar completamente.
        </DocParagraph>
      </DocSection>

      <DocSection number="6" title="Seus direitos como titular">
        <DocParagraph>A LGPD garante a você:</DocParagraph>
        <DocBullet>
          Acesso aos dados que temos sobre você (menu Meus dados)
        </DocBullet>
        <DocBullet>
          Correção de dados incorretos ou desatualizados
        </DocBullet>
        <DocBullet>
          Exportação dos seus dados em formato legível (menu Baixar meus dados)
        </DocBullet>
        <DocBullet>
          Eliminação completa da sua conta a qualquer momento
        </DocBullet>
        <DocBullet>
          Informação sobre com quem seus dados foram compartilhados
        </DocBullet>
        <DocBullet>
          Revogação do consentimento, com efeito futuro
        </DocBullet>
      </DocSection>

      <DocSection number="7" title="Cookies e tecnologias">
        <DocParagraph>
          O app armazena localmente, no seu dispositivo, informações de sessão e
          preferências (idioma, temas, último login) para melhorar a
          experiência. Esses dados ficam apenas no celular e não são enviados
          para nossos servidores.
        </DocParagraph>
      </DocSection>

      <DocSection number="8" title="Crianças e adolescentes">
        <DocParagraph>
          O app é voltado para maiores de 13 anos. Usuárias entre 13 e 18 anos
          devem ter consentimento dos responsáveis para usar o serviço.
        </DocParagraph>
      </DocSection>

      <DocSection number="9" title="Mudanças nesta política">
        <DocParagraph>
          Podemos atualizar esta política para refletir mudanças na lei ou no
          app. Quando houver alteração importante, te avisaremos pelo próprio
          aplicativo.
        </DocParagraph>
      </DocSection>

      <DocSection number="10" title="Contato">
        <DocParagraph>
          Encarregado de Proteção de Dados (DPO):{' '}
          <DocParagraph highlight>dpo@unifebe.edu.br</DocParagraph>
        </DocParagraph>
        <DocParagraph>
          Em caso de incidente que afete seus dados, comunicaremos você e a
          ANPD em até 72 horas, conforme exigido pela LGPD.
        </DocParagraph>
      </DocSection>

      <DocNote type="warn">
        Esta política é educativa. O texto definitivo será revisado por
        assessoria jurídica antes da publicação oficial em produção.
      </DocNote>
    </DocumentScreen>
  );
}
