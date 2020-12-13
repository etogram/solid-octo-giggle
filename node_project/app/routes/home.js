const Router = require('express-promise-router')
const router = new Router()

const bodyParser = require('body-parser').json()
const mustacheExpress = require('mustache-express');
const cors = require('cors');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

//env
require('dotenv').config()

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
const materialsOpt = require('./sql/syntax').materialsOpt;




router.get('/',cors(corsOptions),csrfProtection, async (req, res) => {

    var sql='SELECT system_id,name,region,constellation FROM systems'
    const { rows } = await db.query(sql, [])

    var context = { 
    domainUrl:JSON.stringify(process.env.DOMAIN_URL),
    defaultOptions:JSON.stringify(rows),
    csrfToken: req.csrfToken(),
    materialsOpt:JSON.stringify(materialsOpt)}
    
    res.render('base.html',context )

    })

module.exports = router;
