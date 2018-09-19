
function authenticate(req, res, next) {
    console.log('Doing authentication');
    res.locals.message = 'This is test authentication error';
    next('Authentication error');
}

module.exports = authenticate;