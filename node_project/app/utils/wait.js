
const db = require('../core/db')
const logger = require('../utils/logger').logger

const sql = "select count(*) as tables \
from information_schema.tables \
where table_type = 'BASE TABLE';"

const waitForDb = async function(){
    var ret = false
    try{   
        row = await db.query(sql, [], (err, res) => {
            if (err) {
              logger.info(err)
            }
            logger.info(row)
        })
        if (row){ret = true}
    }
    catch(error){logger.info(error)}
    return ret
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const waitingForDb = async function(){
  console.log('waiting for db...');
  var checkOut = false;

  while (checkOut==false){
    console.log('before sleep')
    await sleep(1000);
    console.log('after sleep')
    checkOut = await waitForDb()
    logger.info(checkOut)
    if (checkOut==false){console.log('db still offline')}
    else {console.log('db is online')}
  }
  console.log('end of waiting for db...');
}


module.exports.waitingForDb = waitingForDb;

