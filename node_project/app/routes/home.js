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



router.get('/',cors(corsOptions),csrfProtection, async (req, res) => {

    var sql='SELECT system_id,name,region,constellation FROM systems'
    const { rows } = await db.query(sql, [])

    var context = { 
    defaultOptions:JSON.stringify(rows),
    csrfToken: req.csrfToken(),
    materialsOpt:JSON.stringify(materialsOpt)}
    
    res.render('base.html',context )

    })

module.exports = router;
