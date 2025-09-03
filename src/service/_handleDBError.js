const ServiceError = require('../core/serviceError');

const handleDBError = (error) => {
    const { code = '', message } = error;


    if (code.startsWith('P2025')) {
        if (message.includes('Foreign key constraint failed on the field: (`product`.`ID`)')) {
            return ServiceError.notFound('Er bestaat geen product met dit id');
        }

    }

    if (code.startsWith('P2025')) {
        if (message.includes('Foreign key constraint failed on the field: (`bedrijfverandering`.`AANGEVRAAGDDOOR_ID`)')) {
            return ServiceError.notFound('Er bestaat geen gebruiker met dit id');
        }
    }

    if (code.startsWith('P2025')) {
        if (message.includes('Foreign key constraint failed on the field: (`bedrijfverandering`.`BEDRIJF_ID`)')) {
            return ServiceError.notFound('Er bestaat geen bedrijf met dit id');
        }

    }

    return error;
};

module.exports = handleDBError;
