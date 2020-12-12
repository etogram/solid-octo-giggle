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

module.exports.displayDate = displayDate