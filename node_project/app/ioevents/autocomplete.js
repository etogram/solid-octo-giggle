const logger = require('../utils/logger').logger;


const db = require('../core/db')

var format = require('pg-format');



const autocomplete = async function(searchInput,searchOption){

    switch (searchOption) {
        case 'system':
            var searchOpt='name';
            var sql = format('SELECT name,region,constellation FROM systems WHERE LOWER(%I) like %L GROUP BY region,constellation,name ORDER BY region,constellation,name', searchOpt, '%' + searchInput.toLowerCase() + '%');
            break;
        case 'constellation':
            var searchOpt='constellation';
            var sql = format('SELECT region,constellation FROM systems WHERE LOWER(%I) like %L GROUP BY region,constellation ORDER BY region,constellation', searchOpt, '%' + searchInput.toLowerCase() + '%');
            break;
        case 'region':
            var searchOpt='region';
            var sql = format('SELECT region FROM systems WHERE LOWER(%I) like %L GROUP BY region ORDER BY region limit 10', searchOpt, '%' + searchInput.toLowerCase() + '%');
            break;
        default:
            logger.info('error');
    }   

    try{
        const { rows } = await db.query(sql,[])
            if (rows.length<15){
                return rows                
            } else {
                return rows.slice(0,15);
            }

        

    }catch(error){
        logger.info(error)
    }
}

module.exports.autocomplete = autocomplete;
