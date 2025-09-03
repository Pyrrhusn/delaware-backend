const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const bedrijfveranderingService = require("../service/bedrijfverandering");
const { requireAuthentication } = require("../core/auth");

const getAllBedrijfveranderingen = async (ctx) => {
  const { ID, BEDRIJF_ID } = ctx.state.session;
  ctx.body = await bedrijfveranderingService.getAll({ ID, BEDRIJF_ID });
};

getAllBedrijfveranderingen.validationScheme = null;

const createBedrijfVerandering = async (ctx) => {
  const data = {
    ...ctx.request.body,
  };
  const { ID, BEDRIJF_ID } = ctx.state.session;

  data.AANGEVRAAGDDOOR_ID = Number(ID);
  data.BEDRIJF_ID = BEDRIJF_ID;

  data.AANGEVRAAGDOP = new Date();
  console.log("het is aangevraagd door:", data);
  const newBedrijfverandering = await bedrijfveranderingService.create(data);
  ctx.body = newBedrijfverandering;
  ctx.status = 201;
};

createBedrijfVerandering.validationScheme = {
  body: {
    // AANGEVRAAGDOP: Joi.date().iso().required(),
    ACCOUNTSINDS: Joi.date().iso().required(),
    ADRES: Joi.string().required(),
    BETALINGSINFO: Joi.array().items(Joi.string()).required(),
    CONTACTGEGEVENS: Joi.object()
      .keys({
        contactpersoon: Joi.string().required(),
        email: Joi.string().email().required(),
        telefoon: Joi.string().required(),
      })
      .required(),
    ISACTIEFKLANT: Joi.boolean().required(),
    ISACTIEFLEVERANCIER: Joi.boolean().required(),
    ISAFGEKEURD: Joi.boolean().required(),
    ISGOEDGEKEURD: Joi.boolean().required(),
    LOGOIMAGE: Joi.string().uri().required(),
    SECTOR: Joi.string().required(),
    //AANGEVRAAGDDOOR_ID: Joi.number().integer().positive().required(),
    // BEDRIJF_ID: Joi.number().integer().positive().required(),
  },
};
/*
createBedrijfVerandering.validationScheme = {
  body: {
    // AANGEVRAAGDOP: Joi.date().iso().required(),
    ACCOUNTSINDS: Joi.any().required(),
    ADRES: Joi.any().required(),
    BETALINGSINFO: Joi.any().required(),
    CONTACTGEGEVENS: Joi.any().required(),
    ISACTIEFKLANT: Joi.any().required(),
    ISACTIEFLEVERANCIER: Joi.any().required(),
    ISAFGEKEURD: Joi.any().required(),
    ISGOEDGEKEURD: Joi.any().required(),
    LOGOIMAGE: Joi.any().required(),
    SECTOR: Joi.any().required(),
    //AANGEVRAAGDDOOR_ID: Joi.any().required(),
    // BEDRIJF_ID: Joi.any().required(),
  },
};
*/

const getBedrijfveranderingById = async (ctx) => {
  ctx.body = await bedrijfveranderingService.getById(Number(ctx.params.id));
};

getBedrijfveranderingById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getAllByUserId = async (ctx) => {
  ctx.body = await bedrijfveranderingService.getAllByUserId(
    Number(ctx.params.id)
  );
};
getAllByUserId.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/bedrijfveranderingen",
  });

  router.get(
    "/",
    requireAuthentication,
    validate(getAllBedrijfveranderingen.validationScheme),
    getAllBedrijfveranderingen
  );
  router.post(
    "/",
    requireAuthentication,
    validate(createBedrijfVerandering.validationScheme),
    createBedrijfVerandering
  );
  router.get(
    "/:id",
    requireAuthentication,
    validate(getBedrijfveranderingById.validationScheme),
    getBedrijfveranderingById
  );
  router.get(
    "/:id/users",
    requireAuthentication,
    validate(getAllByUserId.validationScheme),
    getAllByUserId
  );
  app.use(router.routes()).use(router.allowedMethods());
};
