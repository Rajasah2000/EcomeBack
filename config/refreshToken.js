const jwt = require('jsonwebtoken');

const createRefreshToken = (id) => {
    return jwt.sign({id} , "mysecret" , {expiresIn: "3d"})
}

module.exports = createRefreshToken;
