const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleRefreshToken = (req, res) => {
    //[1] now we are looking for cookies not { user, pwd }
    const cookies = req.cookies;
    //[2] check for cookies and jwt (remember jwt is nested in cookies we need check this using the optional chaining operator)
    if (!cookies?.jwt) return res.sendStatus(401); // unathorized!
    //[3] if we are in this step mean we do have a cookies.jwt
    console.log(cookies.jwt);
    //👇👇👇remember we sent httpOnly cookie named 'jwt' with refreshToken in our authController.js ==>> res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000}); 
    const refreshToken = cookies.jwt;
    //[4] find user with refreshToken 
    // ****here we are comparing the refreshToken in database to the refreshToken coming from the http request****
    const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken);
    //[5] if there is no foundUser then make it forbidden!
    if (!foundUser) return res.sendStatus(403); // forbidden!
    //[6] if we are in this step mean we do have foundUser
    // so let's use verify
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //👇👇👇remember we also passed in the payload object in our authController.js ===>>> username object ===>>> {"username":foundUser.username} 
            if (err || foundUser.username !== decoded.username ) res.sendStatus(403);//we know we had username embedded with refreshToken // forbidden!
            //[7] if we are in this step means everything is good so now we can provide the new accessToken
            const accessToken = jwt.sign(
                { "username": decoded.username },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '60s'}
            )
            //[8] once we have the accessToken we need to send it
            res.json({ accessToken });
        }
    )
}

module.exports = { handleRefreshToken };










