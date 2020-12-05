const express = require('express')
const app = express()
const port = 3000

const getLocaleDate = function(date){
  var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
  d = new Date(date);
  return d.toLocaleDateString('fr', options)
};

const getLocaleTime = function(date){
  d = new Date(date);
  return d.toLocaleTimeString('fr')            
}

const displayDate = function(date){
  return getLocaleDate(date)+'~'+getLocaleTime(date)
}

console.log(displayDate(new Date()))

app.get('/', (req, res) => {
    var now = displayDate(new Date());
  res.send('Hello World!<br>'+now)
})

app.listen(port, () => {
    console.log('yop')
  console.log(`Example app listening at http://localhost:${port}`)
})