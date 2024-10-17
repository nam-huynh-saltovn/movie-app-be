const jwt = require("jsonwebtoken");


let generateToken = (user, secretSignature, tokenLife) => {
    return jwt.sign({ id: user.user_id }, secretSignature,
    {
        algorithm: "HS256",
        allowInsecureKeySizes: true,
        expiresIn: tokenLife,
    });
}

module.exports = {
  generateToken: generateToken
};