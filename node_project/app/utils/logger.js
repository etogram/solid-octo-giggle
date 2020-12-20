//winston
const appRoot = require('app-root-path');
const winston = require('winston');

const options = {
  file: {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.simple()
      )
  },
  console: {
    level:'debug',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize({all:true}),
        winston.format.simple()
      )
    },
};


const logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  },
};

module.exports.logger = logger