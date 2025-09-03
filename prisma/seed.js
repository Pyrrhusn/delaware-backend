const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const Role = require("../src/core/roles");

async function main() {
  await prisma.bestelling_product.deleteMany({});
  await prisma.bestelling.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.bedrijfverandering.deleteMany({});
  await prisma.leverancier_klant.deleteMany({});
  await prisma.admin.deleteMany({});
  await prisma.klant.deleteMany({});
  await prisma.leverancier.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.bedrijf.deleteMany({});
  await prisma.notificatie.deleteMany({});

  const bedrijfData = [
    {
      ID: 1,
      ACCOUNTSINDS: new Date("2023-11-1"),
      ADRES: "Straat 1, 1000 Brussel br, België",
      BETALINGSINFO: ["FACTUUR", "PAYPAL"],
      BTWNUMMER: "BE0123456789",
      CONTACTGEGEVENS: {
        contactpersoon: "Bedrijf1 Contactpersoon",
        email: "ht5ut3sy@temporary-mail.net",
        telefoon: "+320487484486",
      },
      ISACTIEFKLANT: true,
      ISACTIEFLEVERANCIER: false,
      LOGOIMAGE:
        "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
      NAAM: "Bedrijf1",
      SECTOR: "Sector1",
    },
    {
      ID: 2,
      ACCOUNTSINDS: new Date("2024-1-12"),
      ADRES: "Straat 32, 9000 Gent, België",
      BETALINGSINFO: ["PAYPAL"],
      BTWNUMMER: "BE0555555555",
      CONTACTGEGEVENS: {
        contactpersoon: "Bedrijf2 Contactpersoon",
        email: "info@bedrijf2.com",
        telefoon: "+320487485586",
      },
      ISACTIEFKLANT: false,
      ISACTIEFLEVERANCIER: true,
      LOGOIMAGE:
        "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
      NAAM: "Bedrijf2",
      SECTOR: "Sector2",
    },
  ];

  const userData = [
    {
      ID: 1,
      DTYPE: "Leverancier",
      PASSWORD:
        "$argon2id$v=19$m=65536,t=3,p=4$attxwwyH3FR87fmuTt5deg$C8H5PggsQFsGSmJ19lfCqeD4ICEQSO9hjWUS1FSThj4",
      //PASSWORD: '$argon2id$v=19$m=40960,t=10,p=1$S2NDH5aHcLUkefdDaF/8Ik11FAxuGxVsZ9XTn7rvm38$gybmaatt83GgcYvd8ZFvUHfo2g7FuR96TY73Ov5B+r8'
      USERNAME: "leverancier1",
      BEDRIJF_ID: 1,
    },
    {
      ID: 2,
      DTYPE: "Leverancier",
      PASSWORD:
        "$argon2id$v=19$m=40960,t=10,p=1$gcNSawMTbTWRUFkL0cNf387iAoTq++go0WZHQpeHeZ8$nVKq6S86AZyEmAupraAkw1mIpC0gg1f+hAwbqExUeQA",
      USERNAME: "leverancier2",
      BEDRIJF_ID: 2,
    },
    {
      ID: 3,
      DTYPE: "Klant",
      PASSWORD:
        "$argon2id$v=19$m=40960,t=10,p=1$gb5k1zL7bFsXUKkumPazhpY00ARCy0V/TiAwRMHB4+A$U7FDL4sAVsiW2gLV0nt5rNrhecdWA3caNajJryyRY+0",
      USERNAME: "klant1",
      BEDRIJF_ID: 1,
    },
    {
      ID: 4,
      DTYPE: "Klant",
      PASSWORD:
        "$argon2id$v=19$m=40960,t=10,p=1$lwTWu6F0bhb1m+j6X8L9lT+kQk6sZsitZ1oOdN7eyfc$ym0zs0xmgReH4Maj/nED0Fw16M/fZ1BH4EfLp1If6vE",
      USERNAME: "klant2",
      BEDRIJF_ID: 2,
    },
    {
      ID: 5,
      DTYPE: "Admin",
      PASSWORD:
        "$argon2id$v=19$m=40960,t=10,p=1$BA0nHdCrC6GNisPVxlCeXJ7vVKa5W2yBjY3RjYgLL/A$3oDeFjWe/wHGnoMu9VB14ZNqLZdO/21thH3J/1XQk+I",
      USERNAME: "a1",
      BEDRIJF_ID: null,
    },
    {
      ID: 6,
      DTYPE: "Admin",
      PASSWORD:
        "$argon2id$v=19$m=40960,t=10,p=1$ieSbsyb8R31PVDr69m5s5ubhbLLJZpqyQoL5bfaGgHk$RilUHwNIb7tMCp/pgMME8SpM/gEo8HOQEh1hkAMvrvs",
      USERNAME: "a2",
      BEDRIJF_ID: null,
    },
  ];

  const productData = [
    {
      ID: 1,
      EENHEIDSPRIJS: 800,
      INSTOCK: 10,
      FOTOURL:
        "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
      NAAM: "Laptop",
      LEVERANCIER_ID: 2,
    },
    {
      ID: 2,
      EENHEIDSPRIJS: 400,
      INSTOCK: 15,
      FOTOURL:
        "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
      NAAM: "Tablet",
      LEVERANCIER_ID: 1,
    },
    {
      ID: 3,
      EENHEIDSPRIJS: 600,
      INSTOCK: 20,
      FOTOURL:
        "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
      NAAM: "Smartphone",
      LEVERANCIER_ID: 1,
    },
  ];

  const bestellingData = [
    {
      ID: 1,
      BEDRAG: 4200,
      BETAALDAG: new Date("2024-04-17"),
      BETALINGSSTATUS: "NIETBETAALD",
      DATUMGEPLAATST: new Date("2024-03-17"),
      DATUMLAATSTEBETALINGSHERINNERING: new Date("2024-04-17"),
      HEEFTBETALINGSHERINNERING: true,
      LEVERADRES: "123 Elm St",
      ORDERID: "ORD123",
      ORDERSTATUS: "INBEHANDELING",
      KLANT_ID: 4,
      LEVERANCIER_ID: 1,
    },
    {
      ID: 2,
      BEDRAG: 4000,
      BETAALDAG: new Date("2024-04-20"),
      BETALINGSSTATUS: "BETAALD",
      DATUMGEPLAATST: new Date("2024-03-20"),
      DATUMLAATSTEBETALINGSHERINNERING: new Date("2024-04-20"),
      HEEFTBETALINGSHERINNERING: true,
      LEVERADRES: "456 Pine St",
      ORDERID: "ORD12",
      ORDERSTATUS: "GELEVERD",
      KLANT_ID: 3,
      LEVERANCIER_ID: 2,
    },
    {
      ID: 3,
      BEDRAG: 1200,
      BETAALDAG: new Date("2024-05-22"),
      BETALINGSSTATUS: "BETAALD",
      DATUMGEPLAATST: new Date("2024-04-22"),
      DATUMLAATSTEBETALINGSHERINNERING: null,
      HEEFTBETALINGSHERINNERING: false,
      LEVERADRES: "789 Maple St",
      ORDERID: "ORD124",
      ORDERSTATUS: "VERZONDEN",
      KLANT_ID: 4,
      LEVERANCIER_ID: 1,
    },
    {
      ID: 4,
      BEDRAG: 1200,
      BETAALDAG: new Date("2024-05-03"),
      BETALINGSSTATUS: "NIETBETAALD",
      DATUMGEPLAATST: new Date("2024-04-03"),
      DATUMLAATSTEBETALINGSHERINNERING: null,
      HEEFTBETALINGSHERINNERING: false,
      LEVERADRES: "321 Joske St",
      ORDERID: "ORD125",
      ORDERSTATUS: "GELEVERD",
      KLANT_ID: 4,
      LEVERANCIER_ID: 1,
    },
    {
      ID: 5,
      BEDRAG: 1600,
      BETAALDAG: new Date("2024-04-16"),
      BETALINGSSTATUS: "BETAALD",
      DATUMGEPLAATST: new Date("2024-03-15"),
      DATUMLAATSTEBETALINGSHERINNERING: new Date("2024-04-16"),
      HEEFTBETALINGSHERINNERING: true,
      LEVERADRES: "654 Jef St",
      ORDERID: "ORD13",
      ORDERSTATUS: "GELEVERD",
      KLANT_ID: 3,
      LEVERANCIER_ID: 2,
    },
    {
      ID: 6,
      BEDRAG: 5600,
      BETAALDAG: new Date("2024-04-16"),
      BETALINGSSTATUS: "BETAALD",
      DATUMGEPLAATST: new Date("2024-03-15"),
      DATUMLAATSTEBETALINGSHERINNERING: new Date("2024-04-16"),
      HEEFTBETALINGSHERINNERING: true,
      LEVERADRES: "654 Xander St",
      ORDERID: "ORD14",
      ORDERSTATUS: "INBEHANDELING",
      KLANT_ID: 3,
      LEVERANCIER_ID: 2,
    },
  ];

  const bestellingProductData = [
    {
      ID: 1,
      AANTAL: 5,
      price: 600,
      BESTELLING_ID: 1,
      PRODUCT_ID: 3,
    },
    {
      ID: 2,
      AANTAL: 3,
      price: 400,
      BESTELLING_ID: 1,
      PRODUCT_ID: 2,
    },
    {
      ID: 3,
      AANTAL: 5,
      price: 800,
      BESTELLING_ID: 2,
      PRODUCT_ID: 1,
    },
    {
      ID: 4,
      AANTAL: 3,
      price: 400,
      BESTELLING_ID: 3,
      PRODUCT_ID: 2,
    },
    {
      ID: 5,
      AANTAL: 3,
      price: 400,
      BESTELLING_ID: 4,
      PRODUCT_ID: 2,
    },
    {
      ID: 6,
      AANTAL: 2,
      price: 800,
      BESTELLING_ID: 5,
      PRODUCT_ID: 1,
    },
    {
      ID: 7,
      AANTAL: 7,
      price: 800,
      BESTELLING_ID: 6,
      PRODUCT_ID: 1,
    },
  ];

  const bedrijfveranderingData = [
    {
      ID: 1,
      AANGEVRAAGDOP: new Date("2024-04-21"),
      ACCOUNTSINDS: new Date("2023-11-1"),
      ADRES: "Another Mock Address",
      BETALINGSINFO: ["FACTUUR"],
      CONTACTGEGEVENS: {
        contactpersoon: "Bedrijf1 Contactpersoon",
        email: "ht5ut3sy@temporary-mail.net",
        telefoon: "+3212345678901",
      },
      ISACTIEFKLANT: false,
      ISACTIEFLEVERANCIER: true,
      ISAFGEKEURD: false,
      ISGOEDGEKEURD: false,
      LOGOIMAGE:
        "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
      SECTOR: "Another mock sector",
      AANGEVRAAGDDOOR_ID: 1,
      BEDRIJF_ID: 1,
    },
    {
      ID: 2,
      AANGEVRAAGDOP: new Date("2024-04-22"),
      ACCOUNTSINDS: new Date("2024-1-12"),
      ADRES: "Mockstraat 1, 1000 Haasdonk België",
      BETALINGSINFO: ["FACTUUR"],
      CONTACTGEGEVENS: {
        contactpersoon: "Bedrijf2 Contactpersoon",
        email: "info@bedrijf2.com",
        telefoon: "+3212363278923",
      },
      ISACTIEFKLANT: true,
      ISACTIEFLEVERANCIER: false,
      ISAFGEKEURD: false,
      ISGOEDGEKEURD: false,
      LOGOIMAGE:
        "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
      SECTOR: "Mock sector",
      AANGEVRAAGDDOOR_ID: 4,
      BEDRIJF_ID: 2,
    },
  ];

  const notificatiesData = [
    {
      ID: 1,
      ORDER_ID: 6,
      USER_ID: 3,
      TEXT: 'U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'NIEUW',
      DATUM: new Date("2024-05-02T15:00:00.000Z"),
    },
    {
      ID: 2,
      ORDER_ID: 1,
      USER_ID: 1,
      TEXT: 'Betaling van de klant voor bestelling is ontvangen.',
      TYPE: 'BETALINGONTVANGEN',
      STATUS: 'ONGELEZEN',
      DATUM: new Date("2024-05-01T08:15:00.000Z"),
    },
    {
      ID: 3,
      ORDER_ID: 3,
      USER_ID: 1,
      TEXT: 'Alle producten voor bestelling zijn in voorraad en kunnen worden verzonden.',
      TYPE: 'ORDERVERZENDBAAR',
      STATUS: 'GELEZEN',
      DATUM: new Date("2024-05-01T11:30:00.000Z"),
    },
    {
      ID: 4,
      ORDER_ID: 2,
      USER_ID: 3,
      TEXT: 'DRINGEND! U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'GELEZEN',
      DATUM: new Date("2022-01-01T18:30:00.000Z"),
    },
    {
      ID: 5,
      ORDER_ID: 5,
      USER_ID: 3,
      TEXT: 'U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'NIEUW',
      DATUM: new Date("2024-05-04T09:45:00.000Z"),
    },
    {
      ID: 6,
      ORDER_ID: 5,
      USER_ID: 3,
      TEXT: 'U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'ONGELEZEN',
      DATUM: new Date("2024-05-04T12:00:00.000Z"),
    },
    {
      ID: 7,
      ORDER_ID: 5,
      USER_ID: 3,
      TEXT: 'U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'ONGELEZEN',
      DATUM: new Date("2025-05-04T19:45:00.000Z"),
    },
    {
      ID: 8,
      ORDER_ID: 5,
      USER_ID: 3,
      TEXT: 'U heeft een betalingsverzoek ontvangen.',
      TYPE: 'BETALINGSVERZOEK',
      STATUS: 'NIEUW',
      DATUM: new Date("2024-05-04T08:07:00.000Z"),
    },
  ];

  await prisma.bedrijf.createMany({
    data: bedrijfData,
  });

  await prisma.user.createMany({
    data: userData,
  });
  await prisma.leverancier.createMany({
    data: [
      {
        ID: 1,
      },
      { ID: 2 },
    ],
  });
  await prisma.klant.createMany({
    data: [
      {
        ID: 3,
      },
      { ID: 4 },
    ],
  });
  await prisma.admin.createMany({
    data: [
      {
        ID: 5,
      },
      { ID: 6 },
    ],
  });
  await prisma.leverancier_klant.createMany({
    data: [
      {
        Leverancier_ID: 1,
        klanten_ID: 4,
      },
      { Leverancier_ID: 2, klanten_ID: 3 },
    ],
  });

  await prisma.product.createMany({
    data: productData,
  });

  await prisma.bestelling.createMany({
    data: bestellingData,
  });

  await prisma.bestelling_product.createMany({
    data: bestellingProductData,
  });

  await prisma.bedrijfverandering.createMany({
    data: bedrijfveranderingData,
  });

  await prisma.notificatie.createMany({
    data: notificatiesData,
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
