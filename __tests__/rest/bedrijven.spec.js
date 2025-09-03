const { withServer, login, loginAdmin } = require("../supertest.setup");
const { testAuthHeader } = require("../common/auth");

describe("Bedrijven", () => {
  let request;
  let authHeader;

  withServer(({ supertest }) => {
    request = supertest;
  });

  beforeAll(async () => {
    authHeader = await login(request);
  });

  const url = "/api/bedrijf";

  testAuthHeader(() => request.get(url));

  describe("GET /api/bedrijf?form=false", () => {
    it("zou 200 en het bedrijf moeten geven", async () => {
      const response = await request
        .get(`${url}?form=false`)
        .set("Authorization", authHeader);

      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        ID: 1,
        ACCOUNTSINDS: "2023-10-31T00:00:00.000Z",
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
        ADMIN_ID: null,
      });
    });
  });

  testAuthHeader(() => request.get(`${url}?form=false`));
});
