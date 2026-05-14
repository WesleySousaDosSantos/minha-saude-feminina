export const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: 'apps-outline' },
  { id: 'cycle', label: 'Ciclo', icon: 'water-outline' },
  { id: 'intimate', label: 'Saúde íntima', icon: 'flower-outline' },
  { id: 'contraception', label: 'Anticoncepção', icon: 'shield-checkmark-outline' },
  { id: 'pregnancy', label: 'Gravidez', icon: 'happy-outline' },
  { id: 'wellbeing', label: 'Bem-estar', icon: 'leaf-outline' },
  { id: 'sexuality', label: 'Sexualidade', icon: 'heart-outline' },
];

export const CATEGORY_LABEL = {
  cycle: 'Ciclo',
  intimate: 'Saúde íntima',
  contraception: 'Anticoncepção',
  pregnancy: 'Gravidez',
  wellbeing: 'Bem-estar',
  sexuality: 'Sexualidade',
};

export const ARTICLES = [
  {
    id: '1',
    category: 'cycle',
    title: 'Entendendo seu ciclo menstrual',
    excerpt:
      'Saiba o que acontece em cada fase do ciclo e como isso influencia seu corpo e suas emoções.',
    readTime: 5,
    featured: true,
    color: '#C56682',
    icon: 'water',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '15 de março',
    body: [
      {
        type: 'paragraph',
        text: 'O ciclo menstrual é um processo natural que prepara o corpo para uma possível gravidez. Ele acontece em ciclos que duram, em média, entre 21 e 35 dias, variando de mulher para mulher.',
      },
      {
        type: 'heading',
        text: 'As quatro fases do ciclo',
      },
      {
        type: 'paragraph',
        text: 'O ciclo é dividido em fases. Cada uma traz mudanças hormonais que afetam seu humor, energia e até a pele. Entender essas fases ajuda a se conhecer melhor.',
      },
      {
        type: 'list',
        items: [
          'Menstruação: dura entre 3 e 7 dias. O útero descama o endométrio e há sangramento.',
          'Folicular: o corpo se prepara para a ovulação. A energia tende a aumentar.',
          'Ovulação: o óvulo é liberado. É o período mais fértil do ciclo.',
          'Lútea: o corpo se prepara para uma possível gravidez. Pode haver TPM no fim.',
        ],
      },
      {
        type: 'heading',
        text: 'Quando se preocupar',
      },
      {
        type: 'paragraph',
        text: 'Ciclos muito irregulares, sangramentos muito intensos ou cólicas que impedem suas atividades não são normais. Nesses casos, procure a UBS mais próxima para uma avaliação.',
      },
      {
        type: 'paragraph',
        text: 'Lembre-se: cada corpo é único. Acompanhar seu ciclo pelo app ajuda a perceber padrões e levar informações concretas para a consulta.',
      },
    ],
    relatedIds: ['9', '6', '2'],
  },
  {
    id: '2',
    category: 'intimate',
    title: 'Corrimento: o que é normal e o que não é',
    excerpt:
      'Aprenda a identificar mudanças que podem indicar uma infecção.',
    readTime: 4,
    color: '#E7A48C',
    icon: 'water-outline',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '08 de março',
    body: [
      {
        type: 'paragraph',
        text: 'Ter corrimento é normal. Ele faz parte da saúde íntima e ajuda a proteger o canal vaginal. O importante é saber identificar quando algo está fora do comum.',
      },
      {
        type: 'heading',
        text: 'Corrimento normal',
      },
      {
        type: 'list',
        items: [
          'Cor: transparente, branco ou levemente amarelado',
          'Textura: pode variar de aguada a cremosa ao longo do ciclo',
          'Cheiro: discreto ou inexistente',
          'Quantidade: pequena, sem incomodar',
        ],
      },
      {
        type: 'heading',
        text: 'Quando procurar atendimento',
      },
      {
        type: 'paragraph',
        text: 'Se você notar algum desses sinais, procure a UBS. Pode ser uma infecção que precisa de tratamento.',
      },
      {
        type: 'list',
        items: [
          'Cheiro forte ou desagradável',
          'Coceira, ardência ou irritação',
          'Cor acinzentada, esverdeada ou com sangue fora da menstruação',
          'Dor durante a relação ou ao urinar',
        ],
      },
      {
        type: 'paragraph',
        text: 'O atendimento na UBS é gratuito e confidencial. Não tenha vergonha de buscar ajuda.',
      },
    ],
    relatedIds: ['5', '7'],
  },
  {
    id: '3',
    category: 'contraception',
    title: 'Métodos contraceptivos na UBS',
    excerpt:
      'Conheça as opções gratuitas disponíveis e como escolher a melhor para você.',
    readTime: 6,
    color: '#C43A4A',
    icon: 'shield-checkmark',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '02 de março',
    body: [
      {
        type: 'paragraph',
        text: 'A UBS oferece diversos métodos contraceptivos de forma gratuita. A escolha do melhor método é uma decisão conjunta entre você e o profissional de saúde.',
      },
      {
        type: 'heading',
        text: 'Métodos disponíveis',
      },
      {
        type: 'list',
        items: [
          'Pílula anticoncepcional combinada',
          'Pílula só de progesterona (para amamentação)',
          'Injetável mensal e trimestral',
          'DIU de cobre, com duração de até 10 anos',
          'Preservativo masculino e feminino',
          'Pílula do dia seguinte (emergência)',
        ],
      },
      {
        type: 'heading',
        text: 'Como escolher',
      },
      {
        type: 'paragraph',
        text: 'O método ideal depende da sua saúde, rotina e planos. Numa consulta na UBS você pode tirar todas as dúvidas e descobrir qual se encaixa melhor com seu momento de vida.',
      },
      {
        type: 'paragraph',
        text: 'Importante: apenas o preservativo protege contra infecções sexualmente transmissíveis. Use sempre, mesmo com outro método contraceptivo.',
      },
    ],
    relatedIds: ['8', '7'],
  },
  {
    id: '4',
    category: 'pregnancy',
    title: 'Primeiros sinais de gravidez',
    excerpt: 'Sintomas iniciais e quando fazer o teste para ter certeza.',
    readTime: 3,
    color: '#FBD9E5',
    icon: 'happy',
    iconColor: '#C43A4A',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '22 de fevereiro',
    body: [
      {
        type: 'paragraph',
        text: 'Os primeiros sinais de gravidez podem variar bastante. Algumas mulheres percebem mudanças logo nas primeiras semanas, outras só notam mais tarde.',
      },
      {
        type: 'heading',
        text: 'Sinais mais comuns',
      },
      {
        type: 'list',
        items: [
          'Atraso menstrual',
          'Náuseas, principalmente pela manhã',
          'Cansaço fora do normal',
          'Seios mais sensíveis ou inchados',
          'Vontade frequente de urinar',
          'Mudanças no paladar e olfato',
        ],
      },
      {
        type: 'heading',
        text: 'Quando fazer o teste',
      },
      {
        type: 'paragraph',
        text: 'O teste de farmácia funciona bem a partir do primeiro dia de atraso. Para mais segurança, espere uma semana de atraso. O teste de sangue (beta-HCG) pode ser feito ainda mais cedo e é gratuito na UBS.',
      },
      {
        type: 'paragraph',
        text: 'Se o teste der positivo, agende uma consulta na UBS para iniciar o pré-natal. Quanto antes, melhor para a saúde sua e do bebê.',
      },
    ],
    relatedIds: ['3', '7'],
  },
  {
    id: '5',
    category: 'intimate',
    title: 'Higiene íntima: cuidados que importam',
    excerpt:
      'Boas práticas no dia a dia para evitar infecções e desconfortos.',
    readTime: 3,
    color: '#C56682',
    icon: 'flower',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '18 de fevereiro',
    body: [
      {
        type: 'paragraph',
        text: 'A higiene íntima certa é simples e protege contra desconfortos e infecções. O exagero, na verdade, pode atrapalhar.',
      },
      {
        type: 'heading',
        text: 'O que fazer',
      },
      {
        type: 'list',
        items: [
          'Lavar a região externa com água e sabonete neutro, uma a duas vezes ao dia',
          'Secar bem após o banho e depois de urinar',
          'Trocar a roupa íntima diariamente, preferindo algodão',
          'Limpar de frente para trás após usar o banheiro',
        ],
      },
      {
        type: 'heading',
        text: 'O que evitar',
      },
      {
        type: 'list',
        items: [
          'Duchas internas — atrapalham a flora natural',
          'Sabonetes perfumados na região íntima',
          'Calcinhas muito apertadas ou sintéticas por longos períodos',
          'Absorventes diários quando não há necessidade',
        ],
      },
      {
        type: 'paragraph',
        text: 'Se sentir coceira, ardência ou notar mudança no corrimento, procure a UBS antes de tentar tratar por conta própria.',
      },
    ],
    relatedIds: ['2', '7'],
  },
  {
    id: '6',
    category: 'wellbeing',
    title: 'TPM: o que é e como aliviar',
    excerpt:
      'Estratégias simples para passar pela tensão pré-menstrual com mais conforto.',
    readTime: 5,
    color: '#E7A48C',
    icon: 'leaf',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '12 de fevereiro',
    body: [
      {
        type: 'paragraph',
        text: 'A TPM (tensão pré-menstrual) acontece nos dias que antecedem a menstruação. É causada por mudanças hormonais e afeta cada mulher de um jeito.',
      },
      {
        type: 'heading',
        text: 'Sintomas frequentes',
      },
      {
        type: 'list',
        items: [
          'Irritabilidade e oscilações de humor',
          'Inchaço e retenção de líquido',
          'Seios sensíveis',
          'Dor de cabeça',
          'Vontade aumentada por doce',
          'Cansaço e dificuldade pra dormir',
        ],
      },
      {
        type: 'heading',
        text: 'O que ajuda',
      },
      {
        type: 'list',
        items: [
          'Reduzir sal, café e açúcar nos dias de TPM',
          'Caminhar ou se exercitar, mesmo que leve',
          'Beber bastante água',
          'Dormir bem',
          'Compressa morna no abdômen para aliviar cólica',
        ],
      },
      {
        type: 'paragraph',
        text: 'Se os sintomas são fortes a ponto de atrapalhar seu dia, isso pode ser TDPM (forma mais intensa da TPM). Procure a UBS — existe tratamento.',
      },
    ],
    relatedIds: ['9', '1'],
  },
  {
    id: '7',
    category: 'intimate',
    title: 'Quando procurar a UBS',
    excerpt: 'Sinais que indicam a necessidade de atendimento ginecológico.',
    readTime: 4,
    color: '#C43A4A',
    icon: 'medkit',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '05 de fevereiro',
    body: [
      {
        type: 'paragraph',
        text: 'A consulta ginecológica de rotina é recomendada uma vez por ano. Mas existem situações que pedem atendimento o quanto antes.',
      },
      {
        type: 'heading',
        text: 'Procure logo se você tem',
      },
      {
        type: 'list',
        items: [
          'Cólica muito forte que não passa com analgésico comum',
          'Sangramento fora do período menstrual',
          'Atraso menstrual maior que dois meses sem uso de contraceptivo',
          'Corrimento com cheiro, coceira ou cor diferente',
          'Dor durante a relação',
          'Caroço ou alteração nos seios',
        ],
      },
      {
        type: 'heading',
        text: 'O que levar na consulta',
      },
      {
        type: 'list',
        items: [
          'Cartão do SUS e documento com foto',
          'Histórico de medicações em uso',
          'Registro do ciclo (este app pode ajudar)',
          'Lista de sintomas com data de início',
        ],
      },
      {
        type: 'paragraph',
        text: 'O atendimento é gratuito, confidencial e seu direito. Não adie.',
      },
    ],
    relatedIds: ['2', '3'],
  },
  {
    id: '8',
    category: 'sexuality',
    title: 'Mitos e verdades sobre sexualidade',
    excerpt:
      'Informação acolhedora e baseada em evidências para você se conhecer melhor.',
    readTime: 7,
    color: '#C56682',
    icon: 'heart',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '28 de janeiro',
    body: [
      {
        type: 'paragraph',
        text: 'Sexualidade ainda é cercada de tabus. Separamos algumas crenças comuns e o que a ciência diz sobre cada uma.',
      },
      {
        type: 'heading',
        text: '"Não é possível engravidar na primeira vez"',
      },
      {
        type: 'paragraph',
        text: 'Mito. A gravidez pode acontecer em qualquer relação sem proteção, inclusive na primeira. Use sempre preservativo.',
      },
      {
        type: 'heading',
        text: '"Mulher também tem desejo flutuante ao longo do ciclo"',
      },
      {
        type: 'paragraph',
        text: 'Verdade. Os hormônios variam ao longo do mês e podem aumentar ou diminuir o desejo. É natural e não há nada errado em sentir isso.',
      },
      {
        type: 'heading',
        text: '"Prazer feminino é difícil de alcançar"',
      },
      {
        type: 'paragraph',
        text: 'Depende. O que falta, em geral, não é fisiologia — é informação, autoconhecimento e comunicação com o parceiro. Conhecer seu corpo é o ponto de partida.',
      },
      {
        type: 'heading',
        text: '"IST não tem sintoma visível"',
      },
      {
        type: 'paragraph',
        text: 'Verdade. Muitas infecções sexualmente transmissíveis são silenciosas. Por isso, fazer exames regularmente é fundamental, mesmo que você se sinta bem.',
      },
    ],
    relatedIds: ['3', '5'],
  },
  {
    id: '9',
    category: 'cycle',
    title: 'Cólicas: por que acontecem?',
    excerpt: 'Entenda a origem das cólicas e o que pode ajudar a aliviar.',
    readTime: 4,
    color: '#FBD9E5',
    icon: 'flash',
    iconColor: '#C43A4A',
    author: 'Equipe UNIFEBE — Medicina',
    publishedAt: '20 de janeiro',
    body: [
      {
        type: 'paragraph',
        text: 'A cólica menstrual acontece porque o útero contrai para eliminar o endométrio. Esse movimento, em algumas mulheres, gera dor.',
      },
      {
        type: 'heading',
        text: 'O que pode aliviar',
      },
      {
        type: 'list',
        items: [
          'Compressa morna no abdômen',
          'Chás de camomila, hortelã ou erva-doce',
          'Movimentos leves: caminhada, alongamento',
          'Massagem suave na região',
          'Analgésico comum, com orientação',
        ],
      },
      {
        type: 'heading',
        text: 'Sinal de alerta',
      },
      {
        type: 'paragraph',
        text: 'Cólicas que te impedem de trabalhar, estudar ou dormir não são normais. Pode ser endometriose ou outra condição. Procure a UBS.',
      },
    ],
    relatedIds: ['1', '6'],
  },
];

export function getArticleById(id) {
  return ARTICLES.find((a) => a.id === id);
}

export function getRelated(article) {
  if (!article?.relatedIds) return [];
  return article.relatedIds
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter(Boolean);
}
