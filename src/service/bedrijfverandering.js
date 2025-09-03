const { PrismaClient } = require("@prisma/client");

const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const prisma = new PrismaClient();

const getAll = async ({ ID, BEDRIJF_ID }) => {
  const bedrijfveranderingen = await prisma.bedrijfverandering.findMany({
    where: {
      AANGEVRAAGDDOOR_ID: ID,
      BEDRIJF_ID,
    },
  });
  return { items: bedrijfveranderingen };
};

const getById = async (ID) => {
  const bedrijfverandering = await prisma.bedrijfverandering.findUnique({
    where: {
      ID,
    },
  });
  if (!bedrijfverandering) {
    throw ServiceError.notFound(
      `Er bestaat geen bedrijfverandering met id ${ID}`,
      { ID }
    );
  }
  return bedrijfverandering;
};

const getAllByUserId = async (AANGEVRAAGDDOOR_ID) => {
  try {
    const bedrijfveranderingen = await prisma.bedrijfverandering.findMany({
      where: {
        AANGEVRAAGDDOOR_ID,
      },
    });
    return { items: bedrijfveranderingen };
  } catch (error) {
    throw handleDBError(error);
  }
};

const create = async ({
  AANGEVRAAGDOP,
  ACCOUNTSINDS,
  ADRES,
  BETALINGSINFO,
  CONTACTGEGEVENS,
  ISACTIEFKLANT,
  ISACTIEFLEVERANCIER,
  ISAFGEKEURD,
  ISGOEDGEKEURD,
  LOGOIMAGE,
  SECTOR,
  AANGEVRAAGDDOOR_ID,
  BEDRIJF_ID,
}) => {
  try {
    const newBedrijfverandering = await prisma.bedrijfverandering.create({
      data: {
        AANGEVRAAGDOP,
        ACCOUNTSINDS,
        ADRES,
        BETALINGSINFO,
        CONTACTGEGEVENS,
        ISACTIEFKLANT,
        ISACTIEFLEVERANCIER,
        ISAFGEKEURD,
        ISGOEDGEKEURD,
        LOGOIMAGE,
        SECTOR,
        AANGEVRAAGDDOOR_ID,
        BEDRIJF_ID,
      },
    });
    return getById(newBedrijfverandering.ID);
  } catch (error) {
    throw handleDBError(error);
  }
};

module.exports = {
  getAll,
  getById,
  getAllByUserId,
  create,
};
