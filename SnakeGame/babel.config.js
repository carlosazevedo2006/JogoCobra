/**
 * CONFIGURAÇÃO DO BABEL PARA EXPO
 * 
 * O Babel é um transpiler que converte código moderno
 * para versões compatíveis com diferentes dispositivos
 */
module.exports = function(api) {
  // Cache da configuração para melhor performance
  api.cache(true);
  
  return {
    // Preset do Expo - inclui todas as configurações necessárias
    presets: ['babel-preset-expo'],
    
    // Plugins adicionais
    plugins: [
      /**
       * Plugin necessário para o react-native-gesture-handler
       * Permite que os gestos funcionem corretamente
       */
      'react-native-reanimated/plugin',
    ],
  };
};