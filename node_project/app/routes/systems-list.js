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


var format = require('pg-format');
var escap = require('pg-escape');
router.post('/',bodyParser,cors(corsOptions),csrfProtection, async (req, res) => {
    const query = req.body.data;
    const opt = req.body.opt;
    var searchOpt;
    switch (opt) {
  case 'system':
  searchOpt='name';
  var sql = format('SELECT name,region,constellation FROM systems WHERE LOWER(%I) like %L GROUP BY region,constellation,name ORDER BY region,constellation,name', searchOpt, '%' + query.toLowerCase() + '%');
    break;
  case 'constellation':
  searchOpt='constellation';
  var sql = format('SELECT region,constellation FROM systems WHERE LOWER(%I) like %L GROUP BY region,constellation ORDER BY region,constellation', searchOpt, '%' + query.toLowerCase() + '%');
    break;
  case 'region':
  searchOpt='region';
  var sql = format('SELECT region FROM systems WHERE LOWER(%I) like %L GROUP BY region ORDER BY region', searchOpt, '%' + query.toLowerCase() + '%');
    break;
  default:
    console.log('eerror');
}   


    const { rows } = await db.query(sql,[])
    console.log(rows)    
    res.json(rows)

    })

module.exports = router;
/*


app.get('/:id', (req, res, next) => {
  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, res) => {
    if (err) {
      return next(err)
    }
    res.send(res.rows[0])
  })
})
*/