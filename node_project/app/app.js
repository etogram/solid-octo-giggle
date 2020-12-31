const Sentry = require("@sentry/node");
// or use es6 import statements
// import * as Sentry from '@sentry/node';

const Tracing = require("@sentry/tracing");
// or use es6 import statements
// import * as Tracing from '@sentry/tracing';

const express = require('express')
const favicon = require('serve-favicon')
const path = require('path')
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser')
const helmet = require('helmet');

const initDB = require('./utils/init').initDB;

const logger = require('./utils/logger').logger


//express app
const app = express()
const port = 3000

//sentry

Sentry.init({
  dsn: "https://927a995e46d54904a006f03bb96aee77@o145223.ingest.sentry.io/5564130",
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({ 
      // to trace all requests to the default router
      app, 
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter, 
    }),
  ],

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());
// the rest of your app
app.use(Sentry.Handlers.errorHandler());

//morgan
var winston = require('./utils/logger');

var morgan = require('morgan');
app.use(morgan('combined', { stream: winston.stream }));
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // add this line to include winston logging
  winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//socket
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
  },
  cookie: true
});;

const autocomplete = require('./ioevents/autocomplete').autocomplete;
const getResults = require('./ioevents/find').getResults;

const materialsOpt = require('./ioevents/sql/syntax').materialsOpt;

 

io.use((socket, next) => {
  console.log('in socket')
  console.log(socket.handshake.headers['x-sessionid'])
  console.log(socket.handshake.headers['x-token'])

var sessionId = socket.handshake.headers['x-sessionid'];
var token = socket.handshake.headers['x-token'];

socket.sessionId = sessionId;

var tokenDecoded = jwt.verify(token, 'secret');
console.log('tokenDecoded')
console.log(tokenDecoded)
console.log('tokenDecoded.sessionId')
console.log(tokenDecoded.sessionId)
console.log('decoded.sessionId==sessionId')
console.log(tokenDecoded.sessionId==sessionId)

var isValid =  (tokenDecoded.sessionId==sessionId)
  if (isValid) {
    return next();
  }
  return next(new Error('authentication error'));

});

io.on('connection',async (socket) => {
  logger.info('a user connected');
    socket.emit('greetings','hello, this is the session '+socket.sessionId)

    socket.on('init',async function(msg,callback){
        try{
            var message = {"materials":materialsOpt}
            callback(null,message)            
        }catch(error){
            callback(error,null)            
        }
    });

    socket.on('autocomplete',async function(msg,callback){
        try{
            var message = await autocomplete(msg.data,msg.opt)
            callback(null,message)            
        }catch(error){
            callback(error,null)            
        }
    });

    socket.on('find',async function(msg,callback){
        try{
            var message = await getResults(msg)
            callback(null,message)            
        }catch(error){
            callback(error,null)            
        }
    });

    socket.on('disconnect', () => {
        logger.info('user disconnected');
    });
});



//favicon
//app.use(favicon(path.join(__dirname, 'frontend','dist', 'favicon.ico')))
//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));

//helmet
//app.use(helmet());
app.disable('x-powered-by');

//cors
const cors = require('cors');
var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
//mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/frontend/dist');


// parse cookies
// we need this because "cookie" is true in csrfProtection


//routes
//app.use('/system/:name', system);
//const mountRoutes = require('./routes')
//mountRoutes(app)
//var staticPath = path.join(__dirname, 'public','templates','dist');
//console.log(staticPath)
//app.use(express.static(staticPath));
var session = require('express-session')


var jwt = require('jsonwebtoken');

app.set('trust proxy', 1)
app.use(session({
  saveUninitialized:true,
  secret: 'secret',
  resave: true,
  cookie: {
    maxAge: 0,
    sameSite: 'strict',
    secure: true,
  }
}))

require('dotenv').config()

const asyncMiddleware = fn =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .catch(next);
  };

app.get('/',cors(corsOptions), asyncMiddleware(async (req, res, next) => {
logger.info('in get /')
jwt.sign({ sessionId: req.sessionID }, 'secret', { expiresIn: '1h' }, function(err, token) {
  data = {
    'sessionId':  req.sessionID,
    'token':token,
    materialsOpt:materialsOpt}
    res.render('index.html',data )});
}))  

//srv
http.listen(port, () => {
  logger.info(`app listening at http://localhost:${port}`)
})