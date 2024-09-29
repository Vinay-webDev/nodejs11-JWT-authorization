const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (usersData) {this.users = usersData}
}

const jwt = require('jsonwebtoken');
require('dotenv').config();
const fsPromises = require('fs').promises;
const path = require('path');

const handleLogout = async(req, res) => {
    //we grab the cookie from request
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204); // signal good✅ but NO content;
    //if we are in this step mean we do have a cookiejwt 
    const refreshToken = cookies.jwt;
    const foundUser = usersDB.users.find(u => u.refreshToken === refreshToken);
    //[2] now we need to check for the foundUser if there is no foundUser then that's ok 
    // first we need to clearCookie 👉👉remember we do need to have the same {option value} properties when we had while setting the cookie👈👈
    //===>>> remember we had it like ==>> res.cookie('jwt', refreshToken, {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    // then we need to sendStatus(204);
    if (!foundUser) {
        res.clearCookie('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
        res.sendStatus(204); //NO content;
    }
    //[3] if we get the foundUser then we need to get the other users except foundUser
    const otherUsers = usersDB.users.filter(u => u.refreshToken !== refreshToken);
    //[4] if we are in this step mean we do have a foundUser now we need to grab the currenct user that the user with refreshToken comin in 
    // and we need to set that refreshToken to an empty string '';
    const currentUser = {...foundUser, refreshToken: '' }
    //[5] now we need to combine the otherUsers and currentUser and set that to our database
    usersDB.setUsers([...otherUsers, currentUser]);
    //[6] and now! we need to write it in the file
    await fsPromises.writeFile(
        path.join(__dirname, '..', 'model', 'users.json'),
        JSON.stringify(usersDB.users)
    )
    //[7] clearCookie
    res.clearCookie('jwt', {httpOnly: true, maxAge: 24 * 60 * 60 * 1000});
    res.sendStatus(204); // NO content
} 

module.exports = { handleLogout }



















