module.exports = {
    log: {
        level: 'silly',
        disabled: true,
    },
    cors: {
        origins: ["http://localhost:5173"],
        maxAge: 3 * 60 * 60,
    },
    auth: {
        argon: {
            timeCost: 10, // iterations
            hashLength: 32,
            parallelism: 1,
            memoryCost: 40960,
            saltLength: 32
        },
        jwt: {
            secret: 'eenveeltemoeilijksecretdatniemandooitzalradenandersisdesitegehacked',
            expirationInterval: 60 * 60 * 1000, // ms (1 hour)
            issuer: 'localhost:9000',
            audience: 'localhost:5173',
        },
    },
};

