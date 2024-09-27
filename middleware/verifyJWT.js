const jwt = require('jsonwebtoken');
require('dotenv').config();
//[1] create a middleware verifyJWT
const verifyJWT = (req, res, next) => {
    //[2] Let's define authHeader
    const authHeader = req.headers['authorization'];
    //[3] check if there authHeader
    if (!authHeader) return res.sendStatus(401);// unauthorized;
    //[4] log authHeader to the console
    console.log(authHeader);// this will be like => Barer token
    //[5] so now we need to get the token part only from the authHeader
    const token = authHeader.split(' ')[1]; // token is at [1] 
    /*[6] now we can say jwt.verify() which again has 3 things => 1. token
                                                                  2. SECRET
                                                                  3. a callback function with err and token as placeholder or parameters (err, token) we can aslo say (err, decoded) */
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); // forbidden;
            req.user = decoded.username;
            next();
        }
    )
}

module.exports = verifyJWT;















