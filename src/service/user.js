const { PrismaClient } = require("@prisma/client");

const { hashPassword, verifyPassword } = require("../core/password");
const { getLogger } = require("../core/logging");
const { generateJWT, verifyJWT } = require("../core/jwt");
const ServiceError = require("../core/serviceError");
const Role = require("../core/roles");

const handleDBError = require("./_handleDBError");
const { getLiveNotifications } = require("./notificatie");

const prisma = new PrismaClient();
let notificatieTaskID = null;

const checkAndParseSession = async (authHeader) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token");
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, ID, BEDRIJF_ID } = await verifyJWT(authToken);

    return {
      ID,
      roles,
      BEDRIJF_ID,

      authToken,
    };
  } catch (error) {
    getLogger().error(error.message, { error });
    throw new Error(error.message);
  }
};

const checkRole = (role, roles) => {
  const hasPermission = roles === role;

  if (!hasPermission) {
    throw ServiceError.forbidden(
      "You are not allowed to view this part of the application"
    );
  }
};

const getAll = async () => {
  const users = await prisma.user.findMany();
  return { items: users };
};

const getById = async (ID) => {
  const user = await prisma.user.findUnique({
    where: { ID },
  });
  if (!user) {
    throw ServiceError.notFound(`Er bestaat geen gebruiker met id ${ID}`, {
      ID,
    });
  }
  return user;
};

const makeExposedUser = ({ ID, DTYPE, USERNAME, BEDRIJF_ID }) => ({
  ID,
  DTYPE,
  USERNAME,
  BEDRIJF_ID,
});

const makeLoginData = async (user) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token,
  };
};

const getByUsername = async (USERNAME) => {
  const user = await prisma.user.findUnique({
    where: { USERNAME },
  });
  if (!user) {
    throw ServiceError.notFound(
      `Er bestaat geen gebruiker met gebruikersnaam ${USERNAME}`,
      { USERNAME }
    );
  }
  return user;
};

const login = async (USERNAME, PASSWORD) => {
  const user = await getByUsername(USERNAME);

  if (!user) {
    throw ServiceError.unauthorized(
      "Gegeven gebruikersnaam en wachtwoord matchen niet"
    );
  }

  const passwordValid = await verifyPassword(PASSWORD, user.PASSWORD);
  if (!passwordValid) {
    throw ServiceError.unauthorized(
      "Gegeven gebruikersnaam en wachtwoord matchen niet"
    );
  }

  if (notificatieTaskID) {
    clearInterval(notificatieTaskID);
  }

  await runLiveNotifications(user.ID);

  return await makeLoginData(user);
};

async function runLiveNotifications(ID) {
  notificatieTaskID = await getLiveNotifications(ID);
}

const updateLogoutDatum = async (ID) => {
  if (notificatieTaskID) {
    clearInterval(notificatieTaskID);
  }

  const updatedUser = await prisma.user.update({
    where: { ID },
    data: {
      LAATSTE_LOGOUT: new Date(),
    },
  });

  await prisma.notificatie.updateMany({
    where: {
      USER_ID: ID,
      STATUS: "NIEUW",
    },
    data: {
      STATUS: "ONGELEZEN"
    }
  })

  return updatedUser;
};

module.exports = {
  getAll,
  getById,
  login,
  checkAndParseSession,
  checkRole,
  updateLogoutDatum,
  runLiveNotifications,
  notificatieTaskID
};
