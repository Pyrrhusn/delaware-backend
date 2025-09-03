const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const bedrijfService = require("../service/bedrijf");
const { requireAuthentication } = require("../core/auth");

const getAllBedrijven = async (ctx) => {
  ctx.body = await bedrijfService.getAll();
};

getAllBedrijven.validationScheme = null;

const getBedrijfById = async (ctx) => {
  const isForm = ctx.query.form === "true";
  const ID = Number(ctx.state.session.BEDRIJF_ID);

  ctx.body = await bedrijfService.getById({ ID, isForm });
};

getBedrijfById.validationScheme = {
  /*params: Joi.object({
    id: Joi.number().integer().positive(),
  }),*/
  query: {
    form: Joi.boolean().required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/bedrijf",
  });

  /*router.get(
    "/",
    requireAuthentication,
    validate(getAllBedrijven.validationScheme),
    getAllBedrijven
  );*/
  router.get(
    "/",
    requireAuthentication,
    validate(getBedrijfById.validationScheme),
    getBedrijfById
  );

  app.use(router.routes()).use(router.allowedMethods());
};
