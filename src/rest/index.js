const Router = require('@koa/router');

const installBedrijfRouter = require('./bedrijf');
const installBedrijfVeranderingRouter = require("./bedrijfverandering");
const installBestellingRouter = require("./bestelling");
const installProductRouter = require("./product");
const installUserRouter = require("./user");
const installHealthRoutes = require('./health');
const installNotificatieRouter = require('./notificatie');
const installBeeldRouter = require('./beeld');
const installEmailRoutes = require('./sendEmail');
const installPDFRoutes = require("./generatePDF");

module.exports = (app) => {
    const router = new Router({
        prefix: '/api',
    });

    installBedrijfRouter(router);
    installBedrijfVeranderingRouter(router);
    installBestellingRouter(router);
    installProductRouter(router);
    installUserRouter(router);
    installHealthRoutes(router);
    installNotificatieRouter(router);
    installBeeldRouter(router);
    installEmailRoutes(router);
    installPDFRoutes(router);

    app.use(router.routes())
        .use(router.allowedMethods());
};
