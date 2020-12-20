const logger = require('./logger').logger;

const displayDate = require('./date').displayDate;

//middlewares
//middlware logger
const console_log = function (color,text){

    switch (color.toLowerCase()) {
          case 'green':
            logger.info(text)
            break;
          case 'red':
            logger.info(text)
            break;
          case 'yellow':
            logger.info(text)
            break;
          case 'cyan':
            logger.info(text)
            break;
          default:
            logger.info(text)
        }
    
}

const log  = function (req, res, next) {
    
    var beginDate = Date.now();
    var elements = [
                        'http:: '+req.ip,
                        displayDate(beginDate),
                    ];
    var log = elements.join(' ')


    logger.info(`${log} ${req.method} [STARTED] ${req.originalUrl}`)

    res.on('close', () => {
        var duration = Date.now()-beginDate;
        var closedLog = `${log} ${req.method} [CLOSED] ${res.statusCode} ${req.originalUrl} Duration:${duration} ms`
        var shortStatus = res.statusCode.toString()[0];

        if (shortStatus == '2'){
            logger.info(closedLog)
        }else if(shortStatus == '5'){
            logger.info(closedLog)            
        }else if(shortStatus == '4'){
            logger.info(closedLog)            
        }else{
            logger.info(closedLog)                        
        }

    })

    next()
};

module.exports.log = log
module.exports.console_log = console_log