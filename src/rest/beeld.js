const Router = require("@koa/router");
const path = require('node:path');
const fs = require('node:fs').promises;

const getBedrijfLogoById = async (ctx) => {
  try {
    const bedrijfId = ctx.params.id;
    const logoPath = path.join('public', 'logos', bedrijfId);
    const logo = await fs.readFile(logoPath);
    ctx.set('Cross-Origin-Resource-Policy', 'cross-origin');
    ctx.type = path.extname(bedrijfId);
    ctx.body = logo;
  } catch (err) {
    ctx.status = 404;
    ctx.body = 'File not found';
  }
}

const getProductAfbeeldingById = async (ctx) => {
  try {
    const productId = ctx.params.id;
    const afbeeldingPath = path.join('public', 'productafbeeldingen', productId);
    const afbeelding = await fs.readFile(afbeeldingPath);
    ctx.set('Cross-Origin-Resource-Policy', 'cross-origin');
    ctx.type = path.extname(productId);
    ctx.body = afbeelding;
  } catch (err) {
    ctx.status = 404;
    ctx.body = 'File not found';
  }
}

module.exports = (app) => {
  const router = new Router({
    prefix: "/beelden"
  });

  router.get("/logo/:id", getBedrijfLogoById);
  router.get("/product/:id", getProductAfbeeldingById);

  app.use(router.routes()).use(router.allowedMethods());
}
