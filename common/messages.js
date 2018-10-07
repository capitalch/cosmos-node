"use strict";
const config = require('./config.json');
const port = process.env.PORT || config.common.port;
const messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    errFail: `Operation was failed`,
    errUncaught: `Uncaught exception at server. Server is shutting down`,
    errMailFail: `There was error in sending the mail`,
    errQueryFalied: (db) => `Execution of query failed on database ${db}`,
    errQueryFormation: `There was error in formation of query at server. Contact dev team`,
    errBeforeQueryFormation: `There was error before forming the query. Contact dev`,
    errQueryExecution: (db) => `There was error executing the query in database ${db}`,
    errQuery: `There was error in database query execution`,
    errUserNameOrPasswordNotFound: `User name or password is not found`,
    errAuthentication: `Authentication error`,
    errRegisterUserPwd: `User name and password could not be registered at server`,
    errNoToken:`No authentication token is available with request`,
    messUrlNotFoundDetails: 'The url you are referring is not found',
    messFeaturesLoaded: 'Features are loaded successfully',
    messServerRunningAtPort: `Server is running at port: ${port}`,
    messMailSuccess: (to) => `Mail was sent successfully to ${to}`,
    messSuccess: `Operation was done successfully`,
    messShutDown: `System is shutting down`,
    messTearDatabaseConnected: `Tear database connected`,
    messTearApiQuery: 'Tear api queried',
    messNotFound: 'Server has not found the url given by user',
    messQueryExecuted: `database query was successfully executed`
};
const statusCodes= {
    ok: 200,
    created: 201,
    badRequest:400,
    unAuthorized:401,
    paymentRequired: 402,
    forbidden: 403,
    notFound:404,
    methodNotAllowed:405,
    notAcceptable:406,
    internalServerError: 500,
    serviceUnAvailable: 503,
}
exports.statusCodes = statusCodes;
exports.messages = messages;
// module.exports = messages;