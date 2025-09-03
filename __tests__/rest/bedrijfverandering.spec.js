const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

describe("Bedrijfveranderingen", () => {
  let request;
  let authHeader;

  withServer(({ supertest }) => {
    request = supertest;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/bedrijfveranderingen";

  describe("GET /api/bedrijfveranderingen", () => {
    it("zou 200 en alle bedrijfveranderingen moeten geven", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.items.length).toBe(1);

      expect(response.body.items[0]).toEqual({
        ID: 1,
        AANGEVRAAGDOP: "2024-04-21T00:00:00.000Z",
        ACCOUNTSINDS: "2023-10-31T00:00:00.000Z",
        ADRES: "Another Mock Address",
        BETALINGSINFO: ["FACTUUR"],
        CONTACTGEGEVENS: {
          email: "ht5ut3sy@temporary-mail.net",
          telefoon: "+3212345678901",
          contactpersoon: "Bedrijf1 Contactpersoon",
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
      });
    });

    it("zou 400 geven wanneer een argument meegegevens", async () => {
      const response = await request
        .get(`${url}?invalid=true`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.query).toHaveProperty("invalid");
    });
  });

  testAuthHeader(() => request.get(url));

  describe("GET /api/bedrijfveranderingen/:id", () => {
    it("zou 200 en de bedrijfverandering geven", async () => {
      const response = await request
        .get(`${url}/1`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        ID: 1,
        AANGEVRAAGDOP: "2024-04-21T00:00:00.000Z",
        ACCOUNTSINDS: "2023-10-31T00:00:00.000Z",
        ADRES: "Another Mock Address",
        BETALINGSINFO: ["FACTUUR"],
        CONTACTGEGEVENS: {
          email: "ht5ut3sy@temporary-mail.net",
          telefoon: "+3212345678901",
          contactpersoon: "Bedrijf1 Contactpersoon",
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
      });
    });

    it("zou 404 geven wanneer een bedrijfverandering niet bestaat", async () => {
      const response = await request
        .get(`${url}/500`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: "NOT_FOUND",
        message: "Er bestaat geen bedrijfverandering met id 500",
        details: {
          ID: 500,
        },
      });
      expect(response.body.stack).toBeTruthy();
    });

    it("zou 400 geven met ongeldig id", async () => {
      const response = await request
        .get(`${url}/invalid`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.params).toHaveProperty("id");
    });
  });

  testAuthHeader(() => request.get(`${url}/1`));

  describe("POST /api/bedrijfveranderingen", () => {
    it("zou 201 en gemaakte bedrijfverandering moeten geven", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: "2024-04-24T00:00:00.000Z",
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: "true",
          ISACTIEFLEVERANCIER: "true",
          ISAFGEKEURD: "false",
          ISGOEDGEKEURD: "false",
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);

      expect(response.status).toBe(201);
      expect(response.body.ACCOUNTSINDS).toBe("2024-04-24T00:00:00.000Z");
      expect(response.body.ADRES).toBe("Mockdreef 12, 9031 Drongen België");
      expect(response.body.BETALINGSINFO.toString()).toBe(
        ["Overschrijving"].toString()
      );
      expect(response.body.CONTACTGEGEVENS).toStrictEqual({
        contactpersoon: "Bedrijf1 Contactpersoon",
        email: "bedrijf1@info.com",
        telefoon: "+3212345678901",
      });
      expect(response.body.ISACTIEFKLANT).toBe(true);
      expect(response.body.ISACTIEFLEVERANCIER).toBe(true);
      expect(response.body.ISAFGEKEURD).toBe(false);
      expect(response.body.ISGOEDGEKEURD).toBe(false);
      expect(response.body.LOGOIMAGE).toBe(
        "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png"
      );
      expect(response.body.SECTOR).toBe("Another mock sector");
      expect(response.body.AANGEVRAAGDDOOR_ID).toBe(1);
      expect(response.body.BEDRIJF_ID).toBe(1);
    });

    it("zou 400 wanneer accountsinds ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ACCOUNTSINDS");
    });

    it("zou 400 wanneer adres ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ADRES");
    });

    it("zou 400 wanneer betalingsinfo ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("BETALINGSINFO");
    });

    it("zou 400 wanneer contactgegevens ontbreken", async () => {
      const response = await request
        .post(url)
        .send({
          ID: 3,
          AANGEVRAAGDOP: new Date("2024-04-24"),
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
          AANGEVRAAGDDOOR_ID: 1,
          BEDRIJF_ID: 1,
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("CONTACTGEGEVENS");
    });

    it("zou 400 wanneer isactiefklant ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ISACTIEFKLANT");
    });

    it("zou 400 wanneer isactiefleverancier ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ISACTIEFLEVERANCIER");
    });

    it("zou 400 wanneer isafgekeurd ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ISAFGEKEURD");
    });

    it("zou 400 wanneer isgoedgekeurd ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("ISGOEDGEKEURD");
    });

    it("zou 400 wanneer logo ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          SECTOR: "Another mock sector",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("LOGOIMAGE");
    });

    it("zou 400 wanneer sector ontbreekt", async () => {
      const response = await request
        .post(url)
        .send({
          ACCOUNTSINDS: new Date("2023-11-1"),
          ADRES: "Mockdreef 12, 9031 Drongen België",
          BETALINGSINFO: ["Overschrijving"],
          CONTACTGEGEVENS: {
            contactpersoon: "Bedrijf1 Contactpersoon",
            email: "bedrijf1@info.com",
            telefoon: "+3212345678901",
          },
          ISACTIEFKLANT: true,
          ISACTIEFLEVERANCIER: true,
          ISAFGEKEURD: false,
          ISGOEDGEKEURD: false,
          LOGOIMAGE:
            "https://cdn.pixabay.com/photo/2014/06/03/19/38/road-sign-361514_960_720.png",
        })
        .set("Authorization", authHeader);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("SECTOR");
    });
  });

  testAuthHeader(() => request.post(url));
});
