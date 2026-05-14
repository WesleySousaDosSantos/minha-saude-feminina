export const DUVIDAS_CATEGORIES = [
  { id: 'all', label: 'Todas', icon: 'apps-outline' },
  { id: 'cycle', label: 'Ciclo', icon: 'water-outline' },
  { id: 'intimate', label: 'Saúde íntima', icon: 'flower-outline' },
  { id: 'contraception', label: 'Anticoncepção', icon: 'shield-checkmark-outline' },
  { id: 'pregnancy', label: 'Gravidez', icon: 'happy-outline' },
  { id: 'wellbeing', label: 'Bem-estar', icon: 'leaf-outline' },
  { id: 'sexuality', label: 'Sexualidade', icon: 'heart-outline' },
];

export const DUVIDAS_CATEGORY_LABEL = {
  cycle: 'Ciclo',
  intimate: 'Saúde íntima',
  contraception: 'Anticoncepção',
  pregnancy: 'Gravidez',
  wellbeing: 'Bem-estar',
  sexuality: 'Sexualidade',
};

export const DUVIDAS = [
  {
    id: '1',
    category: 'cycle',
    question: 'Meu ciclo veio com 35 dias, é normal?',
    answer:
      'Sim, na maioria dos casos é normal. Ciclos entre 21 e 35 dias são considerados regulares. Variações de até 7 a 10 dias podem acontecer por estresse, alimentação, alteração de rotina ou início do uso de medicamentos.\n\nSe a irregularidade se repetir por mais de 3 ciclos seguidos, vale agendar uma consulta na UBS para uma avaliação.',
    author: 'Equipe de Enfermagem',
  },
  {
    id: '2',
    category: 'cycle',
    question: 'Cólica forte é normal? Devo me preocupar?',
    answer:
      'Cólica leve a moderada nos primeiros dias da menstruação é comum. O que não é normal é cólica tão forte que te impeça de trabalhar, estudar ou dormir.\n\nQuando a dor for incapacitante, procure a UBS. Pode ser endometriose ou outra condição que tem tratamento. Você não precisa conviver com dor.',
    author: 'Equipe Médica',
  },
  {
    id: '3',
    category: 'cycle',
    question: 'Posso engravidar fora do período fértil?',
    answer:
      'A chance é menor, mas existe. Espermatozoides podem sobreviver até 5 dias no corpo, e a ovulação pode variar de mês a mês — principalmente em ciclos irregulares.\n\nSe não quer engravidar, use método contraceptivo todos os dias, independente da fase do ciclo. A UBS oferece preservativo, pílula, DIU e outros métodos de graça.',
    author: 'Equipe Médica',
  },
  {
    id: '4',
    category: 'intimate',
    question: 'Como saber se meu corrimento é normal?',
    answer:
      'Corrimento normal é transparente, branco ou levemente amarelado, sem cheiro forte e sem causar coceira. A textura muda ao longo do ciclo — mais aguado perto da ovulação, mais espesso depois.\n\nSinais que pedem atendimento: cheiro forte, cor acinzentada ou esverdeada, coceira, ardência ou dor durante a relação. Nesses casos, procure a UBS.',
    author: 'Equipe Médica',
  },
  {
    id: '5',
    category: 'intimate',
    question: 'Que sabonete devo usar na região íntima?',
    answer:
      'Sabonete neutro ou específico para a região íntima, e só na parte externa (vulva). Por dentro, a vagina se limpa sozinha e usar sabonete pode atrapalhar.\n\nEvite sabonetes perfumados, antibacterianos ou em barra usados também no resto do corpo. Eles podem causar irritação e alterar a flora natural.',
    author: 'Equipe Médica',
  },
  {
    id: '6',
    category: 'intimate',
    question: 'Calcinha de algodão faz mesmo diferença?',
    answer:
      'Faz. O algodão deixa a região respirar, absorve umidade e reduz o risco de infecções. Tecidos sintéticos como poliéster e lycra abafam e favorecem o crescimento de fungos.\n\nDicas práticas: trocar a calcinha diariamente, evitar dormir com ela quando possível, e dar preferência a peças folgadas em vez de muito apertadas.',
    author: 'Equipe de Enfermagem',
  },
  {
    id: '7',
    category: 'contraception',
    question: 'Esqueci de tomar a pílula. O que fazer?',
    answer:
      'Depende de quanto tempo passou. Se foram menos de 12 horas, tome assim que lembrar e continue o próximo comprimido no horário normal — a eficácia se mantém.\n\nSe passaram mais de 12 horas, tome a esquecida na hora, continue a próxima no horário habitual e use preservativo nos próximos 7 dias. Em caso de dúvida ou esquecimento repetido, procure a UBS.',
    author: 'Equipe Farmacêutica',
  },
  {
    id: '8',
    category: 'contraception',
    question: 'DIU dói para colocar?',
    answer:
      'A colocação dura cerca de 5 minutos e pode causar desconforto parecido com cólica menstrual. A maioria das mulheres descreve como suportável.\n\nPode-se tomar um analgésico cerca de 1 hora antes do procedimento. A UBS coloca DIU de cobre gratuitamente, com duração de até 10 anos. Converse com a equipe sobre o que esperar.',
    author: 'Equipe Médica',
  },
  {
    id: '9',
    category: 'contraception',
    question: 'Pílula do dia seguinte engorda ou faz mal?',
    answer:
      'A pílula do dia seguinte não engorda. Pode causar náusea, dor de cabeça e sangramento de escape nos dias seguintes, mas os efeitos passam rápido.\n\nIMPORTANTE: ela é para emergência, não método contínuo. Usar com frequência reduz a eficácia e pode bagunçar o ciclo. Para uso regular, escolha outro método com orientação da UBS.',
    author: 'Equipe Farmacêutica',
  },
  {
    id: '10',
    category: 'pregnancy',
    question: 'Quando devo fazer o primeiro pré-natal?',
    answer:
      'Assim que descobrir a gravidez. Quanto antes começar o pré-natal, melhor para sua saúde e a do bebê.\n\nA UBS oferece todo o acompanhamento de pré-natal gratuitamente: consultas, exames, vacinas e orientação. Não adie — o ideal é iniciar antes da 12ª semana.',
    author: 'Equipe Médica',
  },
  {
    id: '11',
    category: 'pregnancy',
    question: 'O beta-HCG dá resultado antes do atraso?',
    answer:
      'Sim. O beta-HCG de sangue detecta gravidez a partir de 8 a 10 dias após a relação sem proteção, antes mesmo do atraso menstrual.\n\nA UBS oferece o exame gratuitamente. Para o teste de farmácia (urina), espere pelo menos o primeiro dia de atraso para ter mais segurança no resultado.',
    author: 'Equipe Médica',
  },
  {
    id: '12',
    category: 'sexuality',
    question: 'Camisinha protege 100% contra IST?',
    answer:
      'Usada do começo ao fim da relação, a camisinha tem alta eficácia contra a maioria das ISTs e contra a gravidez. Mas não chega a 100%.\n\nAlgumas infecções (como HPV e herpes) podem ser transmitidas por contato com pele que a camisinha não cobre. Por isso, além do preservativo, fazer exames de rotina é fundamental.',
    author: 'Equipe Médica',
  },
  {
    id: '13',
    category: 'wellbeing',
    question: 'Como aliviar TPM sem remédio?',
    answer:
      'Várias estratégias ajudam: reduzir sal, café e açúcar nos dias de TPM, beber bastante água, dormir bem, e se exercitar mesmo que de forma leve (caminhada conta).\n\nCompressa morna no abdômen e chás de camomila ou erva-doce também aliviam cólicas. Se os sintomas forem muito intensos e atrapalharem seu dia, procure a UBS — existe tratamento.',
    author: 'Equipe Médica',
  },
  {
    id: '14',
    category: 'intimate',
    question: 'Posso usar absorvente interno todo dia?',
    answer:
      'Não. Absorvente interno (OB) deve ser usado só durante a menstruação. Usar quando não está menstruada pode ressecar e irritar a mucosa.\n\nDurante a menstruação, troque a cada 4 a 6 horas. Nunca deixe mais de 8 horas para evitar o risco de síndrome do choque tóxico, que é raro mas grave.',
    author: 'Equipe de Enfermagem',
  },
  {
    id: '15',
    category: 'cycle',
    question: 'É normal sangrar fora da menstruação?',
    answer:
      'Sangramentos pequenos no meio do ciclo (escape) podem acontecer, principalmente perto da ovulação ou nos primeiros meses de uso de anticoncepcional.\n\nSe o sangramento for frequente, abundante ou vier com dor, procure a UBS. Pode ser pólipo, alteração hormonal ou outra condição que precisa de avaliação.',
    author: 'Equipe Médica',
  },
];

export function searchDuvidas(term, category) {
  const t = term?.trim().toLowerCase() || '';
  return DUVIDAS.filter((d) => {
    if (category && category !== 'all' && d.category !== category) return false;
    if (t) {
      const haystack = `${d.question} ${d.answer}`.toLowerCase();
      if (!haystack.includes(t)) return false;
    }
    return true;
  });
}
