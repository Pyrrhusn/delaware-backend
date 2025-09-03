const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

describe("Notificaties", () => {
  let request;
  let authHeader;

  withServer(({ supertest }) => {
    request = supertest;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/notificaties";
  describe("GET /api/notificaties", () => {
    it("zou 200 en return alle notificaties", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);

      expect(response.body.items.length).toBe(2);
      expect(response.body.items[0]).toEqual({
        ID: 2,
        ORDER_ID: 1,
        USER_ID: 1,
        TEXT: "Betaling van de klant voor bestelling is ontvangen.",
        TYPE: "BETALINGONTVANGEN",
        STATUS: "ONGELEZEN",
        DATUM: "2024-05-01T00:00:00.000Z",
        bestelling: {
          ORDERID: "ORD123",
        },
      });

      expect(response.body.items[1]).toEqual({
        ID: 3,
        ORDER_ID: 3,
        USER_ID: 1,
        TEXT: "Alle producten voor bestelling zijn in voorraad en kunnen worden verzonden.",
        TYPE: "ORDERVERZENDBAAR",
        STATUS: "GELEZEN",
        DATUM: "2024-05-01T00:00:00.000Z",
        bestelling: {
          ORDERID: "ORD124",
        },
      });
    });
  });
  describe("POST /api/notificaties", () => {
    it("zou nieuwe notificatie moeten maken", async () => {
      const notificationData = {
        ORDER_ID: 1,
        USER_ID: 1,
        TEXT: "Test notification",
        TYPE: "BETALINGSVERZOEK",
        STATUS: "NIEUW",
        DATUM: "2024-05-01T00:00:00.000Z",
      };

      const response = await request
        .post(`${url}`)
        .send({
          ORDER_ID: 1,
          USER_ID: 1,
          TEXT: "Test notification",
          TYPE: "BETALINGSVERZOEK",
          STATUS: "NIEUW",
          DATUM: "2024-05-01T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject(notificationData);
    });

    it("zou 400 returnen wanneer required ID niet gegeven", async () => {
      const response = await request
        .post(url)
        .send({
          ORDER_ID: 6,
          TEXT: "Test notification",
          TYPE: "BETALINGSVERZOEK",
          STATUS: "NIEUW",
          DATUM: "2024-05-01T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("USER_ID");
    });

    it("zou 400 returnen wanneer required STATUS niet gegeven", async () => {
      const response = await request
        .post(url)
        .send({
          ORDER_ID: 6,
          USER_ID: 1,
          TEXT: "Test notification",
          TYPE: "BETALINGSVERZOEK",
          DATUM: "2024-05-01T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("STATUS");
    });

    it("zou 400 returnen wanneer required TYPE niet gegeven", async () => {
      const response = await request
        .post(url)
        .send({
          ORDER_ID: 6,
          USER_ID: 1,
          TEXT: "Test notification",
          STATUS: "NIEUW",
          DATUM: "2024-05-01T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("TYPE");
    });

    testAuthHeader(() => request.post(url));
  });

  it("zou 400 returnen als ongeldig type gegeven", async () => {
    const response = await request
      .post(url)
      .send({
        ORDER_ID: 6,
        USER_ID: 3,
        TEXT: "Test notification",
        TYPE: "ONBESTAANDE-TYPE",
        STATUS: "NIEUW",
        DATUM: new Date("2024-05-05").toISOString(),
      })
      .set("Authorization", authHeader);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("VALIDATION_FAILED");
    expect(response.body.details.body).toHaveProperty("TYPE");
  });
  it("zou 400 returnen als ongeldig status meegegeven", async () => {
    const response = await request
      .post(url)
      .send({
        ORDER_ID: 6,
        USER_ID: 3,
        TEXT: "Test notification",
        TYPE: "BETALINGSVERZOEK",
        STATUS: "ONBESTAANDE-STATUS",
        DATUM: new Date("2024-05-05").toISOString(),
      })
      .set("Authorization", authHeader);

    expect(response.statusCode).toBe(400);
    expect(response.body.code).toBe("VALIDATION_FAILED");
    expect(response.body.details.body).toHaveProperty("STATUS");
  });

  describe("PUT /notificaties/:id", () => {
    it("zou 200 en  notificatie updaten ", async () => {
      const notificationId = 2;
      const response = await request
        .put(`${url}/${notificationId}`)
        .send({
          ORDER_ID: 1,
          USER_ID: 1,
          TEXT: "Updated notification",
          TYPE: "BETALINGONTVANGEN",
          STATUS: "NIEUW",
          DATUM: "2024-05-05T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.status).toBe(200);
      expect(response.body.ORDER_ID).toBe(1);
      expect(response.body.USER_ID).toBe(1);
      console.log(response.body);
      expect(response.body.TEXT).toBe("Updated notification");
    });

    it("should  400 when required fields are missing", async () => {
      const notificationId = 2;
      const response = await request
        .put(`${url}/${notificationId}`)
        .send({
          ORDER_ID: 6,
          TEXT: "Updated notification",
          TYPE: "BETALINGSVERZOEK",
          STATUS: "GELEZEN",
          DATUM: new Date("2024-05-05").toISOString(),
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
      expect(response.body.details.body).toHaveProperty("USER_ID");
    });

    it("zou 400 returnen wanneer ongeldig type", async () => {
      const notificationId = 2;
      const response = await request
        .put(`${url}/${notificationId}`)
        .send({
          ORDER_ID: 6,
          USER_ID: 3,
          TEXT: "Updated notification",
          TYPE: "BETALINGSONTVANGEN",
          STATUS: "ONGELDIG",
          DATUM: "2024-05-05T00:00:00.000Z",
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe("VALIDATION_FAILED");
    });

    it("should return 404 when trying to update a non-existing notification", async () => {
      const notificationId = 9999;
      const response = await request
        .put(`${url}/${notificationId}`)
        .send({
          ORDER_ID: 6,
          USER_ID: 3,
          TEXT: "Updated notification",
          TYPE: "BETALINGSVERZOEK",
          STATUS: "GELEZEN",
          DATUM: new Date("2024-05-05").toISOString(),
        })
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(404);
      expect(response.body.code).toBe("NOT_FOUND");
      expect(response.body.message).toBe(
        "Er bestaat geen notificatie met id 9999"
      );
    });
  });
});
