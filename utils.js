// MULTI DELAY REQUESTS
const executeCommands = async (request, commands) => {
    const wait = delay => new Promise(resolve => setTimeout(resolve, delay));

    await commands.reduce((promise, action) => {
        return promise.then(function() {
            const delay = action.delay || 0;

            return Promise.all([wait(delay), makeARequest(request, action.command)]);
        })
    }, Promise.resolve())
}

// API REQUEST
const https = require('https');
const configuration = require('./configuration');
const { authToken } = configuration

const makeARequest = (requestOptions, data) => {
    const options = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
        },
        ...requestOptions
    }

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let responseData = '';

            if (res.statusCode < 200 || res.statusCode >= 300) {
                return reject(new Error('statusCode=' + res.statusCode));
            }

            res.on('data', (chunk) => {
                responseData = `${responseData}${chunk}`;
            });

            res.on('end', () => {
                resolve(JSON.parse(responseData));
            });
        });

        req.on('error', (e) => {
            reject(new Error(e));
        });

        if (data) {
            req.write(JSON.stringify(data))
        }

        req.end();
    })
};

// AWS HELPERS
// Be sure to have the lambda inherit a "invokeLambda" custom permissions before using
const aws = require('aws-sdk');
const lambda = new aws.Lambda({ region: 'us-west-2' });

const invokeLambda = (FunctionName) => {
    return new Promise((resolve, reject) => {
        const lambdaParams = {
            FunctionName,
            InvocationType: 'Event'
        }
        
        lambda.invoke(lambdaParams, (error) => {
            if (error) {
                reject(error)
            } else {
                resolve();
            }
        })
    })
}

module.exports = { executeCommands, invokeLambda, makeARequest };