const { createServer, createWSServer } = require('./createServer');

async function main() {

    try {
        const server = await createServer();
        await server.start();
        createWSServer();

        async function onClose() {
            await server.stop();
            process.exit(0);
        }

        process.on('SIGTERM', onClose);
        process.on('SIGQUIT', onClose);
    } catch (error) {
        console.error(error);
        process.exit(-1);
    }
}

main();
