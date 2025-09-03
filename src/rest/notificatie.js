const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const notificatieService = require("../service/notificatie");
const { requireAuthentication } = require("../core/auth");

const getAllByUserId = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await notificatieService.getAllByUserId(ID);
};

getAllByUserId.validationScheme = null;

// const getById = async (ctx) => {
//   ctx.body = await notificatieService.getById(Number(ctx.params.id));
// }

// getById.validationScheme = null;

const getMostRecentByUserId = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await notificatieService.getMostRecentByUserId(ID);
};

getMostRecentByUserId.validationScheme = null;

const create = async (ctx) => {
  const newNotificatie = await notificatieService.create({
    ...ctx.request.body,
  });
  ctx.body = newNotificatie;
  ctx.status = 201;
};

create.validationScheme = {
  body: {
    ORDER_ID: Joi.number().integer().positive().required(),
    USER_ID: Joi.number().integer().positive().required(),
    TEXT: Joi.string().required(),
    TYPE: Joi.string()
      .valid("BETALINGSVERZOEK", "BETALINGONTVANGEN", "ORDERVERZENDBAAR")
      .required(),
    STATUS: Joi.string().valid("GELEZEN", "ONGELEZEN", "NIEUW").required(),
    DATUM: Joi.date().iso().required(),
  },
};

const updateById = async (ctx) => {
  ctx.body = await notificatieService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
  });
  ctx.status = 200;
};

updateById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    ORDER_ID: Joi.number().integer().positive().required(),
    USER_ID: Joi.number().integer().positive().required(),
    TEXT: Joi.string().required(),
    TYPE: Joi.string()
      .valid("BETALINGSVERZOEK", "BETALINGONTVANGEN", "ORDERVERZENDBAAR")
      .required(),
    STATUS: Joi.string().valid("GELEZEN", "ONGELEZEN", "NIEUW").required(),
    DATUM: Joi.date().iso().required(),
  },
};

const readNotificationById = async (ctx) => {
  const { ID } = ctx.state.session;
  ctx.body = await notificatieService.readNotificationById(
    Number(ctx.params.id),
    ID
  );
  ctx.status = 200;
};

readNotificationById.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

module.exports = (app) => {
  const router = Router({
    prefix: "/notificaties",
  });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllByUserId.validationScheme),
    getAllByUserId
  );
  router.get(
    "/recent",
    requireAuthentication,
    validate(getMostRecentByUserId.validationScheme),
    getMostRecentByUserId
  );
  router.post(
    "/",
    requireAuthentication,
    validate(create.validationScheme),
    create
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateById.validationScheme),
    updateById
  );
  router.put(
    "/:id/lees",
    requireAuthentication,
    validate(readNotificationById.validationScheme),
    readNotificationById
  );
  app.use(router.routes()).use(router.allowedMethods());
};
