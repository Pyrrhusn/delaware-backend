const { PrismaClient } = require("@prisma/client");
const ServiceError = require("../core/serviceError");
const handleDBError = require("./_handleDBError");
const WebSocket = require('ws');
const { getLogger } = require("../core/logging");

const prisma = new PrismaClient();
const wsClient = new Set();

const getAllByUserId = async (userId) => {
  const notifications = await prisma.notificatie.findMany({
    where: {
      USER_ID: userId,
    },
    include: {
      bestelling: {
        select: {
          ORDERID: true,
        },
      },
    },
  });

  if (!notifications) {
    throw ServiceError.notFound(
      `Er zijn geen notificaties voor deze gebruiker met id ${userId}`,
      { userId }
    );
  }

  return { items: notifications };
};

const getMostRecentByUserId = async (userId, amount = 5) => {
  const notifications = await prisma.notificatie.findMany({
    where: {
      USER_ID: userId,
    },
    orderBy: {
      DATUM: "desc",
    },
    take: amount,
  });

  if (notifications.length === 0) {
    throw ServiceError.notFound(
      `Er zijn geen notificaties voor deze gebruiker met id ${userId}`,
      { userId }
    );
  }

  return { items: notifications };
};

const create = async ({ ORDER_ID, USER_ID, TEXT, TYPE, STATUS, DATUM }) => {
  try {
    const newNotification = await prisma.notificatie.create({
      data: {
        ORDER_ID,
        USER_ID,
        TEXT,
        TYPE,
        STATUS,
        DATUM,
      },
    });
    return newNotification;
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (ID, { TEXT, STATUS }) => {
  const existingNotificatie = await prisma.notificatie.findUnique({
    where: {
      ID,
    },
  });

  if (!existingNotificatie) {
    throw ServiceError.notFound(`Er bestaat geen notificatie met id ${ID}`);
  }

  try {
    await prisma.notificatie.update({
      where: {
        ID,
      },
      data: {
        TEXT,
        STATUS,
      },
    });

    return await prisma.notificatie.findUnique({
      where: {
        ID,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

const readNotificationById = async (ID, userId) => {
  const notification = await prisma.notificatie.findUnique({
    where: { ID },
  });

  if (notification.USER_ID !== userId) {
    throw ServiceError.unauthorized(
      "U bent niet gemachtigd om deze notificatie te lezen",
      { ID }
    );
  }

  if (!notification) {
    throw ServiceError.notFound(`Er bestaat geen notificatie met id ${ID}`, {
      ID,
    });
  }

  if (notification.STATUS === "NIEUW" || notification.STATUS === "ONGELEZEN") {
    await prisma.notificatie.update({
      where: { ID },
      data: {
        STATUS: "GELEZEN",
      },
    });
  }
};

async function getLiveNotifications(userId) {
  let latestNotificatieTimestamp = (await getMostRecentByUserId(userId, 1)).items?.at(0).DATUM || new Date().toISOString();

  const notificatiesTaskID = setInterval(async () => {
    const lastCheckedAt = await prisma.lastCheckNotificatieTimestamp.upsert(({
      where: { id: 1 },
      update: { lastCheckedAt: latestNotificatieTimestamp },
      create: { lastCheckedAt: new Date().toISOString() },
      select: { lastCheckedAt: true }
    }));
    console.log(latestNotificatieTimestamp);
    console.log(lastCheckedAt);

    const nieuweNotificaties = await prisma.notificatie.findMany({
      where: {
        USER_ID: userId,
        DATUM: {
          gt: lastCheckedAt.lastCheckedAt
        },
      },
      orderBy: {
        DATUM: "desc",
      }
    });

    latestNotificatieTimestamp = nieuweNotificaties[0]?.DATUM || latestNotificatieTimestamp;

    if (nieuweNotificaties && nieuweNotificaties.length !== 0) {
      // biome-ignore lint/complexity/noForEach: <explanation>
      wsClient.forEach((c) => {
        if (c.readyState === WebSocket.OPEN) {
          c.send(JSON.stringify(nieuweNotificaties));
        }
      });
    }
  }, 2000);

  return notificatiesTaskID;
}

module.exports = {
  getAllByUserId,
  getMostRecentByUserId,
  create,
  updateById,
  readNotificationById,
  getLiveNotifications,
  wsClient
};
