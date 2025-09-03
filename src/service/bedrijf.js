const { PrismaClient } = require("@prisma/client");
const javaDeserialization = require("java-deserialization");
const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");
const { getLogger } = require("../core/logging");

const prisma = new PrismaClient();

const getAll = async () => {
  const bedrijven = await prisma.bedrijf.findMany();
  return { items: bedrijven };
};

const getById = async ({ ID, isForm }) => {
  let bedrijf;

  if (isForm) {
    bedrijf = await prisma.bedrijf.findUnique({
      where: {
        ID,
      },
      select: {
        ID: true,
        NAAM: true,
        ACCOUNTSINDS: true,
        ADRES: true,
        BETALINGSINFO: true,
        CONTACTGEGEVENS: true,
        ISACTIEFKLANT: true,
        ISACTIEFLEVERANCIER: true,
        LOGOIMAGE: true,
        SECTOR: true,
        BTWNUMMER: true
      },
    });
  } else {
    bedrijf = await prisma.bedrijf.findUnique({
      where: {
        ID,
      },
    });
  }

  if (!bedrijf) {
    throw ServiceError.notFound(`Er bestaat geen bedrijf met id ${ID}`, { ID });
  }
  //bedrijf.BETALINGSINFO = JSON.parse(bedrijf.BETALINGSINFO);
  return bedrijf;
};

module.exports = {
  getAll,
  getById,
};
