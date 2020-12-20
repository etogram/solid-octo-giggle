const logger = require('../utils/logger').logger;

const db = require('../core/db')

const systemJump0Sql = require('./sql/syntax').systemJump0Sql;
const systemJumpSql = require('./sql/syntax').systemJumpSql;
const systemJump0SqlAll = require('./sql/syntax').systemJump0SqlAll;
const systemJumpSqlAll = require('./sql/syntax').systemJumpSqlAll;
const regionSql = require('./sql/syntax').regionSql;
const regionSqlAll = require('./sql/syntax').regionSqlAll;
const constellationSql = require('./sql/syntax').constellationSql;
const constellationSqlAll = require('./sql/syntax').constellationSqlAll;
const materialsOpt = require('./sql/syntax').materialsOpt;
const format = require('pg-format');


const getSystemsResults = async function (location,jumps,security,materials){
//get location id
var sql = 'SELECT system_id from systems where LOWER(name)=%L'  
var query = format(sql,location.toLowerCase())  
var res = await db.query(query,[])
var system_id = res.rows[0].system_id
var results;

//jump=0
if (materials.length==0){
    var query = format(systemJump0SqlAll,system_id);  
}else{
    var materialsList=[];
        materials.forEach(function(e){
            materialsList.push(materialsOpt[e].text);
        });
    var query = format(systemJump0Sql,system_id,materialsList);  
}
var res = await db.query(query,[]);
results = res.rows;
//jump>0
var systemList=[system_id];
var memory=[system_id];
for (let i=1;i<=jumps;i++){

    var sql ='SELECT system_id \
    FROM   systems \
    WHERE ARRAY[%L]::integer[] && systems.neighbors AND systems.security>%L::real \
    GROUP BY system_id;'
    var query = format(sql,systemList,security);
    
    var res = await db.query(query,[]);
    systemList=[];
    res.rows.forEach(function(e){        
     if(memory.indexOf(e.system_id)==-1){
        systemList.push(e.system_id)
        memory.push(e.system_id)}
    })

if (materials.length==0){
    var query = format(systemJumpSqlAll,i,systemList,security);  
}else{
    var materialsList=[];
        materials.forEach(function(e){
            materialsList.push(materialsOpt[e].text);
        });
    var query = format(systemJumpSql,i,systemList,security,materialsList);  
}
    var res = await db.query(query,[]);


    //update results with new value if better
    for (let j=0;j<results.length;j++){
        for (let k=0;k<res.rows.length;k++){
            if (results[j].resource==res.rows[k].resource){
                if(results[j].richness_order<res.rows[k].richness_order)
                    results[j]=res.rows[k]
            }            
        }
    }
    //append results with new type of mat if still not exists
    var currentMatList=[];
    results.forEach(e=>currentMatList.push(e.resource)) 
    for (let j=0;j<res.rows.length;j++){
        if (currentMatList.indexOf(res.rows[j].resource)==-1){
                    results.push(res.rows[j])
            }            
        }
    }

    //ordering the results
    function getOrderMat(resource){
        var res;
        materialsOpt.forEach(function(e){
                if (e.text==resource){
                    res = e.value 
                }
            })
        return res
    }
    results.sort(function(a, b) {  
      return  getOrderMat(a.resource)- getOrderMat(b.resource);
    });

    return  results
}

const getResults = async function (data){

    var opt = data.searchOpt;
    var location = data.location;
    var materials = data.materials;
    var jumps = data.jumps;
    var security = data.securityLevel;


    var mat;
    var searchOpt;
    switch (opt) {
      case 'system':
      searchOpt='system';
      var result = await getSystemsResults(location,jumps,security,materials)
      return result;
        break;
      case 'constellation':
        searchOpt='constellation';
        if (materials.length==0){
            var sql=format(constellationSqlAll, location,security);
        }else{
            var materialsList=[];
            materials.forEach(function(e){
                materialsList.push(materialsOpt[e].text);
            });
            var sql=format(constellationSql, location,security,materialsList);
        }
        results = await db.query(sql,[])
        return results.rows;
        break;
      case 'region':
        searchOpt='region';
        if (materials.length==0){
            var sql=format(regionSqlAll, location,security);
        }else{
            var materialsList=[];
            materials.forEach(function(e){
                materialsList.push(materialsOpt[e].text);
            });
            var sql=format(regionSql, location,security,materialsList);
        }
        results = await db.query(sql,[])
        return results.rows;

        break;
      default:
        logger.info('error');
    }

}

module.exports.getResults = getResults;
