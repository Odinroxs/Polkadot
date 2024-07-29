const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const { cryptoWaitReady } = require('@polkadot/util-crypto');
const fs = require('fs');

async function main() {
    try {
        console.log('Conectando al nodo...');
        const wsProvider = new WsProvider('ACA VA LA RED');
        const api = await ApiPromise.create({ provider: wsProvider });
        console.log('Conexión exitosa');

        console.log('Esperando a las utilidades criptográficas...');
        await cryptoWaitReady();
        console.log('Utilidades criptográficas listas');

        console.log('Leyendo el archivo JSON exportado...');
        const json = JSON.parse(fs.readFileSync('ACA VA TU BILLETERA EXPORTADA', 'utf8'));
        console.log('Archivo JSON leído correctamente');

        console.log('Creando el Keyring...');
        const keyring = new Keyring({ type: 'sr25519' });
        console.log('Keyring creado');

        console.log('Añadiendo la cuenta desde el archivo JSON...');
        const user = keyring.addFromJson(json);
        console.log('Cuenta añadida al Keyring');

        console.log('Decodificando la cuenta...');
        user.decodePkcs8('ACA VA LA CLAVE DE TU BILLETERA');
        console.log('Cuenta decodificada');

        // Parámetros del nuevo activo
        const assetId = 1000; // Identificador del activo
        const minBalance = 1; // Balance mínimo
        const name = 'Argmining'; // Nombre del activo
        const symbol = 'ARG'; // Símbolo del activo
        const decimals = 2; // Decimales del activo

        console.log('Creando la transacción...');
        if (api.tx.assets) {
            const tx = api.tx.assets.create(assetId, user.address, minBalance);
            console.log('Transacción creada');

            console.log('Firmando y enviando la transacción...');
            const hash = await tx.signAndSend(user);
            console.log('Transacción enviada con hash:', hash.toHex());

            console.log('Estableciendo los detalles del activo...');
            const detailsTx = api.tx.assets.setMetadata(assetId, name, symbol, decimals);
            await detailsTx.signAndSend(user);
            console.log('Detalles del activo establecidos correctamente');

            console.log('¡Activo creado con éxito!');
        } else {
            console.log('El módulo assets no está disponible en api.tx');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        process.exit();
    }
}

main();
