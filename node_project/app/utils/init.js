
const console_log = require('./log').console_log
const sql = require('./sql')


const initDB =  async function(){
    console_log('cyan','drop tables systems and planets');
    await sql.dump();
    console_log('cyan','create tables systems and planets');
    await sql.create();
    console_log('cyan','insert data in table systems');
    await sql.insertSystems();
    console_log('cyan','checking data');
    var row = await sql.count();
    if (row == '4512'){
        console_log('green','system data are mounted');
        console_log('green','n row = '+row);
    }else{
        console_log('red','error : restarting server needed');
    }
    var rowMaterials = await sql.countMaterials();
    if (row == '147936'){
        console_log('green','planets data are mounted');
        console_log('green','n row = '+row);
    }else{
        console_log('red','error : restarting server needed');
    }
}

const  checkDB =  async function(){
//check if data are mounted to init server
    var mounted = false;
    try{
        var row =  await sql.count();
        if (row == 4512){
            console_log('green','systems data are mounted')
            console_log('green','n row = '+row);
            mounted = true;
        } else if (row == undefined){
            console_log('red','systems tables doesn t exist')
            mounted = false;            
        } else {
            console_log('red','systems tables need to be mounted')
            mounted = false;                        
        }
        var row =  await sql.countMaterials();
        if (row == 147936){
            console_log('green','planets data are mounted')
            console_log('green','n row = '+row);
            mounted = true;
        } else if (row == undefined){
            console_log('red','planets tables doesn t exist')
            mounted = false;            
        } else {
            console_log('red','planets tables need to be mounted')
            mounted = false;                        
        }
    }catch(error){
        console_log('yellow',error)
    }

    if (mounted==false){
        console_log('red','dataset not mounted...')
        console_log('cyan','dataset initialization...')
        await initDB();
    }
}

module.exports.initDB = checkDB;
