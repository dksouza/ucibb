import { NativeModules } from 'react-native';
import { BBRequest } from 'mov-react-native-connector';

export default class MyGoalsService {
  static async consultContract(parameters, callBack, errorCallBack) {
    const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/consultarSaldosContratoAssessoriaEmInvestimentos`;
    BBRequest.doRequest2(uri, parameters, callBack, errorCallBack);
  }

  static async terminateContract(parameters, callBack, errorCallBack) {
    const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPlanoInvestimento/encerrarContratoAssessoriaInvestimento`;
    BBRequest.doRequest2(uri, parameters, callBack, errorCallBack);
  }
}
