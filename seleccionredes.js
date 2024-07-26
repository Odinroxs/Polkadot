const { ApiPromise, WsProvider } = require('@polkadot/api');
const readline = require('readline');

// Configurar readline para interactuar con el usuario a través de la terminal
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Función para conectarse a una red específica
async function connectToNetwork(networkName) {
  let wsProviderUrl;

  switch (networkName) {
    case 'polkadot':
      wsProviderUrl = 'wss://rpc.polkadot.io';
      break;
    case 'kusama':
      wsProviderUrl = 'wss://kusama-rpc.polkadot.io';
      break;
    case 'rococo':
      wsProviderUrl = 'wss://rococo-rpc.polkadot.io';
      break;
    default:
      throw new Error('Red desconocida');
  }

  const wsProvider = new WsProvider(wsProviderUrl);
  const api = await ApiPromise.create({ provider: wsProvider });

  await api.isReady;
  console.log(`Conectado a la red ${networkName}`);

  return api;
}

// Función para obtener información básica de la red
async function getNetworkInfo(api) {
  const chain = await api.rpc.system.chain();
  const nodeName = await api.rpc.system.name();
  const nodeVersion = await api.rpc.system.version();

  console.log(`Cadena: ${chain}`);
  console.log(`Nombre del nodo: ${nodeName}`);
  console.log(`Versión del nodo: ${nodeVersion}`);
}

// Función principal
async function main() {
  rl.question('¿A qué red quieres conectarte? (polkadot, kusama, rococo): ', async (networkName) => {
    try {
      const api = await connectToNetwork(networkName.toLowerCase());
      await getNetworkInfo(api);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      rl.close();
    }
  });
}

main().catch(console.error);
