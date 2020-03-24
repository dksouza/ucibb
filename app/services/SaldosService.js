import { NativeModules } from 'react-native';
import { BBRequest } from 'mov-react-native-connector';
import StringUtil from 'mov-react-native/components/stringutil';

const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoSaldo/saldosDisponiveis`;
const CONTA_CORRENTE = 1;

export default class SaldosService {
  /**
   * @method getSaldos - Consulta os saldos disponíveis
   *
   * @returns {} Object Saldos
   */
  static async execute() {
    const json = await BBRequest.doRequest(uri);
    const { gruposSaldos } = json.servicoSaldo;
    const total = SaldosService._getTotal(gruposSaldos);
    const retorno = Object.assign({}, { total, saldos: gruposSaldos });
    return retorno;
  }

  static _getTotal(saldos) {
    if (!saldos) {
      return 0.0;
    }
    const { valorDisponivelContaCorrente } = saldos.find(item => item.codigoTipo === CONTA_CORRENTE) || { valorDisponivelContaCorrente: '0.0' };
    let total = StringUtil.formatStringCurrencyToDecimalNumber(valorDisponivelContaCorrente);
    saldos.map(item => {
      item.saldos.map(e => {
        if (e.indicadorResgateAut === 'S') {
          total += StringUtil.formatStringCurrencyToDecimalNumber(e.valor1);
        }
        return total;
      });
      return total;
    });
    return total;
  }
}
