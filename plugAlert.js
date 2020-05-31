
// run with node -e 'require("./plugAlert").handler()'
// be sure to set the lambda timeout to 5 mins under "basic settings"
const configuration = require('./configuration');
const { executeCommands } = require('./utils');
const { alertPlugId } = configuration;

const request = {
    hostname: 'api.smartthings.com',
    path: `/v1/devices/${alertPlugId}/commands`,
    method: 'POST'
}

const onCommand = [{ capability: 'switch', command: 'on' }];
const offCommand = [{ capability: 'switch', command: 'off' }];

const wakeUpCommands = [];
const addBlinks = (blinkAmount, delay) => {
    for( let i = 0; i < blinkAmount; i++ ) {
        const command =  i % 2 ? offCommand : onCommand;
    
        wakeUpCommands.push({ command, delay });
    }
}

exports.handler = async () => {
    addBlinks(101, 1001);
    await executeCommands(request, wakeUpCommands);
};