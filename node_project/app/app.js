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
const bodyParser = require('body-parser').json()
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const initDB = require('./utils/init').initDB;

const logger = require('./utils/logger').logger;



//express app
const app = express()
const port = 3000

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
//socket
var http = require('http').createServer(app);
var io = require('socket.io')(http, {
  cors: {
    origin: '*',
  }
});;

const autocomplete = require('./ioevents/autocomplete').autocomplete;
const getResults = require('./ioevents/find').getResults;


io.on('connection',async (socket) => {
  logger.info('a user connected');

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

// db initialization
initDB();

//mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/public/templates');

//bodyparser
app.use(bodyParser) // for parsing application/json

//helmet
//app.use(helmet());

// parse cookies
// we need this because "cookie" is true in csrfProtection
app.use(cookieParser())

//favicon
app.use(favicon(path.join(__dirname, 'public','img', 'favicon.ico')))



//routes
//app.use('/system/:name', system);
const mountRoutes = require('./routes')
mountRoutes(app)

//srv
http.listen(port, () => {
  logger.info(`app listening at http://localhost:${port}`)
})