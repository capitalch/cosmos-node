"use strict";
var messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    errExecution:'Execution error',
    errInvalidToken:'Invalid token error',
    errReqParams:'Request parameters are not in proper format',
    errType:'Request body must contain type parameter. Type can be "web" or "sql"',
    errInvalidAddress:'Invalid address',
    errOptions:'In POST request options object is not present in request body',
    errNoTokenProvided:'Token is not provided with request',
    messServerRunning:'Server is running',
    messUrlNotFoundDetails:'The url you are refering is not found',
    messProvideToken:'Provide an authentication token with every request'

};
module.exports = messages;
