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

//cors

var corsOptions = {
  "origin": "*",
  "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
  "preflightContinue": false,
  "optionsSuccessStatus": 204
}
 const materialsOpt = [ 
{value:0,text:'Industrial Fibers'},
{value:1,text:'Heavy Water'},
{value:2,text:'Noble Metals'},
{value:3,text:'Base Metals'},
{value:4,text:'Lustering Alloy'},
{value:5,text:'Fiber Composite'},
{value:6,text:'Motley Compound'},
{value:7,text:'Smartfab Units'},
{value:8,text:'Liquid Ozone'},
{value:9,text:'Opulent Compound'},
{value:10,text:'Noble Gas'},
{value:11,text:'Glossy Compound'},
{value:12,text:'Toxic Metals'},
{value:13,text:'Suspended Plasma'},
{value:14,text:'Sheen Compound'},
{value:15,text:'Oxygen Isotopes'},
{value:16,text:'Lucent Compound'},
{value:17,text:'Dark Compound'},
{value:18,text:'Heavy Metals'},
{value:19,text:'Construction Blocks'},
{value:20,text:'Condensed Alloy'},
{value:21,text:'Coolant'},
{value:22,text:'Reactive Metals'},
{value:23,text:'Condensates'},
{value:24,text:'Ionic Solutions'},
{value:25,text:'Gleaming Alloy'},
{value:26,text:'Supertensile Plastics'},
{value:27,text:'Nanites'},
{value:28,text:'Polyaramids'},
{value:29,text:'Nanites'},
{value:30,text:'Silicate Glass'},
{value:31,text:'Plasmoids'},
{value:32,text:'Crystal Compound'},
{value:33,text:'Precious Alloy'},
]

/*
sql similarity
CREATE TABLE words AS SELECT word FROM ts_stat('SELECT to_tsvector(''simple'', name),region,constellation FROM systems');
CREATE INDEX words_idx ON words USING GIN (word gin_trgm_ops);
SET pg_trgm.word_similarity_threshold TO 0.6;
SELECT word, word_similarity('ee', word) AS sml
  FROM words
  WHERE 'ee' <% word
  ORDER BY sml,word DESC, word;

*/
systemsSql='SELECT DISTINCT ON (planets.resource) \
       systems.system_id,systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.system_id in (%L) and systems.security>%s and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'
systemsSqlAll='SELECT DISTINCT ON (planets.resource) \
       systems.system_id,systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.system_id in (%L) and systems.security>%s \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'
regionSql='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.region=%L and systems.security>%s and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'
regionSqlAll='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.region=%L and systems.security>%s \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'
constellationSql='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.constellation=%L and systems.security>%s and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'
constellationSqlAll='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.constellation=%L and systems.security>%s\
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

async function getNeighbors(planet_id){
    var sql = 'SELECT neighbors from systems where system_id=%L';  
    var query = format(sql,planet_id);  
    var res = await db.query(query,[]); 
    return  res.rows[0].neighbors
}

async function getCircle(system,rayon,security){

var sql = 'SELECT system_id from systems where name=%L'  
var query = format(sql,system)  
var res = await db.query(query,[])
var results = [res.rows[0].system_id]
var jumpsList = [];

for (var i = 0;i<rayon;i++) {
    var temp = [];
    for (var j = 0;j<results.length;j++){
        var neighbors = await getNeighbors(results[j])
        console.log(neighbors)
        for (var k=0;k<neighbors.length;k++){
            var prom = await getNeighbors(neighbors[k]);
            for (var l=0;l<prom.length;l++){
                var sql = 'SELECT security from systems where system_id=%L'  
                var query = format(sql,prom[l])  
                var res = await db.query(query,[])
                var systemSecurity = [res.rows[0].security]
                if (systemSecurity>security){
                    temp.push(prom[l]);                    
                    }
                }
            }
        }
    for (var j=0;j<temp.length;j++){
        if (results.indexOf(temp[j])==-1){
            results.push(temp[j])
            jumpsList.push({system_id:temp[j],jumps:i})
            }
        }
    }

return {'results':results,'jumpsList':jumpsList}
}



var format = require('pg-format');

router.post('/',bodyParser,cors(corsOptions),csrfProtection, async (req, res) => {
    console.log(req.body);
    const opt = req.body.searchOpt;
    var searchOpt=opt;


    switch (opt) {
  case 'system':
  searchOpt='system';

  var results = await getCircle(req.body.location,req.body.jumps,req.body.securityLevel)
  var systemsList = results.results;
  var jumpsList = results.jumpsList;
    if (req.body.materials.length==0){
        var sql=format(systemsSqlAll, systemsList,req.body.securityLevel);
    }else{
        var materials=[];
        req.body.materials.forEach(function(e){
            materials.push(materialsOpt[e].text);
        });
        var sql=format(systemsSql, systemsList,req.body.securityLevel,materials);
    }
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

    break;
  default:
    console.log('eerror');
}
    var result = await db.query(sql,[])
    if (searchOpt=='system'){
        var results=[]
        for (var i=0;i<result.rows.length;i++){
            for (var j=0;j<jumpsList.length;j++){
                if (jumpsList[j].system_id==result.rows[i].system_id){
                    var temp = result.rows[i];
                    temp.jumps = jumpsList[j].jumps
                    results.push(temp)
                }
            }
        }
        res.json(results)
    }else{
        res.json(result.rows)
    }

    })

module.exports = router;
