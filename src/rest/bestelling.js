const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const bestellingService = require("../service/bestelling");
const { requireAuthentication } = require("../core/auth");

const getAllBestellingen = async (ctx) => {
  ctx.body = await bestellingService.getAll();
};

getAllBestellingen.validationScheme = null;

const createBestelling = async (ctx) => {
  const newBestelling = await bestellingService.create({
    ...ctx.request.body,
  });
  ctx.body = newBestelling;
  ctx.status = 201;
};

createBestelling.validationScheme = {
  body: {
    BEDRAG: Joi.number().positive().invalid(0).required(),
    BETAALDAG: Joi.date().iso().min("now").required(),
    BETALINGSSTATUS: Joi.string().required(),
    DATUMGEPLAATST: Joi.date().iso().required(),
    DATUMLAATSTEBETALINGSHERINNERING: Joi.date().iso(),
    HEEFTBETALINGSHERINNERING: Joi.boolean().required(),
    LEVERADRES: Joi.string().required(),
    ORDERID: Joi.string()
      .regex(/^ORD\d+/)
      .required(),
    ORDERSTATUS: Joi.number().integer().positive().required(),
    KLANT_ID: Joi.number().integer().positive().required(),
    LEVERANCIER_ID: Joi.number().integer().positive().required(),
    //producten 
  },
};

const getBestellingById = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await bestellingService.getById(Number(ctx.params.id), ID);
};

getBestellingById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/*const deleteBestelling = async (ctx) => {
  await bestellingService.deleteById(Number(ctx.params.id));
  ctx.status = 204;
};

deleteBestelling.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};*/

const getAllByUserId = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await bestellingService.getAllByUserId(ID);
};

getAllByUserId.validationScheme = null;

module.exports = (app) => {
  const router = new Router({
    prefix: "/bestellingen",
  });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllBestellingen.validationScheme),
    getAllBestellingen
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createBestelling.validationScheme),
    createBestelling
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getBestellingById.validationScheme),
    getBestellingById
  );
  /*router.delete(
    "/:id",
    requireAuthentication,
    validate(deleteBestelling.validationScheme),
    deleteBestelling
  );*/
  router.get(
    "/me/bestellingen",
    requireAuthentication,
    validate(getAllByUserId.validationScheme),
    getAllByUserId
  );
  app.use(router.routes()).use(router.allowedMethods());
};
