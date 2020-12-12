const db = require('./db')

/*
var format = require('pg-format');
var sql = format('SELECT * FROM %I WHERE my_col = %L %s', 'my_table', 34, 'LIMIT 10');
format(fmt, ...)
Returns a formatted string based on fmt which has a style similar to the C function sprintf().

%% outputs a literal % character.
%I outputs an escaped SQL identifier.
%L outputs an escaped SQL literal.
%s outputs a simple string.
const queryGetOne(id)=

  db.query('SELECT * FROM users WHERE id = $1', [req.params.id], (err, res) => {
    if (err) {
      return next(err)
    }
    res.send(res.rows[0])
  })

  */