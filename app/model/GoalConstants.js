import reserva from '../assets/images/goal_types/reserva.png';
import personalizada from '../assets/images/goal_types/personalizada.png';
import rentabilizar from '../assets/images/goal_types/rentabilizar.png';
import imovel from '../assets/images/goal_types/imovel.png';
import veiculo from '../assets/images/goal_types/veiculos.png';
import viagem from '../assets/images/goal_types/viagem.png';

export const goalImages = [reserva, personalizada, rentabilizar, imovel, veiculo, viagem];

export const GOAL_TYPE = {
  TRAVEL: 0,
  PATRIMONY: 1,
  VEHICLE: 2,
  PROPERTY: 3,
  EMERGENCY: 4,
  CUSTOM: 5,
};

export const ANALYTICS_EVENT_NAME = 'METAS';

export const GOAL_PERIOD_RANGE = {
  TRAVEL: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'month',
  },
  PATRIMONY: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'month',
  },
  VEHICLE: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'month',
  },
  PROPERTY: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'year',
  },
  EMERGENCY: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'month',
  },
  CUSTOM: {
    minimum: 0,
    maximum: 360,
    step: 1,
    mode: 'month',
  },
};

export const INVESTMENT_TERM_ITEM_PARAMS = {
  codigoSistemaOrigemAcolhimento: 'MOV',
  textoDescricaoAcolhimentoTermo: 'MOBILE',
  indicadorMovimentacaoAutomatico: 'T',
  codigoTipoAcolhimentoTermo: 1,
  codigoEstadoTermoFundo: 1,
  dataPerInicioAcolhimento: '01.01.0001',
  dataPerFimAcolhimento: '31.12.9999',
  codigoTipoTermo: 9999,
  codigoTipoAssinatura: 9999,
  numeroSequencial: 1,
  numeroOcorrencia: 1,
  numeroOcorrenciaValido: 1,
};

const MONTH_SUFFIX = {
  0: null,
  1: 'mês',
  default: 'meses',
};

const YEAR_SUFFIX = {
  0: null,
  1: 'ano',
  default: 'anos',
};

export default class GoalDataSource {
  static getGoalRange() {
    return GOAL_PERIOD_RANGE.TRAVEL;
  }

  static getGoalPickerValues(maxMonths = 360) {
    const months = Array.from({ length: maxMonths }, (value, key) => key + 1);
    const periods = [];
    periods.push({ value: '0', label: 'Não quero definir um prazo' });
    months.forEach(monthNumber => {
      const year = Math.floor(monthNumber / 12);
      const month = monthNumber % 12;
      const yearName = `${year === 0 ? '' : `${year} ${YEAR_SUFFIX[year] || YEAR_SUFFIX.default}`}`;
      const monthName = `${month === 0 ? '' : `${month} ${MONTH_SUFFIX[month] || MONTH_SUFFIX.default}`}`;
      const andLetter = `${yearName && monthName ? ' e ' : ''}`;
      periods.push({ value: monthNumber, label: `${yearName}${andLetter}${monthName}` });
    });
    return periods;
  }
}
