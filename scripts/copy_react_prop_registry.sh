#!/bin/bash

cd ./scripts

function executeReactNativeChanges() {
  echo "Atualizando arquivos do React Native..."
  (cp ./ReactNativePropRegistry.js ../node_modules/react-native/Libraries/Renderer/shims/ReactNativePropRegistry.js && echo "Arquivos do React Native atualizados.") || echo "Não foi possivel atualizar os arquivos do React Native."
  
}

executeReactNativeChanges
