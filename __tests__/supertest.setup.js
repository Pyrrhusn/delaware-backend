const supertest = require('supertest');
const createServer = require('../src/createServer');

const login = async (supertest) => {

    const response = await supertest.post('/api/users/login').send({
        USERNAME: "leverancier1",
        PASSWORD: "testww1",
    });


    if (response.statusCode !== 200) {
        throw new Error(response.body.message, 'Unknown error occured');
    }

    return `Bearer ${response.body.token}`;
};

const loginAdmin = async (supertest) => {
    const response = await supertest.post('/api/users/login').send({
        USERNAME: 'a1',
        PASSWORD: 'pw1',
    });

    if (response.statusCode !== 200) {
        throw new Error(response.body.message, 'Unknown error occured');
    }

    return `Bearer ${response.body.token}`;
};

const withServer = (setter) => {
    let server;

    beforeAll(async () => {
        server = await createServer();


        setter({

            supertest: supertest(server.getApp().callback()),
        });
    });

    afterAll(async () => {
        await server.stop();
    });
};

module.exports = {
    login,
    loginAdmin,
    withServer,
};