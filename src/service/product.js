const { PrismaClient } = require("@prisma/client");

const ServiceError = require("../core/serviceError");

const handleDBError = require("./_handleDBError");

const prisma = new PrismaClient();

const getAll = async ({ paginaNummer, search, aantal }) => {
  let whereClause = {};

  if (search && search.trim() !== "") {
    whereClause = {
      NAAM: {
        contains: search.trim(),
      },
    };
  }

  const producten = await prisma.product.findMany({
    skip: (paginaNummer - 1) * aantal,
    take: aantal,
    where: whereClause,
  });

  const productCount = await prisma.product.count({
    where: whereClause,
  });

  return { items: producten, totaalBeschikbaar: productCount };
};

const getById = async (ID) => {
  const product = await prisma.product.findUnique({
    where: {
      ID,
    },
  });
  if (!product) {
    throw ServiceError.notFound(`Er bestaat geen product met id ${ID}`, { ID });
  }
  return product;
};

const getAllByVerkoperId = async (LEVERANCIER_ID) => {
  try {
    const producten = await prisma.product.findMany({
      where: {
        LEVERANCIER_ID,
      },
    });
    return { items: producten };
  } catch (error) {
    throw handleDBError(error);
  }
};

const updateById = async (ID, { EENHEIDSPRIJS, FOTOURL, INSTOCK, NAAM }) => {

  const existingProduct = await getById(ID);

  if (!existingProduct) {
    throw ServiceError.notFound(`Er bestaat geen product met id ${ID}`);
  }

  try {
    await prisma.product.update({
      where: {
        ID,
      },
      data: {
        EENHEIDSPRIJS,
        FOTOURL,
        INSTOCK,
        NAAM,
      },
    });

    return getById(ID);
  } catch (error) {
    throw handleDBError(error);
  }
};


module.exports = {
  getAll,
  getById,
  getAllByVerkoperId,
  updateById,
};
