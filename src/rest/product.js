const Router = require("@koa/router");
const Joi = require("joi");
const { requireAuthentication } = require("../core/auth");
const validate = require("../core/validation");
const productService = require("../service/product");

const getAllProducten = async (ctx) => {
  const paginaNummer = parseInt(ctx.query.paginaNummer);
  const search = ctx.query.search;
  const aantal = parseInt(ctx.query.aantal);
  ctx.body = await productService.getAll({ paginaNummer, search, aantal });
};

getAllProducten.validationScheme = {
  query: {
    aantal: Joi.number().integer().min(1),
    paginaNummer: Joi.number().integer().min(1),
    search: Joi.string().allow("").allow(null),
  },
};

const getProductById = async (ctx) => {
  ctx.body = await productService.getById(Number(ctx.params.id));
};

getProductById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const getAllByVerkoperId = async (ctx) => {
  ctx.body = await productService.getAllByVerkoperId(Number(ctx.params.id));
};
getAllByVerkoperId.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

const updateProduct = async (ctx) => {
  await productService.updateById(Number(ctx.params.id), {
    ...ctx.request.body,
  });
  ctx.body = await productService.getById(Number(ctx.params.id));
  ctx.status = 200;
};

updateProduct.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    EENHEIDSPRIJS: Joi.number().positive().invalid(0),
    FOTOURL: Joi.string().uri().required(),
    INSTOCK: Joi.number().integer().positive(),
    NAAM: Joi.string().required(),
  },
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/producten",
  });

  router.get("/", validate(getAllProducten.validationScheme), getAllProducten);
  router.get("/:id", validate(getProductById.validationScheme), getProductById);
  router.get(
    "/:id/users",
    validate(getAllByVerkoperId.validationScheme),
    getAllByVerkoperId
  );
  router.put(
    "/:id",
    requireAuthentication,
    validate(updateProduct.validationScheme),
    updateProduct
  );
  app.use(router.routes()).use(router.allowedMethods());
};
