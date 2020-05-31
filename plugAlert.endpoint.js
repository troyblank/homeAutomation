const configuration = require('./configuration');
const { invokeLambda } = require('./utils');
const { secret } = configuration;

exports.handler = async (payload) => {
    const { secret: passedSecret } = JSON.parse(payload.body);
    let statusCode = 200;

    if (passedSecret === secret) {
        await invokeLambda('homeAutomation_plugAlert');
    } else {
        statusCode = 401;
    }

    const response = {
        statusCode,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return response;
};
