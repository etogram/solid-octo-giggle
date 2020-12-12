const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser').json()
const cookieParser = require('cookie-parser');

const logger = require('./utils/log').logger;
const initDB = require('./utils/init').initDB;


//express app
const app = express()
const port = 3000

// db initialization
initDB();

//mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/templates');

//bodyparser
app.use(bodyParser) // for parsing application/json

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

//favicon
app.use(favicon(path.join(__dirname, 'public','img', 'favicon.ico')))

//middlewares
app.use(logger);

//routes
//app.use('/system/:name', system);
const mountRoutes = require('./routes')
mountRoutes(app)

//srv
app.listen(port, () => {
  console.log(`app listening at http://localhost:${port}`)
})