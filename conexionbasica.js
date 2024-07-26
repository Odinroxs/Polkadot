const { ApiPromise, WsProvider } = require('@polkadot/api');

async function main() {
  // Proveedor WebSocket para conectarse a la red de Polkadot
  const wsProvider = new WsProvider('wss://rpc.polkadot.io');

  // Crear una instancia de la API
  const api = await ApiPromise.create({ provider: wsProvider });

  // Conexión a la red
  api.isReady.then(() => {
    console.log('Conectado a la red de Polkadot');
  }).catch((error) => {
    console.error('Error al conectar a la red de Polkadot:', error);
  });
}

// Llama a la función principal
main().catch(console.error);
