//pg settings

//const username = 'admin'
const username = 'admin'
const password = 'admin'
const host = 'db'
const port = 5432
const database = 'db'

//e passer en environ variables
const pgConnSettings = {
    user : username,
    password : password,
    host : host,
    port : port,
    database : database
}

//const pgUri = `postgresql://${username}:${password}@${host}:${5432}/${database}`

module.exports.pgConnSettings = pgConnSettings;