const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3500;

app.use(logger);

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));

app.use(express.json());
//middleware for cookies
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/root')); // I don't wanna protect root 

app.use('/register', require('./routes/register')); // definately not to protect the register we would never be able to register in the first place

app.use('/auth', require('./routes/auth')); // same goes for auth as well
// I need to protect all the routes under employees
// remember these routes act like a waterfall so everything that comes down after app.use(verifyJWT) will be protected 
app.use('/refresh', require('./routes/refresh'));

app.use(verifyJWT);

app.use('/employees', require('./routes/api/employees'));

app.all('/*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ error: '404 not found'});
    } else {
        res.type('txt').send('404 not found');
    }
})

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
})












