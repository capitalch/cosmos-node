"use strict";
const config = require('./config.json');
const port = process.env.PORT || config.common.port;
var messages = {
    errUrlNotFound: 'Url not found',
    errDevError: 'Development error',
    errProdError: 'Production error',
    errUnknown: 'Unknown error',
    errInternalServerError: 'Internal server error',
    messUrlNotFoundDetails: 'The url you are referring is not found',
    messFeaturesLoaded: 'Features are loaded successfully',
    messServerRunningAtPort: `Server is running at port: ${port}`,
    messMailSuccess: `Mail is sent successfully`,
    messMailFail: `There was error in sending the mail`,
    messSuccess: `Operation was done successfully`,
    messFail: `Operation was failed`
};
module.exports = messages;