const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const bcrypt = require('bcrypt');



const handleLogin = async(req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd ) {
        res.sendStatus(400).json({"message":"username and password are required!"});
    }
    const foundUser = usersDB.users.find(u => u.username === user);
    if (!foundUser) return res.sendStatus(401); // 401 means unauthorize!
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        res.json({"success":`User${user} is logged in!`});
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };










