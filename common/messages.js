"use strict";
const config = require('./config.json');
const port = process.env.PORT || config.common.port;
var messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    errFail: `Operation was failed`,
    errUncaught: `Uncaught severe error`,
    errMailFail: `There was error in sending the mail`,
    messUrlNotFoundDetails: 'The url you are referring is not found',
    messFeaturesLoaded: 'Features are loaded successfully',
    messServerRunningAtPort: `Server is running at port: ${port}`,
    messMailSuccess: `Mail was sent successfully`,
    messSuccess: `Operation was done successfully`,
    messShutDown: `System is shutting down`,
    messTearDatabaseConnected: `Tear database connected`,
    messTearApiQuery:'Tear api queried'
};
module.exports = messages;