const displayDate = require('./date').displayDate;

//middlewares
//middlware logger
const console_log = function (color,text){
    const Reset = "\x1b[0m";
    const FgRed = "\x1b[31m"
    const FgGreen = "\x1b[32m"
    const FgYellow = "\x1b[33m"
    const FgCyan = "\x1b[36m"

    switch (color.toLowerCase()) {
          case 'green':
            msg = FgGreen+text+Reset
            break;
          case 'red':
            msg = FgRed+text+Reset
            break;
          case 'yellow':
            msg = FgYellow+text+Reset
            break;
          case 'cyan':
            msg = FgCyan+text+Reset
            break;
          default:
            msg = Reset+text+Reset
        }
    console.log(msg)
}

const logger = function (req, res, next) {
    
    var beginDate = Date.now();
    var elements = [
                        'http:: '+req.ip,
                        displayDate(beginDate),
                    ];
    var log = elements.join(' ')


    console.log(`${log} ${req.method} [STARTED] ${req.originalUrl}`)

    res.on('close', () => {
        var duration = Date.now()-beginDate;
        var closedLog = `${log} ${req.method} [CLOSED] ${res.statusCode} ${req.originalUrl} Duration:${duration} ms`
        var shortStatus = res.statusCode.toString()[0];

        if (shortStatus == '2'){
            console_log('green',closedLog)
        }else if(shortStatus == '5'){
            console_log('red',closedLog)            
        }else if(shortStatus == '4'){
            console_log('yellow',closedLog)            
        }else{
            console_log('white',closedLog)                        
        }

    })

    next()
};

module.exports.logger = logger
module.exports.console_log = console_log