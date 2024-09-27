const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logEvents = async(message, logName) => {
    const date = format(new Date(), 'yyyyMMdd\tHH:mm:ss');
    const logData = `${date}\t${uuid()}\t${message}\n`;
    console.log(logData);

    try {
        if (!fs.existsSync(path.join(__dirname, '..','logs'))) {
            fsPromises.mkdir(path.join(__dirname, '..','logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logData);
        
    } catch(err) {
        console.error(err);
    }
}

const logger = (req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
  next();
}

module.exports = { logger, logEvents };




















///////////////////////////////////////////////////////////////////////////////////
/*PS F:\Documents\github\nodejs4-event-emitter> npm init -y
Wrote to F:\Documents\github\nodejs4-event-emitter\package.json:

{
  "name": "nodejs4-event-emitter",
  "version": "1.0.0",
  "description": "",
  "main": "logEvents.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}


PS F:\Documents\github\nodejs4-event-emitter> npm i date-fns

added 1 package, and audited 2 packages in 18s

1 package is looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS F:\Documents\github\nodejs4-event-emitter> npm i uuid

added 1 package, and audited 3 packages in 2s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS F:\Documents\github\nodejs4-event-emitter> npm i nodemon -D

added 29 packages, and audited 32 packages in 2s

6 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
PS F:\Documents\github\nodejs4-event-emitter> 
*/
/////////////////////////////////////////////////////////////////////////////















