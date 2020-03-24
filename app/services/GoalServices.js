import { NativeModules } from 'react-native';
import { BBRequest } from 'mov-react-native-connector';
import { BBNativeConstants } from 'mov-react-native';

import reserva from '../assets/images/goal_types/reserva.png';
import personalizada from '../assets/images/goal_types/personalizada.png';
import rentabilizar from '../assets/images/goal_types/rentabilizar.png';
import imovel from '../assets/images/goal_types/imovel.png';
import veiculo from '../assets/images/goal_types/veiculos.png';
import viagem from '../assets/images/goal_types/viagem.png';
import GoalStorage from '../persistence/GoalStorage';

export const goalImages = [reserva, personalizada, rentabilizar, imovel, veiculo, viagem];

// TODO replace this URI with the appropriate one when the service is ready
export default class GoalServices {
  uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoLancamentos/listarLancamentosPeriodoMFv7`;

  static actionValidarNome = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/validarNomePersonalizadoContratoAssessoriaEmInvestimentos`;

  static actionGetSimulation = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/consultarPlanoInvestimento`;

  static actionCreateGoal = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/gravarContratoAssessoriaInvestimento`;

  static actionCreateInvestment = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/incluirAplicacaoAtivosFinanceirosPlanoInvestimentoCliente`;

  static actionLoadInvestmentItemTerm = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/retornarTermoFundoInvestimento`;

  static actionLoadInvestmentItemTerm = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/retornarTermoFundoInvestimento`;

  static async isValidName(parameters, callBack, errorCallBack) {
    BBRequest.doRequest2(this.actionValidarNome, parameters, callBack, errorCallBack);
  }
  static async getSimulation(parameters, callBack, errorCallBack) {
    BBRequest.doRequest2(this.actionGetSimulation, parameters, callBack, errorCallBack);
  }

  static createGoal(parameters, callback, errorCallBack) {
    BBRequest.doRequest2(this.actionCreateGoal, parameters, callback, errorCallBack);
  }

  static createInvestment(parameters, callback, errorCallBack) {
    BBRequest.doRequest2(this.actionCreateInvestment, parameters, callback, errorCallBack);
  }

  static loadInvestmentItemTerm(parameters, callback, errorCallBack) {
    BBRequest.doRequest2(this.actionLoadInvestmentItemTerm, parameters, callback, errorCallBack);
  }

  /**
   * @method getInvestmentPlanSimulation - get the investment plan simulation
   * @description triggers the service that returns the investment plan simulation
   */
  static async getInvestmentPlanSimulation() {
    // TODO replace this parameters with the appropriate one when the service is ready
    const paramsMock = { dtInicio: '01-08-2018', dtFim: '23-08-2018' };
    const result = await BBRequest.doRequest(uri, paramsMock);
    return result;
  }

  /**
   * @method listInvestorProducts - Busca a lista de objetivos de acordo com o perfil
   *
   * @param {codigoTipoPerfilPlano} código do perfil do investidor
   * @param {codigoPerfilPlanoInvestimento} código do tipo de perfil
   * @returns {list} retorna uma lista de objetivos.
   */
  static async listInvestorProducts(codigoTipoPerfilPlano, codigoPerfilPlanoInvestimento) {
    const parameters = { codigoTipoPerfilPlano, codigoPerfilPlanoInvestimento };
    const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/listarObjetivosPlanoInvestimento`;
    const result = await BBRequest.doRequest(uri, parameters);
    const lista = result
      ? result.listarObjetivosPlanoInvestimento.listaOcorrencia
          .map(item => {
            return {
              ...item,
              image: goalImages[item.codigoObjetivoPlanoInvestimento - 1] || goalImages[1],
              nomePersonalizadoContrato: item.nomeObjetivoPlanoInvestimento,
              ordem: item.nomeObjetivoPlanoInvestimento === 'Crie seu objetivo' ? 0 : item.codigoObjetivoPlanoInvestimento,
            };
          })
          .sort((a, b) => b.ordem - a.ordem)
      : [];

    await GoalStorage.setInvestmentProducts(lista);
    return lista;
  }

  /**
   * Requests the user goals
   */
  static async listClientGoals() {
    const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/listarContratosAssessoriaFinanceira`;
    const result = await BBRequest.doRequest(uri, {});
    const contractsList = result.DadosRespostaListarContratosAssessoriaFinanceira.listaContrato;
    const notFinishedContracts = contractsList.filter(elem => elem.dataEncerramentoContrato === '01.01.0001');
    const rsp = notFinishedContracts.map(item => ({ ...item, image: goalImages[item.codigoObjetivoPlanoInvestimento - 1] || goalImages[1] }));

    console.log(uri);

    await GoalStorage.setClientGoals(rsp);
    return rsp;
  }

  static async getCPF() {
    //const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/cfe-mci/api/v2/dadosbasicos/cpf-cnpj`;
    const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/cfe-mci/api/v1/acionar-simulador-investimento`;
    await BBRequest.doRequest2(
      uri,
      {
        codigoClientePlanoInvestimento: 703002742,
        codigoUnidadeOrganizacionalContaCorrente: 0,
        numeroContaCorrente: 0,
        valorAplicacaoInicio: 0,
        valorAplicacaoAdicional: 0,
        codigoPeriodicidadeAplicacaoAdicional: 0,
        codigoObjetivoPlanoInvestimento: 0,
        codigoUnidadeOrganizacionalUsuarioResponsavel: 0,
        numeroContadorInicioCorrespondente: 0,
        numeroSequencialPlanoInvestimento: 0,
        numeroVersaoAlocacaoPlano: 0,
        valorTotalObjetivoPrevisto: 0,
        numeroPrazoAplicacaoAdicional: 0,
        numeroPrazoPermanenciaPlano: 0,
        codigoClienteResponsavelEstado: 0,
        numeroSimulacaoPrevidencia: 0,
        codigoPlanoPrevidencia: 0,
        nomePlanoPrevidencia: 'string',
        percentualTaxaCarga: 0,
        dataInicioAplicacao: 'string',
        dataFimAplicacao: 'string',
        diaParametroDebito: 0,
        numeroIdadeAposentadoria: 0,
        indicadorTipoTributacao: 'string',
        indicadorLancamentoImpostoRenda: 'string',
        numeroQuantidadeRegistroAtivo: 0,
        listaCalculoPlano: [
          {
            codigoAtivoFinanceiro: 0,
            nomeAtivoFinanceiro: 'string',
            percentualAlocacaoAtivo: 0,
            percentualProjecaoAtivo: 0,
            percentualTaxaAdministrador: 0,
            codigoTipoMetodologiaAtivo: 0,
          },
        ],
      },
      success => {
        console.log(success, 'SUCCESS');
      },
      error => {
        console.log(error, 'ERROR');
      },
    );
  }

  static async sendQuestionPrev(parameters) {
    const uri = `https://${BBNativeConstants.GRAFENO_SERVER}/cfe-bpr/api/v1/simular-venda-plano-previdencia-sem-projecao`;

    console.log(uri);
    await BBRequest.doRequest2(
      uri,
      parameters,
      success => {
        console.log(success, 'SUCCESS SERVICE');
        return success;
      },
      error => {
        console.log(error, 'ERRO SERVICE');
      },
      { Host: 'Grafeno' },
    );
  }
}
