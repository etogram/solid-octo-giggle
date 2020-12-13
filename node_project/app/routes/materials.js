const Router = require('express-promise-router')
const router = new Router()

const bodyParser = require('body-parser').json()
const mustacheExpress = require('mustache-express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

//csrf
const csrfProtection = csrf({ cookie: true })

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

//cors

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}



var getSystemsResults =async function (location,jumps,security,materials){
//get location id
var sql = 'SELECT system_id from systems where name=%L'  
var query = format(sql,location)  
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

for (let i=1;i<=jumps;i++){
    console.log('jump ='+i)
    var sql ='SELECT system_id \
    FROM   systems \
    WHERE ARRAY[%L]::integer[] && systems.neighbors AND systems.security>%L::real \
    GROUP BY system_id;'
    var query = format(sql,systemList,security);
    

    var res = await db.query(query,[]);
    systemList=[];
    res.rows.forEach(function(e){        
     systemList.push(e.system_id)   
    })
    //systemList = Array.from(new Set(systemList))
    console.log(systemList)

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
    for (let i=0;i<results.length;i++){
        for (let j=0;j<res.rows.length;j++){
            if (results[i].resource==res.rows[j].resource){
                if(results[i].richness_order<res.rows[j].richness_order)
                    results[i]=res.rows[j]
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



var format = require('pg-format');

router.post('/',bodyParser,cors(corsOptions),csrfProtection, async (req, res) => {
    console.log(req.body);
    const opt = req.body.searchOpt;
    var searchOpt=req.body.searchOpt;


    switch (opt) {
      case 'system':
      searchOpt='system';
      var result = await getSystemsResults(req.body.location,req.body.jumps,req.body.securityLevel,req.body.materials)
      res.json(result);
        break;
      case 'constellation':
        searchOpt='constellation';
        if (req.body.materials.length==0){
            var sql=format(constellationSqlAll, req.body.location,req.body.securityLevel);
        }else{
            var materials=[];
            req.body.materials.forEach(function(e){
                materials.push(materialsOpt[e].text);
            });
            var sql=format(constellationSql, req.body.location,req.body.securityLevel,materials);
        }
        results = await db.query(sql,[])
        res.json(results.rows);
        break;
      case 'region':
        searchOpt='region';
        if (req.body.materials.length==0){
            console.log('all')
            var sql=format(regionSqlAll, req.body.location,req.body.securityLevel);
        }else{
            console.log('not all')
            var materials=[];
            req.body.materials.forEach(function(e){
                materials.push(materialsOpt[e].text);
            });
            var sql=format(regionSql, req.body.location,req.body.securityLevel,materials);
        }
        results = await db.query(sql,[])
        res.json(results.rows);

        break;
      default:
        console.log('eerror');
    }


    })

module.exports = router;
