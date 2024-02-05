const jwt = require('jsonwebtoken');

const createJwtToken = (id) => {
    return jwt.sign({id} , "mysecret" , {expiresIn: "3d"})
}

module.exports = createJwtToken;