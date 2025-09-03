const config = require('config');
const Koa = require('koa');
const WebSocket = require("ws");

const { initializeLogger, getLogger } = require('./core/logging');
const installRest = require('./rest');
const installMiddleware = require('./core/installMiddleware');
const { wsClient } = require('./service/notificatie');

const NODE_ENV = config.get('env');
const LOG_LEVEL = config.get('log.level');
const LOG_DISABLED = config.get('log.disabled');

async function createServer() {
    initializeLogger({
        level: LOG_LEVEL,
        disabled: LOG_DISABLED,
        defaultMeta: {
            NODE_ENV,
        },
    });

    const app = new Koa();

    installMiddleware(app);

    installRest(app);

    return {
        getApp() {
            return app;
        },

        start() {
            return new Promise((resolve) => {
                app.listen(9000, () => {
                    getLogger().info('🚀 Server listening on http://localhost:9000');
                    resolve();
                });
            });
        },

        async stop() {
            app.removeAllListeners();
            getLogger().info('Goodbye! 👋');
        },
    };
};

function createWSServer() {
    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', (ws) => {
        if (!wsClient || wsClient.size < 1)
            wsClient.add(ws);

        ws.on('close', () => {
            wsClient.delete(ws);
            wsClient.clear();
        });
    });
}

module.exports = {
    createServer,
    createWSServer
}
