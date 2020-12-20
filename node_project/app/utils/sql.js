const logger = require('./logger').logger;

const db = require('../core/db')
const data = require('../data/src').data.data

const count = async function(){
    var row,nrow=0;
    try{   
        row = await db.query('SELECT count(*) FROM systems', [], (err, res) => {
            if (err) {
              logger.info(err)
            }
            logger.info(row.rows[0].count)
        })
        nrow = row.rows[0].count;
    }
    catch(error){logger.info(error);nrow=-1}
    return nrow;
}
const countMaterials = async function(){
    var row,nrow=0;
    try{   
        row = await db.query('SELECT count(*) FROM planets', [], (err, res) => {
            if (err) {
              logger.info(err)
            }
            logger.info(row.rows[0].count)
        })
        nrow = row.rows[0].count;
    }
    catch(error){logger.info(error);nrow=-1}
    return nrow;
}
const dump = async function(){
    var syntax = `DROP TABLE IF EXISTS planets;
    DROP TABLE IF EXISTS systems;`

    try{
        await db.query(syntax, [], (err, res) => {
            if (err) {
              console.log(err)
            }
            return res
        })}
    catch(error){return error}

}

const create = async function(){
    var syntax =`CREATE TABLE systems ( pk serial primary key, system_id integer UNIQUE, name varchar(50),  region varchar(50), constellation varchar(50), security numeric(5,2), neighbors integer[]);
    CREATE TABLE planets( planet_id INT GENERATED ALWAYS AS IDENTITY, system_id INT, name varchar(50), type varchar(50), resource varchar(50), richness varchar(50), output numeric(5,2), absrich numeric(5,2), PRIMARY KEY(planet_id), CONSTRAINT fk_system  FOREIGN KEY(system_id)   REFERENCES systems(system_id)  ON DELETE SET NULL );`;
    
    try{
        await db.query(syntax, [], (err, res) => {
            if (err) {
              logger.info(err)
            }
            return res
        })}
    catch(error){return error}

}

const insertSystems =  async function(){
var count=0
console.log(data.length)
    for (var i=0;i<data.length;i++){
        var systemData = data[i];
        var system_id = i;
        var region = systemData[0];
        var constellation = systemData[1];
        var name = systemData[2];
        var security = systemData[3];
        var neighbors = systemData[4];
        var syntax =`INSERT INTO systems (system_id,region, constellation, name,  security,neighbors)
                        VALUES ($1,$2,$3,$4,$5,$6);`
        try{
            await db.query(syntax, [system_id,region,constellation,name,security,neighbors], (err, res) => {
                if (err) {
                  logger.info(err)
                }
                return res
            })}
        catch(error){return error}
        var planets = systemData[5];
        for (var k=0;k<planets.length;k++){

            var planetName = planets[k][0]
            var planetType = planets[k][1]
            var planetMat = planets[k][2]
            for (var j=0;j<planetMat.length;j++){//data.length
                var syntax =`INSERT INTO planets (system_id,name,type, resource,richness,output,absrich)
                    VALUES ($1,$2,$3,$4,$5,$6,$7);`
                try{
                    await db.query(syntax, [system_id,planetName,planetType,planetMat[j][0],planetMat[j][1],planetMat[j][2],planetMat[j][3]], (err, res) => {
                        if (err) {
                          logger.info(err)
                        }
                        return res
                    })}
                catch(error){return error}
        logger.info('data loading : '+Math.round(i/data.length*100)+'%');

            }

        }
    }
    logger.info(count)
}


module.exports.count = count;
module.exports.countMaterials = countMaterials;
module.exports.dump = dump;
module.exports.create = create;
module.exports.insertSystems = insertSystems;



/*
CREATE TABLE planets(
    planet_id INT GENERATED ALWAYS AS IDENTITY,
    name varchar(50),
    type varchar(50),
    resource varchar(50),
    richness varchar(50),
    output numeric(5,2),
    absrich numeric(5,2)
    PRIMARY KEY(planet_id),
    CONSTRAINT fk_system
        FOREIGN KEY(planet_id) 
        REFERENCES systems(id)
        ON DELETE SET NULL
    );
var insert=`

INSERT INTO systems (id, name, region, constellation, security,neighbors)
    VALUES (0,'The Forge','Kimotoro','Jita',0.95,'{1,2,3,4,5,6,7}');

INSERT INTO planets (name, type, resource, richness,output,absrich)
    VALUES ('Jita III','Temperate','Industrial Fibers','Perfect',4.85,64);
`
    CONSTRAINT uniqueness UNIQUE(id)
var drop=`
DROP TABLE IF EXISTS systems;

`


var create = `
DROP TABLE IF EXISTS systems;
DROP TABLE IF EXISTS planets;

CREATE TABLE systems (
    pk serial primary key,
    id integer,
    name varchar(50), 
    region varchar(50),   
    constellation varchar(50),
    security numeric(5,2),
    neighbors integer[]
);

CREATE TABLE planets(
    pk serial primary key,
    id serial,
    name varchar(50),
    type varchar(50),
    resource varchar(50),
    richness varchar(50),
    output numeric(5,2),
    absrich numeric(5,2)
);

INSERT INTO systems (id, name, region, constellation, security,neighbors)
    VALUES (0,'The Forge','Kimotoro','Jita',0.95,'{1,2,3,4,5,6,7}');

INSERT INTO planets (name, type, resource, richness,output,absrich)
    VALUES ('Jita III','Temperate','Industrial Fibers','Perfect',4.85,64);
`

var insert= `INSERT INTO systems VALUES
    ('Jita III','Temperate','Industrial Fibers','Perfect',4.85,64');
`
var count=`
SELECT * FROM systems;
`
*/


/*
"Region","Constellation","Name","Security","Neighbors",["PlanetName","PlanetType",["Resource","Richness","Output","AbsRich"]]]
  liste ["PlanetName","PlanetType",["Resource","Richness","Output","AbsRich"]]
  data JSONB



var createTableQuery = `
DROP TABLE IF EXISTS systems; 
DROP TABLE IF EXISTS planets; 
DROP TABLE IF EXISTS materials; 

CREATE TABLE systems (
    id serial primary key,
    name varchar(50), 
    region varchar(50),   
    constellation varchar(50),
    security numeric(1),
    neighbors integer[],
);

CREATE TABLE planets(
    id int generated always as identity,
    name varchar(50),
    type varchar(50),
    PRIMARY KEY(id),
    CONSTRAINT fk_systems
        FOREIGN KEY(id) 
        REFERENCES systems(id)
);

CREATE TABLE materials(
    id int generated always as identity,
    resource varchar(50),
    richness varchar(50),
    output numeric(2),
    absrich numeric(2),
    PRIMARY KEY(id),
    CONSTRAINT fk_planets
        FOREIGN KEY(id) 
        REFERENCES planets(id)
);

`
*/