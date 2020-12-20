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

const systemJump0SqlAll ='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation, \
       systems.name as system,systems.security, planets.name as planet, \
       planets.resource, planets.richness,planets.richness_order, \
       0 as jumps \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.system_id=%L \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const systemJump0Sql ='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation, \
       systems.name as system,systems.security, planets.name as planet, \
       planets.resource, planets.richness,planets.richness_order, \
       0 as jumps \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.system_id=%L and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const systemJumpSqlAll ='SELECT DISTINCT ON (planets.resource) \
           systems.region,systems.constellation, \
           systems.name as system,systems.security, planets.name as planet, \
           planets.resource, planets.richness,planets.richness_order, \
           %L as jumps \
    FROM   planets \
    INNER JOIN systems ON planets.system_id=systems.system_id \
    WHERE systems.system_id in (%L) AND systems.security>%L::real \
    ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const systemJumpSql ='SELECT DISTINCT ON (planets.resource) \
           systems.region,systems.constellation, \
           systems.name as system,systems.security, planets.name as planet, \
           planets.resource, planets.richness,planets.richness_order, \
           %L as jumps \
    FROM   planets \
    INNER JOIN systems ON planets.system_id=systems.system_id \
    WHERE systems.system_id in (%L)  AND systems.security>%L::real and resource in (%L) \
    ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const regionSql='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.region=%L and systems.security>%s and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const regionSqlAll='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.region=%L and systems.security>%s \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const constellationSql='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.constellation=%L and systems.security>%s and resource in (%L) \
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

const constellationSqlAll='SELECT DISTINCT ON (planets.resource) \
       systems.region,systems.constellation,systems.name as system,systems.security, planets.name as planet, planets.resource, planets.richness,planets.richness_order \
FROM   planets \
INNER JOIN systems ON planets.system_id=systems.system_id \
WHERE systems.constellation=%L and systems.security>%s\
ORDER  BY planets.resource, planets.richness_order DESC NULLS FIRST;'

   
module.exports.systemJump0Sql = systemJump0Sql;
module.exports.systemJump0SqlAll = systemJump0SqlAll;
module.exports.systemJumpSqlAll = systemJumpSqlAll;
module.exports.systemJumpSql = systemJumpSql;
module.exports.regionSql = regionSql;
module.exports.regionSqlAll = regionSqlAll;
module.exports.constellationSql = constellationSql;
module.exports.constellationSqlAll = constellationSqlAll;
module.exports.materialsOpt = materialsOpt;
