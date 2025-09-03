const Router = require("@koa/router");
const Joi = require("joi");

const validate = require("../core/validation");
const userService = require("../service/user");
const { requireAuthentication, makeRequireRole } = require("../core/auth");
const Role = require("../core/roles");

const getAllUsers = async (ctx) => {
  ctx.body = await userService.getAll();
};

getAllUsers.validationScheme = null;

const login = async (ctx) => {
  const { USERNAME, PASSWORD } = ctx.request.body;
  const token = await userService.login(USERNAME, PASSWORD);
  ctx.body = token;
};
login.validationScheme = {
  body: {
    USERNAME: Joi.string(),
    PASSWORD: Joi.string().min(3).max(30),
  },
};

const logout = async (ctx) => {
  const { ID } = ctx.state.session;
  await userService.updateLogoutDatum(ID);
  ctx.status = 200;
};

logout.validationScheme = null;

const getUserById = async (ctx) => {
  ctx.body = await userService.getById(Number(ctx.params.id));
};

getUserById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const checkUserId = (ctx, next) => {
  const { ID, DTYPE } = ctx.state.session;
  const { id } = ctx.params;

  if (id !== ID && !(DTYPE === Role.ADMIN)) {
    return ctx.throw(
      403,
      "You are not allowed to view this user's information",
      {
        code: "FORBIDDEN",
      }
    );
  }
  return next();
};

module.exports = function installUsersRoutes(app) {
  const router = new Router({
    prefix: "/users",
  });

  router.post("/login", validate(login.validationScheme), login);

  router.put("/logout", requireAuthentication, validate(logout.validationScheme), logout);

  const requireAdmin = makeRequireRole(Role.ADMIN);

  router.get(
    "/",
    requireAuthentication,
    requireAdmin,
    validate(getAllUsers.validationScheme),
    getAllUsers
  );

  router.get(
    "/:id",
    requireAuthentication,
    validate(getUserById.validationScheme),
    getUserById,
    checkUserId
  );

  app.use(router.routes()).use(router.allowedMethods());
};
