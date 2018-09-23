
const login = {};

login.authenticate = (req,res,next) =>{
    const auth = req.body.auth;
    const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase');
    // console.log(decrypted.toString(crypto.enc.Utf8));
    res.json('ok');
};

login.register = (req,res,next) =>{
    const auth = req.body.auth;
    const decrypted = crypto.AES.decrypt(auth, 'Secret Passphrase');

}

module.exports = login;