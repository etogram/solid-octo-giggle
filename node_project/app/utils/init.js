
const logger = require('./logger').logger
const sql = require('./sql')

/*
ne pas oublier de rajouter ca a l init pour l instant
alter table planets add richness_order numeric;
UPDATE planets
SET richness_order =  case
    when richness = 'Perfect' then 1
    when richness = 'Rich' then 0.75
    when richness = 'Medium' then 0.5
    when richness = 'Poor' then 0.25
  end ;

*/


const initDB =  async function(){
    logger.info('drop tables systems and planets');
    await sql.dump();
    logger.info('create tables systems and planets');
    await sql.create();
    logger.info('insert data in table systems');
    await sql.insertSystems();
    logger.info('alter and update');
    await sql.alter();
    await sql.update();
    logger.info('checking data');
    var row = await sql.count();
    if (row == '4512'){
        logger.info('system data are mounted');
        logger.info('n row = '+row);
    }else{
        logger.error('error : restarting server needed');
    }
    var rowMaterials = await sql.countMaterials();
    if (row == '147936'){
        logger.info('planets data are mounted');
        logger.info('n row = '+row);
    }else{
        logger.error('error : restarting server needed');
    }
}

const  checkDB =  async function(){
//check if data are mounted to init server
    var mounted = false;
    try{
        var row =  await sql.count();
        if (row == 4512){
            logger.info('systems data are mounted')
            logger.info('n row = '+row);
            mounted = true;
        } else if (row == undefined){
            logger.info('systems tables doesn t exist')
            mounted = false;            
        } else {
            logger.info('systems tables need to be mounted')
            mounted = false;                        
        }
        var row =  await sql.countMaterials();
        if (row == 147936){
            logger.info('planets data are mounted')
            logger.info('n row = '+row);
            mounted = true;
        } else if (row == undefined){
            logger.error('planets tables doesn t exist')
            mounted = false;            
        } else {
            logger.error('planets tables need to be mounted')
            mounted = false;                        
        }
    }catch(error){
        logger.error(error)
    }

    if (mounted==false){
        logger.error('dataset not mounted...')
        logger.info('dataset initialization...')
        await initDB();
    }
}

module.exports.initDB = checkDB;
