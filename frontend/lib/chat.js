export const CHAT_CATEGORIES = [
  { id: 'cycle', label: 'Ciclo', icon: 'water-outline' },
  { id: 'intimate', label: 'Saúde íntima', icon: 'flower-outline' },
  { id: 'contraception', label: 'Anticoncepção', icon: 'shield-checkmark-outline' },
  { id: 'pregnancy', label: 'Gravidez', icon: 'happy-outline' },
  { id: 'sexuality', label: 'Sexualidade', icon: 'heart-outline' },
  { id: 'other', label: 'Outro', icon: 'help-circle-outline' },
];

export const CHAT_CATEGORY_LABEL = {
  cycle: 'Ciclo',
  intimate: 'Saúde íntima',
  contraception: 'Anticoncepção',
  pregnancy: 'Gravidez',
  sexuality: 'Sexualidade',
  other: 'Outro',
};

export const QUESTIONS = [
  {
    id: '1',
    category: 'cycle',
    question:
      'Meu ciclo veio com 35 dias esse mês, normalmente é de 28. Isso é normal? Devo me preocupar?',
    askedAt: 'há 2 horas',
    askedAtFull: 'Hoje, 09:42',
    status: 'answered',
    answer: {
      author: 'Enfermeira Joana — UBS Central',
      role: 'Enfermagem',
      respondedAt: 'há 30 minutos',
      respondedAtFull: 'Hoje, 11:14',
      text:
        'Olá! Variações de até 7 a 10 dias no ciclo podem acontecer e são consideradas normais, principalmente diante de estresse, mudanças de rotina ou alimentação. Como foi apenas um mês, observe o próximo ciclo. Se a irregularidade se repetir por mais de 3 meses, agende uma consulta na UBS para uma avaliação mais detalhada.',
    },
  },
  {
    id: '2',
    category: 'intimate',
    question:
      'Notei um corrimento amarelado com cheiro forte nos últimos dias. Não tenho coceira, mas estou preocupada.',
    askedAt: 'ontem',
    askedAtFull: 'Ontem, 18:20',
    status: 'answered',
    answer: {
      author: 'Dra. Lúcia Mendes — UBS Central',
      role: 'Ginecologista',
      respondedAt: 'há 16 horas',
      respondedAtFull: 'Hoje, 08:05',
      text:
        'Corrimento amarelado com cheiro forte pode indicar uma infecção, mesmo sem coceira. Recomendo agendar atendimento na UBS o quanto antes para uma avaliação. O tratamento é simples e gratuito. Enquanto isso, evite duchas internas e roupas muito apertadas.',
    },
  },
  {
    id: '3',
    category: 'contraception',
    question:
      'Esqueci de tomar a pílula ontem. Tomei hoje pela manhã junto com a de hoje. Posso ter problemas? Preciso usar camisinha?',
    askedAt: 'há 3 horas',
    askedAtFull: 'Hoje, 08:30',
    status: 'pending',
  },
  {
    id: '4',
    category: 'cycle',
    question:
      'Sinto muita cólica e dor lombar nos primeiros dias. Tomar dipirona ajuda mas dá ânsia. Tem outra opção?',
    askedAt: '3 dias atrás',
    askedAtFull: '10 de maio',
    status: 'answered',
    answer: {
      author: 'Farmacêutica Camila — UBS Central',
      role: 'Farmácia',
      respondedAt: '2 dias atrás',
      respondedAtFull: '11 de maio',
      text:
        'Existem alternativas como ibuprofeno e naproxeno, que costumam ser mais eficazes para cólica menstrual. Sempre tome com o estômago cheio para reduzir a ânsia. Compressa morna no abdômen e chás de camomila ou erva-doce também ajudam. Se a dor for muito intensa a ponto de te impedir de fazer atividades, procure uma consulta na UBS — pode ser endometriose.',
    },
  },
];

export function getQuestionById(id) {
  return QUESTIONS.find((q) => q.id === id);
}

export function getCategoryById(id) {
  return CHAT_CATEGORIES.find((c) => c.id === id);
}
