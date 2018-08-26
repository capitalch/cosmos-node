"use strict";
const config = require('./config.json');
const port = process.env.PORT || config.port;
var messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    messUrlNotFoundDetails: 'The url you are referring is not found',
    messFeaturesLoaded: 'Features are loaded successfully',
    messServerRunningAtPort: `Server is running at port: ${port}`
};
module.exports = messages;