const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogin = async(req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd ) {
        res.sendStatus(400).json({"message":"username and password are required!"});
    }
    const foundUser = usersDB.users.find(u => u.username === user);
    if (!foundUser) return res.sendStatus(401); // 401 means unauthorize!
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        //create JWTs here
        /*[1] jwt.sign() => this method has 3 things => 1. payload
                                                        2. SECRET
                                                        3. options value (this have the validation duration => expire duration);
        */
       // for the payload don't pass in password object which always insecur try load the username object
        const accessToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '60s'}
        )        
        const refreshToken = jwt.sign(
            { 'username': foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d'}
        )    
        // 👇👇👇Saving user with refresh token👇👇👇
        //[2] now we need to add refresh token to our database
        //1. =>to do that first let's grab the other users (which is an array of users except foundUser);
        const otherUsers = usersDB.users.filter( u => u.username !== foundUser.username);
        //2. => Let's try to have or attach refreshToken to our foundUser let's call this as currentUser
        const currentUser = {...foundUser, refreshToken};
        //3. => now I need to combine currentUser and otherUsers we can do that with the setter function or updater function
        usersDB.setUsers([...otherUsers, currentUser]); // now we have json data with refresh token 
        //4. => now we need to write json file
        await fsPromises.writeFile(
            path.join(__dirname, '..', 'model', 'users.json'),
            JSON.stringify(usersDB.users)
        )
        //6. => so the thing is the cookies are vulnerable and they accessed via javascript so we don't send in just cookies but we know cookie with httpOnly is not accessed via javascript so can do that 
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

        //5. => let's send back the accessToken the client 
        res.json({ accessToken });
        //res.json({success: `User${user} is logged in!`});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };










