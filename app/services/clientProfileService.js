import { NativeModules } from 'react-native';
import { BBRequest } from 'mov-react-native-connector';

const _consultarAPICliente = (successCallback, errorCallback) => {
  const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPerfilInvestidor/consultarAPICliente`;
  return BBRequest.doRequest2(uri, {}, successCallback, errorCallback);
};

const _consultarPerfilInvestidor = (successCallback, errorCallback) => {
  const uri = `https://${NativeModules.BBRNNativeConstants.CENTRALIZADOR_SERVER}/servico/ServicoPerfilInvestidor/consultarPerfilInvestidor`;
  return BBRequest.doRequest2(uri, {}, successCallback, errorCallback);
};

const clientProfileService = (successCallback, errorCallback) => {
  _consultarAPICliente(
    apiSuccess => {
      _consultarPerfilInvestidor(
        perfilSuccess => {
          const result = { ...apiSuccess.perfilInvestidor, ...perfilSuccess.perfilInvestidor };
          const hasProfile = (result.indicadorExibicaoQuestionario === 'N' || result.indicadorExibicaoQuestionario === '') && result.codigoTipoNotificacao === 99;
          successCallback(Object.assign(result, { hasProfile }));
        },
        () => {
          successCallback(Object.assign(apiSuccess, { hasProfile: false }));
        },
      );
    },
    apiError => errorCallback(apiError),
  );
};

export default clientProfileService;
