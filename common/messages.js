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
    errUncaught: `Uncaught server error. Server is shut down`,
    errMailFail: `There was error in sending the mail`,
    errQueryFalied: (db)=>`Execution of query failed on database ${db}`,
    errQueryFormation: `There was error in formation of query at server. Contact dev team`,
    messUrlNotFoundDetails: 'The url you are referring is not found',
    messFeaturesLoaded: 'Features are loaded successfully',
    messServerRunningAtPort: `Server is running at port: ${port}`,
    messMailSuccess: (to) => `Mail was sent successfully to ${to}`,
    messSuccess: `Operation was done successfully`,
    messShutDown: `System is shutting down`,
    messTearDatabaseConnected: `Tear database connected`,
    messTearApiQuery: 'Tear api queried',
    messNotFound: 'Server has not found the url given by user',
    messQueryExecuted:`database query was successfully executed`
};
module.exports = messages;