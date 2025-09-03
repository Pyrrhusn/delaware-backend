const { PrismaClient } = require("@prisma/client");

const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const prisma = new PrismaClient();

const getAll = async () => {
  const bestellingen = await prisma.bestelling.findMany();
  return { items: bestellingen };
};

const getById = async (ID, gebruikersId) => {
  const bestelling = await prisma.bestelling.findUnique({
    where: {
      ID,
    },
    include: {
      bestelling_product: {
        select: {
          AANTAL: true,
          price: true,
          product: {
            select: {
              NAAM: true,
              EENHEIDSPRIJS: true,
            },
          },
        },
      },
      user_bestelling_KLANT_IDTouser: {
        select: {
          USERNAME: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        },
      },
      user_bestelling_LEVERANCIER_IDTouser: {
        select: {
          USERNAME: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        },
      },
    },
  });

  if (!bestelling) {
    throw ServiceError.notFound(`Er bestaat geen bestelling met id ${ID}`, {
      ID,
    });
  }

  if (
    bestelling.KLANT_ID !== gebruikersId &&
    bestelling.LEVERANCIER_ID !== gebruikersId
  ) {
    throw ServiceError.unauthorized(`Gebruiker is niet gemachtigd om deze bestelling op te halen`, {
      gebruikersId,
    });
  }

  return bestelling;
};

const create = async ({
  BEDRAG,
  BETAALDAG,
  BETALINGSSTATUS,
  DATUMGEPLAATST,
  DATUMLAATSTEBETALINGSHERINNERING,
  HEEFTBETALINGSHERINNERING,
  LEVERADRES,
  ORDERID,
  ORDERSTATUS,
  KLANT_ID,
  LEVERANCIER_ID,
}) => {
  try {
    const newBestelling = await prisma.bestelling.create({
      data: {
        BEDRAG,
        BETAALDAG,
        BETALINGSSTATUS,
        DATUMGEPLAATST,
        DATUMLAATSTEBETALINGSHERINNERING,
        HEEFTBETALINGSHERINNERING,
        LEVERADRES,
        ORDERID,
        ORDERSTATUS,
        KLANT_ID,
        LEVERANCIER_ID,
        //producten 
      },
    });
    return getById(newBestelling.ID);
  } catch (error) {
    throw handleDBError(error);
  }
};

const deleteById = async (ID) => {
  try {
    const deleted = await prisma.bestelling.delete({
      where: {
        ID,
      },
    });
    if (!deleted) {
      throw ServiceError.notFound(`Er bestaat geen bestelling met id ${ID}`, {
        ID,
      });
    }
  } catch (error) {
    throw handleDBError(error);
  }
};

const getAllByUserId = async (ID) => {
  const bestellingen = await prisma.bestelling.findMany({
    where: {
      OR: [{ KLANT_ID: ID }, { LEVERANCIER_ID: ID }],
    },
    include: {
      user_bestelling_KLANT_IDTouser: {
        select: {
          ID: true,
          DTYPE: true,
          USERNAME: true,
          BEDRIJF_ID: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        }
      },
      user_bestelling_LEVERANCIER_IDTouser: {
        select: {
          ID: true,
          DTYPE: true,
          USERNAME: true,
          BEDRIJF_ID: true,
          bedrijf_user_BEDRIJF_IDTobedrijf: {
            select: { NAAM: true }
          }
        }
      }
    }
  });
  
  return { items: bestellingen };
};


module.exports = {
  getAll,
  getById,
  create,
  deleteById,
  getAllByUserId,
};
