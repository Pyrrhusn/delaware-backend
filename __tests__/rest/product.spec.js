const { withServer, login, loginAdmin } = require('../supertest.setup');
const { testAuthHeader } = require('../common/auth');

describe("Producten", () => {
    let request;
    let authHeader;

    withServer(({
        supertest,

    }) => {
        request = supertest;

    });

    beforeAll(async () => {
        authHeader = await login(request);
    });

    const url = "/api/producten";

    describe('GET /api/producten', () => {

        it('zou 200 en alle producten teruggeven', async () => {
            const response = await request.get(`${url}?paginaNummer=1&search=&aantal=3`).set("Authorization", authHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(3);

            expect(response.body.items[0]).toEqual({
                ID: 1,
                EENHEIDSPRIJS: 800,
                INSTOCK: 10,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop",
                LEVERANCIER_ID: 2
            })
            expect(response.body.items[1]).toEqual({
                ID: 2,
                EENHEIDSPRIJS: 400,
                INSTOCK: 15,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Tablet",
                LEVERANCIER_ID: 1
            })
            expect(response.body.items[2]).toEqual({
                ID: 3,
                EENHEIDSPRIJS: 600,
                INSTOCK: 20,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Smartphone",
                LEVERANCIER_ID: 1
            })
        });
        it('zou 400 wanneer een argument meegegeven', async () => {
            const response = await request.get(`${url}?paginaNummer=1&search=&aantal=3&invalid=true`).set("Authorization", authHeader);

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
        });
    });

    //testAuthHeader(() => request.get(url));

    describe("GET /api/producten/:id", () => {

        it("zou 200 en het product moeten geven", async () => {
            const response = await request.get(`${url}/1`).set("Authorization", authHeader);

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
                ID: 1,
                EENHEIDSPRIJS: 800,
                INSTOCK: 10,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop",
                LEVERANCIER_ID: 2
            })
        })

        it('zou 404 bij aanvragen onbestaand product', async () => {
            const response = await request.get(`${url}/48`).set("Authorization", authHeader);

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'Er bestaat geen product met id 48',
                details: {
                    ID: 48,
                },
            });
            expect(response.body.stack).toBeTruthy();
        });

        it('zou 400 bij ongeldig product id', async () => {
            const response = await request.get(`${url}/invalid`).set("Authorization", authHeader);

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.params).toHaveProperty('id');
        });
    });

    //testAuthHeader(() => request.get(`${url}/1`));

    describe('GET /api/producten/:id/users', () => {

        it('zou 200 en alle producten voor juiste gebruikerid teruggeven', async () => {
            const response = await request.get(`${url}/2/users`).set('Authorization', authHeader);
            expect(response.status).toBe(200);
            expect(response.body.items.length).toBe(1);

            expect(response.body.items[0]).toEqual({
                ID: 1,
                EENHEIDSPRIJS: 800,
                INSTOCK: 10,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop",
                LEVERANCIER_ID: 2
            })

        });
        it('zou 400 moeten geven wanneer een argument wordt doorgegeven', async () => {
            const response = await request.get(`${url}/1/users?invalid=true`).set('Authorization', authHeader);

            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.query).toHaveProperty('invalid');
        });
        //testAuthHeader(() => request.get(url));
    });


    describe("PUT /api/producten/:id", () => {
        it("zou 200 en bijgewerkt product retourneren", async () => {
            authHeader = await login(request);
            const response = await request.put(`${url}/1`).send({
                EENHEIDSPRIJS: 850,
                INSTOCK: 5,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop"
            }).set("Authorization", authHeader);

            expect(response.statusCode).toBe(200);
            expect(response.body.ID).toBeTruthy();
            expect(response.body.EENHEIDSPRIJS).toBe(850);
            expect(response.body.INSTOCK).toBe(5);
            expect(response.body.FOTOURL).toBe("https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440");
            expect(response.body.NAAM).toBe("Laptop");
            expect(response.body.LEVERANCIER_ID).toBe(2);
        });

        it('zou 404 wanneer bij te werken product niet bestaat', async () => {
            const response = await request.put(`${url}/40`)
                .send({
                    EENHEIDSPRIJS: 850,
                    INSTOCK: 5,
                    FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                    NAAM: "Laptop",
                }).set("Authorization", authHeader);

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchObject({
                code: 'NOT_FOUND',
                message: 'Er bestaat geen product met id 40',
                details: {
                    ID: 40,
                },
            });
            expect(response.body.stack).toBeTruthy();
        });

        it("zou 400 wanneer prijs ontbreekt", async () => {
            const response = await request.put(`${url}/1`).send({
                INSTOCK: 5,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop",
            }).set("Authorization", authHeader);
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('EENHEIDSPRIJS');
        });

        it("zou 400 wanneer instock ontbreekt", async () => {
            const response = await request.put(`${url}/1`).send({
                EENHEIDSPRIJS: 850,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
                NAAM: "Laptop",
            }).set("Authorization", authHeader);
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('INSTOCK');
        });

        it("zou 400 wanneer foto ontbreekt", async () => {
            const response = await request.put(`${url}/1`).send({
                EENHEIDSPRIJS: 850,
                INSTOCK: 5,
                NAAM: "Laptop",
            }).set("Authorization", authHeader);
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('FOTOURL');
        });

        it("zou 400 wanneer naam ontbreekt", async () => {
            const response = await request.put(`${url}/1`).send({
                EENHEIDSPRIJS: 850,
                INSTOCK: 5,
                FOTOURL: "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/PDP-Highlight-Consumer-Laptop-Go-3-Platinum-001:VP1-539x440",
            }).set("Authorization", authHeader);
            expect(response.statusCode).toBe(400);
            expect(response.body.code).toBe('VALIDATION_FAILED');
            expect(response.body.details.body).toHaveProperty('NAAM');
        });

    });

    testAuthHeader(() => request.put(`${url}/1`));

})